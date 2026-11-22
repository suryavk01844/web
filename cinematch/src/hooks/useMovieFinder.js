import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { discoverMovies, enrichMovies, searchMovies } from '../api/tmdb';
import {
  buildDiscoverParams,
  matchScore,
  matchesCriteria,
  resolveCriteria,
  serverSortFor,
  sortMovies,
} from '../utils/filters';
import useDebounce from './useDebounce';

const INITIAL_PAGES = 2; // 2 pages x 20 = up to 40 movies on first load

const EMPTY = {
  movies: [],
  loading: true,
  loadingMore: false,
  error: null,
  loadMoreError: null,
  page: 0,
  totalPages: 0,
  totalResults: 0,
};

const dedupe = (list) => {
  const seen = new Set();
  return list.filter((m) => (seen.has(m.id) ? false : seen.add(m.id)));
};

/**
 * The recommendation engine. Whenever the filters, the search text or the sort choice change
 * it (debounced) re-queries TMDB, completes each result with runtime / streaming data, then
 * scores and sorts the movies.
 *
 *  - No search text  -> TMDB /discover does the filtering on the server.
 *  - With search text -> TMDB /search finds titles, and the same filters are applied client-side.
 */
export default function useMovieFinder({ filters, sort, query }) {
  const debouncedFilters = useDebounce(filters, 350);
  const debouncedQuery = useDebounce(query.trim(), 450);

  const [state, setState] = useState(EMPTY);
  const [attempt, setAttempt] = useState(0);
  const requestId = useRef(0); // lets us ignore responses from outdated requests

  const criteria = useMemo(() => resolveCriteria(debouncedFilters), [debouncedFilters]);
  // Only the *server* sort affects which movies we fetch, so switching between e.g.
  // "Most Popular" and "Shortest Duration" re-sorts instantly without a new request.
  const serverSort = serverSortFor(sort);

  const fetchPage = useCallback(
    async (page) => {
      if (debouncedQuery) {
        const data = await searchMovies(debouncedQuery, page);
        const enriched = await enrichMovies(data.results || []);
        return {
          items: enriched.filter((m) => matchesCriteria(m, criteria)),
          totalPages: data.total_pages || 0,
          totalResults: data.total_results || 0,
        };
      }

      const data = await discoverMovies(buildDiscoverParams(criteria, serverSort), page);
      const items = await enrichMovies(data.results || []);
      return {
        items,
        totalPages: Math.min(data.total_pages || 0, 500), // TMDB only serves 500 pages
        totalResults: data.total_results || 0,
      };
    },
    [debouncedQuery, criteria, serverSort]
  );

  // (Re)load from page 1 whenever the inputs change.
  useEffect(() => {
    const id = ++requestId.current;
    setState({ ...EMPTY, loading: true });

    if (!debouncedQuery && criteria.impossible) {
      // e.g. "Classic" + years after 1999 – nothing can match, so don't bother TMDB.
      setState({ ...EMPTY, loading: false });
      return;
    }

    (async () => {
      try {
        const [first, second] = await Promise.all([
          fetchPage(1),
          fetchPage(2).catch(() => null), // page 2 is a bonus; ignore its failure
        ]);
        if (id !== requestId.current) return;

        setState({
          ...EMPTY,
          loading: false,
          movies: dedupe([...first.items, ...(second ? second.items : [])]),
          page: second ? 2 : 1,
          totalPages: first.totalPages,
          totalResults: first.totalResults,
        });
      } catch (error) {
        if (id !== requestId.current) return;
        setState({ ...EMPTY, loading: false, error });
      }
    })();
  }, [fetchPage, criteria.impossible, debouncedQuery, attempt]);

  const hasMore = !state.loading && !state.error && state.page < state.totalPages;

  const loadMore = useCallback(async () => {
    if (state.loading || state.loadingMore || state.page >= state.totalPages) return;
    const id = requestId.current;
    setState((s) => ({ ...s, loadingMore: true, loadMoreError: null }));

    try {
      const next = await fetchPage(state.page + 1);
      if (id !== requestId.current) return;
      setState((s) => ({
        ...s,
        loadingMore: false,
        page: s.page + 1,
        movies: dedupe([...s.movies, ...next.items]),
      }));
    } catch (error) {
      if (id !== requestId.current) return;
      setState((s) => ({ ...s, loadingMore: false, loadMoreError: error }));
    }
  }, [state.loading, state.loadingMore, state.page, state.totalPages, fetchPage]);

  const retry = useCallback(() => setAttempt((n) => n + 1), []);

  const movies = useMemo(() => {
    const scored = state.movies.map((m) => ({ ...m, match: matchScore(m, debouncedFilters) }));
    return sortMovies(scored, sort);
  }, [state.movies, debouncedFilters, sort]);

  return {
    movies,
    // With a title search TMDB can't count filtered matches, so we report what we've loaded.
    totalResults: debouncedQuery ? movies.length : state.totalResults,
    loading: state.loading,
    loadingMore: state.loadingMore,
    error: state.error,
    loadMoreError: state.loadMoreError,
    hasMore,
    loadMore,
    retry,
    isSearching: Boolean(debouncedQuery),
    // True while the user's latest change is still waiting out the debounce.
    isUpdating: debouncedFilters !== filters || debouncedQuery !== query.trim(),
  };
}
