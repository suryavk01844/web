const rawKey = (import.meta.env.VITE_TMDB_API_KEY || '').trim();

export const API_KEY = rawKey;
export const HAS_API_KEY = rawKey.length > 0 && rawKey !== 'your_tmdb_api_key_here';
// v4 "Read Access Token"s are JWTs and are sent as a Bearer header; v3 keys go in the query string.
export const USES_BEARER = rawKey.startsWith('eyJ');

// Region used for "where to watch" data and the Platform filter.
export const WATCH_REGION = (import.meta.env.VITE_WATCH_REGION || 'IN').trim().toUpperCase();

export const API_BASE = 'https://api.themoviedb.org/3';
const IMAGE_BASE = 'https://image.tmdb.org/t/p';

export const posterUrl = (path, size = 'w342') => (path ? `${IMAGE_BASE}/${size}${path}` : null);
export const backdropUrl = (path, size = 'w780') => (path ? `${IMAGE_BASE}/${size}${path}` : null);
