import MovieCard from './MovieCard';
import ErrorMessage from './ErrorMessage';
import { FilmIcon } from './Icons';
import { CardSkeleton, Spinner } from './Spinner';

function EmptyState({ isSearching, activeCount, onReset, hasMore, onLoadMore, loadingMore }) {
  return (
    <div className="flex flex-col items-center rounded-2xl border border-dashed border-white/15 bg-white/[0.02] px-6 py-16 text-center">
      <div className="rounded-2xl bg-white/5 p-4 text-purple-300">
        <FilmIcon className="h-9 w-9" />
      </div>
      <h3 className="mt-5 font-display text-2xl font-bold text-white">No movies match… yet</h3>
      <p className="mt-2 max-w-md text-zinc-400">
        {isSearching
          ? "We couldn't find a title that fits your search and filters. Try a different spelling, or loosen a filter."
          : "Your combination is a little too specific. Try removing a filter, lowering the minimum rating, or widening the year range."}
      </p>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        {activeCount > 0 && (
          <button type="button" onClick={onReset} className="btn-primary">
            Reset all filters
          </button>
        )}
        {hasMore && (
          <button type="button" onClick={onLoadMore} disabled={loadingMore} className="btn-ghost">
            {loadingMore ? 'Searching…' : 'Look through more results'}
          </button>
        )}
      </div>
    </div>
  );
}

export default function MovieGrid({
  movies,
  loading,
  loadingMore,
  error,
  loadMoreError,
  hasMore,
  isSearching,
  activeCount,
  watchlist,
  onOpen,
  onRetry,
  onReset,
  onLoadMore,
}) {
  if (error) return <ErrorMessage error={error} onRetry={onRetry} />;

  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3" aria-busy="true">
        {Array.from({ length: 6 }, (_, i) => (
          <CardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (movies.length === 0) {
    return (
      <EmptyState
        isSearching={isSearching}
        activeCount={activeCount}
        onReset={onReset}
        hasMore={hasMore}
        onLoadMore={onLoadMore}
        loadingMore={loadingMore}
      />
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
        {movies.map((m) => (
          <MovieCard
            key={m.id}
            movie={m}
            saved={watchlist.has(m.id)}
            onToggleSave={watchlist.toggle}
            onOpen={onOpen}
          />
        ))}
      </div>

      {loadMoreError && (
        <div className="mt-6">
          <ErrorMessage error={loadMoreError} onRetry={onLoadMore} compact />
        </div>
      )}

      {hasMore && !loadMoreError && (
        <div className="mt-10 flex justify-center">
          <button type="button" onClick={onLoadMore} disabled={loadingMore} className="btn-ghost px-8 py-3">
            {loadingMore ? (
              <>
                <Spinner className="h-4 w-4" /> Loading…
              </>
            ) : (
              'Load more movies'
            )}
          </button>
        </div>
      )}
    </>
  );
}
