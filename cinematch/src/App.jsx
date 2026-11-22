import { useCallback, useState } from 'react';
import { HAS_API_KEY } from './config';
import { getPopular, getTopRated, getTrending } from './api/tmdb';
import useMovieFinder from './hooks/useMovieFinder';
import useMovieList from './hooks/useMovieList';
import useWatchlist from './hooks/useWatchlist';
import { DEFAULT_FILTERS, countActiveFilters } from './utils/filters';
import { pickRandom } from './utils/helpers';

import Footer from './components/Footer';
import FilterPanel from './components/FilterPanel';
import Hero from './components/Hero';
import { SlidersIcon } from './components/Icons';
import MovieGrid from './components/MovieGrid';
import MovieModal from './components/MovieModal';
import MovieRow from './components/MovieRow';
import Navbar from './components/Navbar';
import ResultsToolbar from './components/ResultsToolbar';
import SearchBar from './components/SearchBar';
import SectionHeading from './components/SectionHeading';
import SetupNotice from './components/SetupNotice';
import Top10Section from './components/Top10Section';
import WatchlistDrawer from './components/WatchlistDrawer';

export default function App() {
  // Without an API key nothing can load, so explain how to set one up instead.
  if (!HAS_API_KEY) return <SetupNotice />;
  return <CineMatch />;
}

function CineMatch() {
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [sort, setSort] = useState('best');
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState(null); // movie shown in the details modal
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false); // mobile only

  const watchlist = useWatchlist();
  const trending = useMovieList(getTrending, 15);
  const popular = useMovieList(getPopular, 15);
  const topRated = useMovieList(getTopRated, 10);
  const finder = useMovieFinder({ filters, sort, query });

  const activeCount = countActiveFilters(filters) + (query.trim() ? 1 : 0);

  const patchFilters = useCallback((patch) => setFilters((f) => ({ ...f, ...patch })), []);
  const resetFilters = useCallback(() => {
    setFilters(DEFAULT_FILTERS);
    setQuery('');
    setSort('best');
  }, []);

  const openMovie = useCallback((movie) => setSelected(movie), []);
  const closeMovie = useCallback(() => setSelected(null), []);
  const openDrawer = useCallback(() => setDrawerOpen(true), []);
  const closeDrawer = useCallback(() => setDrawerOpen(false), []);

  const scrollToFinder = useCallback(() => {
    document.getElementById('finder')?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  // Random pick comes from the current matches; before those load it falls back to what's on the home page.
  const handleRandom = useCallback(() => {
    const pool = finder.movies.length ? finder.movies : [...popular.data, ...trending.data];
    const movie = pickRandom(pool);
    if (movie) setSelected(movie);
  }, [finder.movies, popular.data, trending.data]);

  const canRandom = finder.movies.length > 0 || popular.data.length > 0 || trending.data.length > 0;

  return (
    <div className="min-h-screen bg-ink-950">
      <Navbar watchlistCount={watchlist.count} onOpenWatchlist={openDrawer} />

      <main>
        <Hero posters={trending.data} onGetStarted={scrollToFinder} onRandom={handleRandom} />

        <MovieRow
          id="trending"
          eyebrow="This week"
          title="Trending Now"
          subtitle="What everyone is watching right now."
          movies={trending.data}
          loading={trending.loading}
          error={trending.error}
          onRetry={trending.reload}
          onOpen={openMovie}
        />

        <MovieRow
          id="popular"
          eyebrow="Crowd favourites"
          title="Popular Movies"
          subtitle="Big names and fan favourites, updated daily."
          movies={popular.data}
          loading={popular.loading}
          error={popular.error}
          onRetry={popular.reload}
          onOpen={openMovie}
        />

        {/* ---------- Smart movie finder ---------- */}
        <section id="finder" className="scroll-mt-20 px-4 py-16 sm:px-6 lg:px-10">
          <div className="mx-auto max-w-7xl">
            <SectionHeading
              eyebrow="Smart selector"
              title="Build your perfect match"
              subtitle="Pick your mood and preferences. Results update instantly as you change them."
            />

            <div className="mt-8">
              <SearchBar value={query} onChange={setQuery} />
            </div>

            <div className="mt-8 grid gap-8 lg:grid-cols-[22rem_1fr]">
              <aside>
                <button
                  type="button"
                  onClick={() => setFiltersOpen((o) => !o)}
                  aria-expanded={filtersOpen}
                  aria-controls="filter-panel"
                  className="btn-ghost mb-4 w-full lg:hidden"
                >
                  <SlidersIcon className="h-4 w-4" />
                  {filtersOpen ? 'Hide filters' : 'Show filters'}
                  {activeCount > 0 && (
                    <span className="rounded-full bg-brand-gradient px-2 py-0.5 text-xs font-bold text-white">
                      {activeCount}
                    </span>
                  )}
                </button>

                <div
                  id="filter-panel"
                  className={`${filtersOpen ? 'block' : 'hidden'} lg:sticky lg:top-24 lg:block lg:max-h-[calc(100vh-7rem)] lg:overflow-y-auto lg:pr-1`}
                >
                  <FilterPanel
                    filters={filters}
                    onChange={patchFilters}
                    onReset={resetFilters}
                    activeCount={activeCount}
                  />
                </div>
              </aside>

              <div className="min-w-0 space-y-6">
                <ResultsToolbar
                  total={finder.totalResults}
                  hasMore={finder.hasMore}
                  loading={finder.loading}
                  isUpdating={finder.isUpdating}
                  isSearching={finder.isSearching}
                  hasError={Boolean(finder.error)}
                  sort={sort}
                  onSort={setSort}
                  onRandom={handleRandom}
                  canRandom={canRandom}
                  onReset={resetFilters}
                  activeCount={activeCount}
                />

                <MovieGrid
                  movies={finder.movies}
                  loading={finder.loading}
                  loadingMore={finder.loadingMore}
                  error={finder.error}
                  loadMoreError={finder.loadMoreError}
                  hasMore={finder.hasMore}
                  isSearching={finder.isSearching}
                  activeCount={activeCount}
                  watchlist={watchlist}
                  onOpen={openMovie}
                  onRetry={finder.retry}
                  onReset={resetFilters}
                  onLoadMore={finder.loadMore}
                />
              </div>
            </div>
          </div>
        </section>

        <Top10Section
          movies={topRated.data}
          loading={topRated.loading}
          error={topRated.error}
          onRetry={topRated.reload}
          onOpen={openMovie}
        />
      </main>

      <Footer />

      <WatchlistDrawer
        open={drawerOpen}
        items={watchlist.items}
        onClose={closeDrawer}
        onOpenMovie={openMovie}
        onRemove={watchlist.remove}
        onClear={watchlist.clear}
      />

      {selected && (
        <MovieModal
          movie={selected}
          saved={watchlist.has(selected.id)}
          onToggleSave={watchlist.toggle}
          onClose={closeMovie}
        />
      )}
    </div>
  );
}
