import { useCallback, useEffect, useMemo, useState } from 'react';

const STORAGE_KEY = 'cinematch.watchlist.v1';

function readStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return []; // private mode, blocked storage or corrupted JSON
  }
}

// Only keep what the watchlist UI needs, so localStorage stays small.
const slim = (m) => ({
  id: m.id,
  title: m.title,
  year: m.year,
  releaseDate: m.releaseDate,
  posterPath: m.posterPath,
  backdropPath: m.backdropPath,
  overview: m.overview,
  rating: m.rating,
  votes: m.votes,
  popularity: m.popularity,
  genres: m.genres,
  genreIds: m.genreIds,
  language: m.language,
  languageName: m.languageName,
  runtime: m.runtime,
  platforms: m.platforms,
  providerIds: m.providerIds,
});

export default function useWatchlist() {
  const [items, setItems] = useState(readStorage);

  // Persist on every change.
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      /* storage full or unavailable – the list still works for this session */
    }
  }, [items]);

  // Keep several open tabs in sync.
  useEffect(() => {
    const onStorage = (e) => {
      if (e.key === STORAGE_KEY) setItems(readStorage());
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const ids = useMemo(() => new Set(items.map((m) => m.id)), [items]);
  const has = useCallback((id) => ids.has(id), [ids]);

  const toggle = useCallback((movie) => {
    setItems((prev) =>
      prev.some((m) => m.id === movie.id) ? prev.filter((m) => m.id !== movie.id) : [slim(movie), ...prev]
    );
  }, []);

  const remove = useCallback((id) => setItems((prev) => prev.filter((m) => m.id !== id)), []);
  const clear = useCallback(() => setItems([]), []);

  return { items, count: items.length, has, toggle, remove, clear };
}
