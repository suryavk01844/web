export default function Footer() {
  return (
    <footer className="border-t border-white/10 px-4 py-10 text-center sm:px-6">
      <p className="font-display text-lg font-bold text-white">
        Cine<span className="text-gradient">Match</span>
      </p>
      <p className="mx-auto mt-3 max-w-xl text-xs leading-relaxed text-zinc-500">
        This product uses the TMDB API but is not endorsed or certified by TMDB. Movie data, posters and
        ratings are provided by{' '}
        <a href="https://www.themoviedb.org" target="_blank" rel="noreferrer" className="text-zinc-400 underline underline-offset-2 hover:text-white">
          The Movie Database
        </a>
        . Streaming availability may vary.
      </p>
    </footer>
  );
}
