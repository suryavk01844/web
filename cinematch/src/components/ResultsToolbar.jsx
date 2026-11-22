import { SORT_OPTIONS } from '../utils/constants';
import { formatCount } from '../utils/helpers';
import { RefreshIcon, ShuffleIcon } from './Icons';
import { Spinner } from './Spinner';

export default function ResultsToolbar({
  total,
  hasMore,
  loading,
  isUpdating,
  isSearching,
  hasError,
  sort,
  onSort,
  onRandom,
  canRandom,
  onReset,
  activeCount,
}) {
  let countText = 'Finding movies…';
  if (!loading && !hasError) {
    const plus = isSearching && hasMore ? '+' : '';
    countText = `${formatCount(total)}${plus} ${total === 1 ? 'movie matches' : 'movies match'}`;
  } else if (hasError) {
    countText = 'Something went wrong';
  }

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <p className="flex items-center gap-2 text-lg font-semibold text-white" aria-live="polite">
        {(loading || isUpdating) && <Spinner className="h-5 w-5" />}
        <span>{countText}</span>
      </p>

      <div className="flex flex-wrap items-center gap-2">
        <label className="flex items-center gap-2 text-sm text-zinc-400">
          <span className="hidden sm:inline">Sort by</span>
          <select
            value={sort}
            onChange={(e) => onSort(e.target.value)}
            className="field !w-auto py-2"
            aria-label="Sort movies"
          >
            {SORT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </label>

        <button type="button" onClick={onRandom} disabled={!canRandom} className="btn-ghost py-2">
          <ShuffleIcon className="h-4 w-4" /> Random Pick
        </button>

        <button type="button" onClick={onReset} disabled={activeCount === 0} className="btn-ghost py-2">
          <RefreshIcon /> Reset Filters
        </button>
      </div>
    </div>
  );
}
