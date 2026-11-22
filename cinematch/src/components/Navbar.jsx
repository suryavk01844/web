import { BookmarkIcon, PlayIcon } from './Icons';

const LINKS = [
  { href: '#trending', label: 'Trending' },
  { href: '#finder', label: 'Find a Movie' },
  { href: '#top10', label: 'Top 10' },
];

export default function Navbar({ watchlistCount, onOpenWatchlist }) {
  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-ink-950/75 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-10">
        <a href="#top" className="flex items-center gap-2.5" aria-label="CineMatch home">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-gradient text-white shadow-lg shadow-purple-900/50">
            <PlayIcon className="h-4 w-4" />
          </span>
          <span className="font-display text-xl font-bold tracking-tight text-white">
            Cine<span className="text-gradient">Match</span>
          </span>
        </a>

        <nav className="hidden items-center gap-1 md:flex" aria-label="Main">
          {LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="rounded-lg px-3 py-2 text-sm font-medium text-zinc-400 transition hover:bg-white/5 hover:text-white"
            >
              {l.label}
            </a>
          ))}
        </nav>

        <button type="button" onClick={onOpenWatchlist} className="btn-ghost relative">
          <BookmarkIcon className="h-4 w-4" />
          <span className="hidden sm:inline">Watchlist</span>
          {watchlistCount > 0 && (
            <span className="flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-brand-gradient px-1.5 text-xs font-bold text-white">
              {watchlistCount}
            </span>
          )}
        </button>
      </div>
    </header>
  );
}
