export function Spinner({ className = 'h-6 w-6' }) {
  return (
    <svg className={`animate-spin text-purple-400 ${className}`} viewBox="0 0 24 24" fill="none" role="status" aria-label="Loading">
      <circle className="opacity-20" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-90" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
    </svg>
  );
}

// Placeholder shaped like a MovieCard while results load.
export function CardSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl border border-white/10 bg-ink-800/70" aria-hidden="true">
      <div className="shimmer aspect-[2/3] w-full" />
      <div className="space-y-3 p-4">
        <div className="shimmer h-5 w-3/4 rounded" />
        <div className="shimmer h-3.5 w-1/2 rounded" />
        <div className="flex gap-2">
          <div className="shimmer h-6 w-16 rounded-full" />
          <div className="shimmer h-6 w-16 rounded-full" />
        </div>
        <div className="space-y-2">
          <div className="shimmer h-3 w-full rounded" />
          <div className="shimmer h-3 w-full rounded" />
          <div className="shimmer h-3 w-2/3 rounded" />
        </div>
        <div className="shimmer h-10 w-full rounded-xl" />
      </div>
    </div>
  );
}

// Placeholder shaped like a compact PosterCard.
export function PosterSkeleton({ className = '' }) {
  return (
    <div className={className} aria-hidden="true">
      <div className="shimmer aspect-[2/3] w-full rounded-xl" />
      <div className="shimmer mt-3 h-4 w-3/4 rounded" />
      <div className="shimmer mt-2 h-3 w-1/3 rounded" />
    </div>
  );
}
