import { CloseIcon, SearchIcon } from './Icons';

export default function SearchBar({ value, onChange }) {
  return (
    <div className="relative">
      <SearchIcon className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-zinc-500" />
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search movies by title…"
        aria-label="Search movies by title"
        className="w-full rounded-2xl border border-white/10 bg-ink-800/80 py-3.5 pl-12 pr-12 text-base text-white placeholder-zinc-500 shadow-lg shadow-black/30 transition focus:border-purple-400/70 focus:outline-none focus:ring-2 focus:ring-purple-500/30 [&::-webkit-search-cancel-button]:hidden"
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange('')}
          aria-label="Clear search"
          className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-zinc-400 transition hover:bg-white/10 hover:text-white"
        >
          <CloseIcon className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}
