import PosterImage from './PosterImage';
import { StarIcon } from './Icons';

// Compact poster tile used in the Trending / Popular rows and the Top 10 grid.
export default function PosterCard({ movie, rank, onOpen, className = '' }) {
  return (
    <button
      type="button"
      onClick={() => onOpen(movie)}
      className={`group block text-left focus:outline-none ${className}`}
      aria-label={`${rank ? `Number ${rank}: ` : ''}${movie.title}, rated ${movie.rating}. View details`}
    >
      <div className="relative overflow-hidden rounded-xl border border-white/10 shadow-lg shadow-black/50 transition duration-300 group-hover:-translate-y-1 group-hover:border-purple-400/60 group-hover:shadow-purple-900/50 group-focus-visible:ring-2 group-focus-visible:ring-purple-400">
        <PosterImage key={movie.id} path={movie.posterPath} title={movie.title} className="aspect-[2/3] w-full" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80" />

        <span className="absolute right-2 top-2 inline-flex items-center gap-1 rounded-full bg-black/70 px-2 py-0.5 text-xs font-semibold text-amber-300 backdrop-blur">
          <StarIcon className="h-3 w-3" /> {movie.rating.toFixed(1)}
        </span>

        {rank && <span className="rank-number absolute bottom-1 left-3 text-6xl">{rank}</span>}
      </div>

      <h3 className="mt-3 line-clamp-1 text-sm font-semibold text-zinc-100 transition group-hover:text-white">
        {movie.title}
      </h3>
      <p className="text-xs text-zinc-500">{movie.year}</p>
    </button>
  );
}
