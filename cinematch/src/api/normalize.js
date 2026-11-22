import { WATCH_REGION } from '../config';
import { GENRE_NAMES } from '../utils/constants';
import { languageName } from '../utils/helpers';

// Collapses TMDB's watch/providers payload for our region into flat lists.
function extractProviders(watchProviders) {
  const region = watchProviders?.results?.[WATCH_REGION];
  if (!region) return { names: [], ids: [] };

  // Streaming options first, rent/buy last.
  const all = [region.flatrate, region.free, region.ads, region.rent, region.buy]
    .filter(Boolean)
    .flat();

  const seen = new Set();
  const names = [];
  const ids = [];
  for (const p of all) {
    if (seen.has(p.provider_id)) continue;
    seen.add(p.provider_id);
    names.push(p.provider_name);
    ids.push(p.provider_id);
  }
  return { names, ids };
}

// Works for list items (genre_ids, no runtime) and full detail responses (genres[], runtime).
export function normalizeMovie(raw) {
  const genreIds = raw.genres ? raw.genres.map((g) => g.id) : raw.genre_ids || [];
  const genres = raw.genres
    ? raw.genres.map((g) => g.name)
    : genreIds.map((id) => GENRE_NAMES[id]).filter(Boolean);
  const providers = extractProviders(raw['watch/providers']);
  const releaseDate = raw.release_date || '';

  return {
    id: raw.id,
    title: raw.title || raw.original_title || 'Untitled',
    tagline: raw.tagline || '',
    overview: raw.overview || '',
    releaseDate,
    year: releaseDate ? releaseDate.slice(0, 4) : '—',
    posterPath: raw.poster_path || null,
    backdropPath: raw.backdrop_path || null,
    // NOTE: this is TMDB's user score (0-10), not IMDb's. TMDB does not expose IMDb ratings.
    rating: Math.round((raw.vote_average || 0) * 10) / 10,
    votes: raw.vote_count || 0,
    popularity: raw.popularity || 0,
    genreIds,
    genres,
    language: raw.original_language || '',
    languageName: languageName(raw.original_language),
    runtime: raw.runtime || null,
    platforms: providers.names,
    providerIds: providers.ids,
    imdbId: raw.imdb_id || null,
  };
}

// Extra data for the details modal.
export function normalizeExtras(raw) {
  const movie = normalizeMovie(raw);
  const crew = raw.credits?.crew || [];
  const cast = raw.credits?.cast || [];
  const videos = raw.videos?.results || [];

  const youtube = videos.filter((v) => v.site === 'YouTube');
  const trailer =
    youtube.find((v) => v.type === 'Trailer' && v.official) ||
    youtube.find((v) => v.type === 'Trailer') ||
    youtube[0];

  return {
    movie,
    directors: crew
      .filter((c) => c.job === 'Director')
      .map((c) => c.name)
      .slice(0, 2),
    cast: cast.slice(0, 6).map((c) => c.name),
    trailerUrl: trailer ? `https://www.youtube.com/watch?v=${trailer.key}` : null,
    watchLink: raw['watch/providers']?.results?.[WATCH_REGION]?.link || null,
  };
}
