import PosterImage from './PosterImage';
import { ClockIcon, HeartIcon, StarIcon } from './Icons';
import { formatRuntime } from '../utils/helpers';

export default function MovieCard({ movie, saved, onToggleSave, onOpen }) {
  const runtime = formatRuntime(movie.runtime);
  const platforms = movie.platforms.slice(0, 3);
  const extraPlatforms = movie.platforms.length - platforms.length;

  return (
    <article className="group flex animate-fade-up flex-col overflow-hidden rounded-2xl border border-white/10 bg-ink-800/70 shadow-lg shadow-black/40 transition duration-300 hover:-translate-y-1 hover:border-purple-500/50 hover:shadow-purple-900/40">
      {/* Poster */}
      <div className="relative">
        <PosterImage key={movie.id} path={movie.posterPath} title={movie.title} className="aspect-[2/3] w-full" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink-900/90 via-transparent to-black/40" />

        <div className="absolute inset-x-0 top-0 flex items-start justify-between p-3">
          <span
            className="inline-flex items-center gap-1 rounded-full bg-black/70 px-2.5 py-1 text-sm font-bold text-amber-300 backdrop-blur"
            title="TMDB user rating"
          >
            <StarIcon /> {movie.rating.toFixed(1)}
          </span>

          <button
            type="button"
            onClick={() => onToggleSave(movie)}
            aria-pressed={saved}
            aria-label={saved ? `Remove ${movie.title} from watchlist` : `Add ${movie.title} to watchlist`}
            className={`rounded-full bg-black/70 p-2 backdrop-blur transition hover:scale-110 ${
              saved ? 'text-red-500' : 'text-white hover:text-red-400'
            }`}
          >
            <HeartIcon className="h-5 w-5" filled={saved} />
          </button>
        </div>

        {movie.match != null && (
          <span className="absolute bottom-3 left-3 rounded-full bg-brand-gradient px-2.5 py-1 text-xs font-bold text-white shadow-lg">
            {movie.match}% match
          </span>
        )}
      </div>

      {/* Details */}
      <div className="flex flex-1 flex-col gap-3 p-4">
        <div>
          <h3 className="line-clamp-1 font-display text-lg font-semibold text-white" title={movie.title}>
            {movie.title}
          </h3>
          <p className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-zinc-400">
            <span>{movie.year}</span>
            <span aria-hidden="true">•</span>
            <span>{movie.languageName}</span>
            {runtime && (
              <>
                <span aria-hidden="true">•</span>
                <span className="inline-flex items-center gap-1">
                  <ClockIcon className="h-3.5 w-3.5" /> {runtime}
                </span>
              </>
            )}
          </p>
        </div>

        {movie.genres.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {movie.genres.slice(0, 3).map((g) => (
              <span key={g} className="rounded-full border border-purple-400/20 bg-purple-500/10 px-2.5 py-0.5 text-xs text-purple-200">
                {g}
              </span>
            ))}
          </div>
        )}

        <p className="line-clamp-3 text-sm leading-relaxed text-zinc-400">
          {movie.overview || 'No description available yet.'}
        </p>

        <p className="text-xs text-zinc-500">
          {platforms.length > 0 ? (
            <>
              <span className="text-zinc-400">Watch on: </span>
              <span className="text-zinc-300">{platforms.join(', ')}</span>
              {extraPlatforms > 0 && ` +${extraPlatforms} more`}
            </>
          ) : (
            'Streaming info not available'
          )}
        </p>

        <button type="button" onClick={() => onOpen(movie)} className="btn-primary mt-auto w-full">
          View Details
        </button>
      </div>
    </article>
  );
}
