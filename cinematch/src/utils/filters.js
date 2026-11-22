import { WATCH_REGION } from '../config';
import { DURATIONS, MOODS, PLATFORMS } from './constants';

export const DEFAULT_FILTERS = {
  genres: [], // TMDB genre ids (multi-select)
  language: '', // ISO 639-1 code, '' = any
  yearFrom: '',
  yearTo: '',
  minRating: 0, // 0 = any
  duration: '', // 'short' | 'medium' | 'long' | ''
  mood: '',
  type: '', // 'popular' | 'trending' | 'underrated' | 'classic' | ''
  platform: 'any',
};

export function countActiveFilters(f) {
  return [
    f.genres.length > 0,
    Boolean(f.language),
    Boolean(f.yearFrom || f.yearTo),
    f.minRating > 0,
    Boolean(f.duration),
    Boolean(f.mood),
    Boolean(f.type),
    f.platform && f.platform !== 'any',
  ].filter(Boolean).length;
}

const isoDate = (d) => d.toISOString().slice(0, 10);
const todayISO = () => isoDate(new Date());
const daysAgoISO = (days) => {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return isoDate(d);
};

/**
 * Turns the raw UI selections into one normalised "criteria" object. Both the TMDB query
 * builder (server-side filtering) and `matchesCriteria` (client-side filtering, used for
 * title search) read from it, so the two can never disagree about what a filter means.
 */
export function resolveCriteria(filters) {
  const mood = MOODS.find((m) => m.value === filters.mood);
  const duration = DURATIONS.find((d) => d.value === filters.duration);
  const platform = PLATFORMS.find((p) => p.value === filters.platform);

  // Explicit genres win; otherwise the mood's genres are used as the filter.
  const genreIds = filters.genres.length ? filters.genres : mood ? mood.genres : [];

  let dateFrom = filters.yearFrom ? `${filters.yearFrom}-01-01` : null;
  let dateTo = filters.yearTo ? `${filters.yearTo}-12-31` : null;
  const today = todayISO();
  if (!dateTo || dateTo > today) dateTo = today; // never recommend unreleased movies

  let minRating = Number(filters.minRating) || 0;
  let typeMinVotes = null; // vote thresholds that come from the Movie Type
  let typeMaxVotes = null;

  switch (filters.type) {
    case 'popular':
      typeMinVotes = 500;
      break;
    case 'trending': {
      // "Trending" = recent releases that people are watching right now.
      const from = daysAgoISO(730);
      if (!dateFrom || dateFrom < from) dateFrom = from;
      break;
    }
    case 'underrated':
      minRating = Math.max(minRating, 7);
      typeMinVotes = 100;
      typeMaxVotes = 2500;
      break;
    case 'classic':
      if (dateTo > '1999-12-31') dateTo = '1999-12-31';
      minRating = Math.max(minRating, 7);
      typeMinVotes = 300;
      break;
    default:
      break;
  }

  return {
    genreIds,
    language: filters.language || '',
    dateFrom,
    dateTo,
    minRating,
    typeMinVotes,
    typeMaxVotes,
    runtimeMin: duration?.min ?? null,
    runtimeMax: duration?.max ?? null,
    providerIds: platform?.ids ?? [],
    impossible: Boolean(dateFrom && dateFrom > dateTo),
  };
}

// ---------- Server-side (TMDB /discover) ----------

const SERVER_SORT = {
  best: 'popularity.desc',
  popular: 'popularity.desc',
  rating: 'vote_average.desc',
  newest: 'primary_release_date.desc',
  oldest: 'primary_release_date.asc',
  // TMDB can't sort by runtime, so we pull popular candidates and sort them client-side.
  shortest: 'popularity.desc',
  longest: 'popularity.desc',
};

export const serverSortFor = (sortKey) => SERVER_SORT[sortKey] || 'popularity.desc';

export function buildDiscoverParams(c, serverSort) {
  let minVotes = c.typeMinVotes ?? 50; // baseline keeps obscure/unrated titles out
  // Guard against "10/10 from 3 votes" when sorting by rating or oldest-first.
  if (serverSort === 'vote_average.desc') minVotes = Math.max(minVotes, 300);
  if (serverSort === 'primary_release_date.asc') minVotes = Math.max(minVotes, 100);
  if (c.typeMaxVotes) minVotes = Math.min(minVotes, c.typeMaxVotes);

  const params = {
    sort_by: serverSort,
    include_adult: false,
    include_video: false,
    'vote_count.gte': minVotes,
    'primary_release_date.lte': c.dateTo,
  };

  if (c.dateFrom) params['primary_release_date.gte'] = c.dateFrom;
  if (c.genreIds.length) params.with_genres = c.genreIds.join('|'); // "|" = match ANY genre
  if (c.language) params.with_original_language = c.language;
  if (c.minRating) params['vote_average.gte'] = c.minRating;
  if (c.typeMaxVotes) params['vote_count.lte'] = c.typeMaxVotes;
  if (c.runtimeMin) params['with_runtime.gte'] = c.runtimeMin;
  if (c.runtimeMax) params['with_runtime.lte'] = c.runtimeMax;
  if (c.providerIds.length) {
    params.with_watch_providers = c.providerIds.join('|');
    params.watch_region = WATCH_REGION;
  }
  return params;
}

// ---------- Client-side (used when searching by title) ----------

export function matchesCriteria(movie, c) {
  if (c.impossible) return false;

  if (c.genreIds.length && !movie.genreIds.some((id) => c.genreIds.includes(id))) return false;
  if (c.language && movie.language !== c.language) return false;

  if (movie.releaseDate) {
    if (c.dateFrom && movie.releaseDate < c.dateFrom) return false;
    if (c.dateTo && movie.releaseDate > c.dateTo) return false;
  } else if (c.dateFrom) {
    return false;
  }

  if (c.minRating && movie.rating < c.minRating) return false;
  if (c.typeMinVotes && movie.votes < c.typeMinVotes) return false;
  if (c.typeMaxVotes && movie.votes > c.typeMaxVotes) return false;

  if (c.runtimeMin || c.runtimeMax) {
    if (!movie.runtime) return false;
    if (c.runtimeMin && movie.runtime < c.runtimeMin) return false;
    if (c.runtimeMax && movie.runtime > c.runtimeMax) return false;
  }

  if (c.providerIds.length && !movie.providerIds.some((id) => c.providerIds.includes(id))) {
    return false;
  }
  return true;
}

// ---------- Recommendation score & sorting ----------

/**
 * 0-100 "match" percentage. Quality (rating) and buzz (popularity) always count; mood and
 * genre fit only count when the user picked them, so the percentage stays meaningful either way.
 */
export function matchScore(movie, filters) {
  const mood = MOODS.find((m) => m.value === filters.mood);

  let score = (movie.rating / 10) * 40;
  score += Math.min(1, Math.log10((movie.popularity || 0) + 1) / 3) * 20;
  let total = 60;

  if (mood) {
    const overlap = movie.genreIds.filter((g) => mood.genres.includes(g)).length;
    score += (Math.min(overlap, 2) / 2) * 25;
    total += 25;
  }

  if (filters.genres.length) {
    const overlap = movie.genreIds.filter((g) => filters.genres.includes(g)).length;
    score += (overlap / filters.genres.length) * 15;
    total += 15;
  }

  return Math.max(0, Math.min(100, Math.round((score / total) * 100)));
}

const byPopularity = (a, b) => b.popularity - a.popularity;

// Compare numbers but always push "unknown" values to the end of the list.
const nullsLast = (get, direction) => (a, b) => {
  const x = get(a);
  const y = get(b);
  if (x == null && y == null) return 0;
  if (x == null) return 1;
  if (y == null) return -1;
  return direction * (x - y) || byPopularity(a, b);
};

export function sortMovies(list, sortKey) {
  const comparators = {
    best: (a, b) => (b.match ?? 0) - (a.match ?? 0) || byPopularity(a, b),
    rating: (a, b) => b.rating - a.rating || b.votes - a.votes,
    popular: byPopularity,
    newest: (a, b) => (b.releaseDate || '').localeCompare(a.releaseDate || ''),
    oldest: (a, b) => (a.releaseDate || '9999').localeCompare(b.releaseDate || '9999'),
    shortest: nullsLast((m) => m.runtime, 1),
    longest: nullsLast((m) => m.runtime, -1),
  };
  return [...list].sort(comparators[sortKey] || byPopularity);
}
