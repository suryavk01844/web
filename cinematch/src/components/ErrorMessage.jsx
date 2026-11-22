import { AlertIcon, RefreshIcon } from './Icons';

export default function ErrorMessage({ error, onRetry, compact = false }) {
  const message = error?.message || 'Something went wrong while loading movies.';
  // Retrying can't fix a bad key, so don't offer it.
  const canRetry = onRetry && error?.code !== 'auth' && error?.code !== 'no-key';

  return (
    <div
      role="alert"
      className={`flex flex-col items-center rounded-2xl border border-red-500/30 bg-red-500/[0.06] text-center ${
        compact ? 'gap-2 px-4 py-6' : 'gap-3 px-6 py-12'
      }`}
    >
      <AlertIcon className={`${compact ? 'h-6 w-6' : 'h-9 w-9'} text-red-400`} />
      <p className="font-display text-lg font-semibold text-white">Couldn't load movies</p>
      <p className="max-w-md text-sm text-zinc-400">{message}</p>
      {canRetry && (
        <button type="button" onClick={onRetry} className="btn-ghost mt-1">
          <RefreshIcon /> Try again
        </button>
      )}
    </div>
  );
}
