import { useEffect } from 'react';
import PosterImage from './PosterImage';
import { BookmarkIcon, CloseIcon, StarIcon } from './Icons';
import { formatRuntime } from '../utils/helpers';

export default function WatchlistDrawer({ open, items, onClose, onOpenMovie, onRemove, onClear }) {
  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        className={`fixed inset-0 z-50 bg-black/70 backdrop-blur-sm transition-opacity duration-300 ${
          open ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
        aria-hidden="true"
      />

      {/* Panel */}
      <aside
        aria-label="Your watchlist"
        aria-hidden={!open}
        className={`fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col border-l border-white/10 bg-ink-900 shadow-2xl transition-all duration-300 ${
          open ? 'visible translate-x-0' : 'invisible translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
          <h2 className="font-display text-xl font-bold text-white">
            Your Watchlist <span className="text-zinc-500">({items.length})</span>
          </h2>
          <button type="button" onClick={onClose} aria-label="Close watchlist" className="rounded-lg p-2 text-zinc-400 hover:bg-white/10 hover:text-white">
            <CloseIcon />
          </button>
        </div>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center px-8 text-center">
            <div className="rounded-2xl bg-white/5 p-4 text-purple-300">
              <BookmarkIcon className="h-8 w-8" />
            </div>
            <p className="mt-4 font-display text-xl font-semibold text-white">Nothing saved yet</p>
            <p className="mt-1 text-sm text-zinc-400">
              Tap the heart on any movie to save it here for later. Your list is stored on this device.
            </p>
          </div>
        ) : (
          <>
            <ul className="flex-1 space-y-3 overflow-y-auto p-4">
              {items.map((m) => (
                <li key={m.id} className="flex gap-3 rounded-xl border border-white/10 bg-white/[0.03] p-3">
                  <button type="button" onClick={() => onOpenMovie(m)} className="w-16 shrink-0 overflow-hidden rounded-lg" aria-label={`View details for ${m.title}`}>
                    <PosterImage key={m.id} path={m.posterPath} title={m.title} size="w185" className="aspect-[2/3] w-full" />
                  </button>

                  <div className="min-w-0 flex-1">
                    <button type="button" onClick={() => onOpenMovie(m)} className="block max-w-full text-left">
                      <h3 className="truncate font-semibold text-white hover:text-purple-300">{m.title}</h3>
                    </button>
                    <p className="mt-0.5 flex flex-wrap items-center gap-x-2 text-xs text-zinc-400">
                      <span>{m.year}</span>
                      <span className="inline-flex items-center gap-1 text-amber-300">
                        <StarIcon className="h-3 w-3" /> {Number(m.rating).toFixed(1)}
                      </span>
                      {formatRuntime(m.runtime) && <span>{formatRuntime(m.runtime)}</span>}
                    </p>
                    {m.genres?.length > 0 && <p className="mt-1 truncate text-xs text-zinc-500">{m.genres.slice(0, 3).join(' • ')}</p>}
                    <button type="button" onClick={() => onRemove(m.id)} className="mt-2 text-xs font-medium text-red-400 hover:text-red-300">
                      Remove
                    </button>
                  </div>
                </li>
              ))}
            </ul>

            <div className="border-t border-white/10 p-4">
              <button type="button" onClick={onClear} className="btn-ghost w-full">
                Clear watchlist
              </button>
            </div>
          </>
        )}
      </aside>
    </>
  );
}
