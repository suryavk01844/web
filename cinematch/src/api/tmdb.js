import { API_BASE, API_KEY, HAS_API_KEY, USES_BEARER } from '../config';
import { normalizeExtras, normalizeMovie } from './normalize';

export class ApiError extends Error {
  constructor(message, code = 'unknown', status = 0) {
    super(message);
    this.name = 'ApiError';
    this.code = code;
    this.status = status;
  }
}

// Session cache of in-flight/finished requests, so re-selecting a filter or re-opening a
// movie doesn't hit the network again. Failed requests are evicted so "Try again" works.
const cache = new Map();

async function doFetch(path, search) {
  const url = new URL(API_BASE + path);
  search.forEach((value, key) => url.searchParams.set(key, value));

  const headers = { accept: 'application/json' };
  if (USES_BEARER) headers.Authorization = `Bearer ${API_KEY}`;
  else url.searchParams.set('api_key', API_KEY);

  let res;
  try {
    res = await fetch(url, { headers });
  } catch {
    throw new ApiError(
      'Could not reach TMDB. Please check your internet connection and try again.',
      'network'
    );
  }

  if (!res.ok) {
    if (res.status === 401) {
      throw new ApiError(
        'TMDB rejected the API key. Please check VITE_TMDB_API_KEY in your .env file.',
        'auth',
        401
      );
    }
    if (res.status === 429) {
      throw new ApiError(
        'Too many requests to TMDB. Please wait a few seconds and try again.',
        'rate',
        429
      );
    }
    if (res.status >= 500) {
      throw new ApiError('TMDB is having trouble right now. Please try again shortly.', 'server', res.status);
    }
    throw new ApiError(`TMDB request failed (${res.status}).`, 'http', res.status);
  }

  try {
    return await res.json();
  } catch {
    throw new ApiError('Received an unreadable response from TMDB.', 'parse');
  }
}

function request(path, params = {}) {
  if (!HAS_API_KEY) {
    return Promise.reject(new ApiError('TMDB API key is missing.', 'no-key'));
  }

  const search = new URLSearchParams({ language: 'en-US' });
  Object.keys(params)
    .sort()
    .forEach((key) => {
      const value = params[key];
      if (value !== undefined && value !== null && value !== '') search.set(key, String(value));
    });

  const cacheKey = `${path}?${search.toString()}`;
  if (cache.has(cacheKey)) return cache.get(cacheKey);

  const promise = doFetch(path, search).catch((err) => {
    cache.delete(cacheKey);
    throw err;
  });
  cache.set(cacheKey, promise);
  return promise;
}

// ---------- Lists ----------

const toMovies = (data) => (data.results || []).map(normalizeMovie).filter((m) => m.posterPath);

export const getTrending = () => request('/trending/movie/week').then(toMovies);
export const getPopular = () => request('/movie/popular').then(toMovies);
export const getTopRated = () => request('/movie/top_rated').then(toMovies);

// ---------- Discovery / search (raw responses: { results, total_results, total_pages }) ----------

export const discoverMovies = (params, page = 1) => request('/discover/movie', { ...params, page });

export const searchMovies = (query, page = 1) =>
  request('/search/movie', { query, page, include_adult: false });

// ---------- Details ----------

// Lightweight details (runtime + where to watch) used to complete every movie card.
export const getMovieDetails = (id) =>
  request(`/movie/${id}`, { append_to_response: 'watch/providers' }).then(normalizeMovie);

// Heavier details (cast, trailer) used only by the modal.
export const getMovieExtras = (id) =>
  request(`/movie/${id}`, {
    append_to_response: 'watch/providers,videos,credits',
    include_video_language: 'en,null',
  }).then(normalizeExtras);

// List/search results don't include runtime or streaming info, so we fetch details for each
// movie in parallel. If one lookup fails we fall back to the basic list data for that movie.
export async function enrichMovies(rawResults) {
  const settled = await Promise.allSettled(rawResults.map((m) => getMovieDetails(m.id)));
  return rawResults.map((raw, i) =>
    settled[i].status === 'fulfilled' ? settled[i].value : normalizeMovie(raw)
  );
}
