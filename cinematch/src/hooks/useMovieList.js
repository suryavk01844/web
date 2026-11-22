import { useCallback, useEffect, useState } from 'react';

// Loads a simple list (trending, popular, top rated). `fetcher` must be a stable function
// reference – pass the exported API functions directly, not inline arrow functions.
export default function useMovieList(fetcher, limit) {
  const [state, setState] = useState({ data: [], loading: true, error: null });
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setState((s) => ({ ...s, loading: true, error: null }));

    fetcher()
      .then((data) => {
        if (!cancelled) setState({ data: limit ? data.slice(0, limit) : data, loading: false, error: null });
      })
      .catch((error) => {
        if (!cancelled) setState({ data: [], loading: false, error });
      });

    return () => {
      cancelled = true;
    };
  }, [fetcher, limit, attempt]);

  const reload = useCallback(() => setAttempt((n) => n + 1), []);
  return { ...state, reload };
}
