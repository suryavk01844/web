import { useEffect, useState } from 'react';
import { getMovieExtras } from '../api/tmdb';
import { WATCH_REGION, backdropUrl } from '../config';
import { formatCount, formatRuntime } from '../utils/helpers';
import { CloseIcon, ClockIcon, ExternalIcon, HeartIcon, PlayIcon, StarIcon } from './Icons';
import PosterImage from './PosterImage';
import { Spinner } from './Spinner';

export default function MovieModal({ movie: basic, saved, onToggleSave, onClose }) {
  const [extras, setExtras] = useState({ status: 'loading', data: null });

  // Load cast, trailer and streaming info for this movie.
  useEffect(() => {
    let cancelled = false;
    setExtras({ status: 'loading', data: null });
    getMovieExtras(basic.id)
      .then((data) => !cancelled && setExtras({ status: 'ready', data }))
      .catch(() => !cancelled && setExtras({ status: 'error', data: null }));
    return () => {
      cancelled = true;
    };
  }, [basic.id]);

  // Close on Escape and lock page scroll while open.
  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = previous;
    };
  }, [onClose]);

  // Prefer the full details once loaded, but keep the already-known data for a snappy open.
  const movie = extras.data ? { ...basic, ...extras.data.movie } : basic;
  const runtime = formatRuntime(movie.runtime);
  const backdrop = backdropUrl(movie.backdropPath);
  const ready = extras.status === 'ready';

  return (
    <div
      className="fixed inset-0 z-[60] flex items-end justify-center bg-black/80 backdrop-blur-sm sm:items-center sm:p-6"
      onMouseDown={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={`${movie.title} details`}
        className="relative max-h-[92vh] w-full max-w-4xl animate-fade-up overflow-y-auto rounded-t-3xl border border-white/10 bg-ink-900 shadow-2xl shadow-purple-950/50 sm:rounded-3xl"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close details"
          className="absolute right-4 top-4 z-20 rounded-full bg-black/60 p-2 text-white backdrop-blur transition hover:bg-black/80"
        >
          <CloseIcon />
        </button>

        {/* Backdrop banner */}
        <div className="relative h-44 w-full overflow-hidden sm:h-60">
          {backdrop ? (
            <img src={backdrop} alt="" className="h-full w-full object-cover" />
          ) : (
            <div className="h-full w-full bg-gradient-to-br from-purple-900/60 via-ink-800 to-red-900/50" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-ink-900 via-ink-900/50 to-transparent" />
        </div>

        <div className="relative -mt-24 grid gap-6 px-5 pb-8 sm:-mt-28 sm:grid-cols-[200px_1fr] sm:px-8">
          <div className="mx-auto w-40 overflow-hidden rounded-2xl border border-white/15 shadow-2xl shadow-black/70 sm:mx-0 sm:w-full">
            <PosterImage key={movie.id} path={movie.posterPath} title={movie.title} size="w500" className="aspect-[2/3] w-full" />
          </div>

          <div className="min-w-0 sm:pt-28">
            <h2 className="font-display text-3xl font-bold leading-tight text-white sm:text-4xl">{movie.title}</h2>
            {movie.tagline && <p className="mt-1 italic text-zinc-400">{movie.tagline}</p>}

            <div className="mt-4 flex flex-wrap items-center gap-2 text-sm">
              <span className="inline-flex items-center gap-1 rounded-full bg-amber-400/10 px-3 py-1 font-semibold text-amber-300">
                <StarIcon /> {movie.rating.toFixed(1)}
                <span className="font-normal text-amber-300/60">({formatCount(movie.votes)} votes)</span>
              </span>
              <span className="rounded-full bg-white/5 px-3 py-1 text-zinc-300">{movie.year}</span>
              {runtime && (
                <span className="inline-flex items-center gap-1 rounded-full bg-white/5 px-3 py-1 text-zinc-300">
                  <ClockIcon className="h-3.5 w-3.5" /> {runtime}
                </span>
              )}
              <span className="rounded-full bg-white/5 px-3 py-1 text-zinc-300">{movie.languageName}</span>
            </div>

            {movie.genres.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-1.5">
                {movie.genres.map((g) => (
                  <span key={g} className="rounded-full border border-purple-400/20 bg-purple-500/10 px-2.5 py-0.5 text-xs text-purple-200">
                    {g}
                  </span>
                ))}
              </div>
            )}

            <p className="mt-5 leading-relaxed text-zinc-300">{movie.overview || 'No description available yet.'}</p>

            {/* Cast, trailer and streaming load in after the modal opens */}
            {extras.status === 'loading' && (
              <p className="mt-6 flex items-center gap-2 text-sm text-zinc-500">
                <Spinner className="h-4 w-4" /> Loading cast, trailer and streaming info…
              </p>
            )}
            {extras.status === 'error' && (
              <p className="mt-6 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-zinc-400">
                Cast, trailer and streaming details couldn't be loaded right now.
              </p>
            )}

            {ready && (
              <dl className="mt-6 space-y-3 text-sm">
                {extras.data.directors.length > 0 && (
                  <div>
                    <dt className="text-zinc-500">Directed by</dt>
                    <dd className="text-zinc-200">{extras.data.directors.join(', ')}</dd>
                  </div>
                )}
                {extras.data.cast.length > 0 && (
                  <div>
                    <dt className="text-zinc-500">Starring</dt>
                    <dd className="text-zinc-200">{extras.data.cast.join(', ')}</dd>
                  </div>
                )}
                <div>
                  <dt className="text-zinc-500">Where to watch ({WATCH_REGION})</dt>
                  <dd className="mt-1 flex flex-wrap gap-1.5">
                    {movie.platforms.length > 0 ? (
                      movie.platforms.map((p) => (
                        <span key={p} className="rounded-full border border-red-400/20 bg-red-500/10 px-2.5 py-0.5 text-xs text-red-200">
                          {p}
                        </span>
                      ))
                    ) : (
                      <span className="text-zinc-400">Not listed for your region yet</span>
                    )}
                  </dd>
                </div>
              </dl>
            )}

            <div className="mt-7 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => onToggleSave(movie)}
                aria-pressed={saved}
                className={saved ? 'btn-ghost !border-red-400/50 !text-red-300' : 'btn-primary'}
              >
                <HeartIcon className="h-4 w-4" filled={saved} />
                {saved ? 'In your watchlist' : 'Add to watchlist'}
              </button>

              {ready && extras.data.trailerUrl && (
                <a href={extras.data.trailerUrl} target="_blank" rel="noreferrer" className="btn-ghost">
                  <PlayIcon /> Watch trailer
                </a>
              )}

              {movie.imdbId && (
                <a href={`https://www.imdb.com/title/${movie.imdbId}/`} target="_blank" rel="noreferrer" className="btn-ghost">
                  IMDb page <ExternalIcon />
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
