import { FilmIcon } from './Icons';

// Shown instead of the app when no TMDB key is configured.
export default function SetupNotice() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-ink-950 px-4 py-12">
      <div className="glass w-full max-w-xl rounded-3xl p-8 shadow-2xl shadow-purple-950/40">
        <div className="mb-5 inline-flex rounded-2xl bg-brand-gradient p-3 text-white">
          <FilmIcon className="h-7 w-7" />
        </div>
        <h1 className="font-display text-3xl font-bold text-white">One quick step to start</h1>
        <p className="mt-2 text-zinc-400">
          CineMatch uses real movie data from TMDB, so it needs a free API key.
        </p>

        <ol className="mt-6 space-y-4 text-sm text-zinc-300">
          <li className="flex gap-3">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-purple-500/20 font-semibold text-purple-300">1</span>
            <span>
              Create a free account and request a key at{' '}
              <a className="text-purple-300 underline underline-offset-2" href="https://www.themoviedb.org/settings/api" target="_blank" rel="noreferrer">
                themoviedb.org/settings/api
              </a>
              .
            </span>
          </li>
          <li className="flex gap-3">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-purple-500/20 font-semibold text-purple-300">2</span>
            <span>
              Copy <code className="rounded bg-white/10 px-1.5 py-0.5">.env.example</code> to{' '}
              <code className="rounded bg-white/10 px-1.5 py-0.5">.env</code> and paste your key:
            </span>
          </li>
        </ol>

        <pre className="mt-3 overflow-x-auto rounded-xl border border-white/10 bg-black/50 p-4 text-sm text-purple-200">
VITE_TMDB_API_KEY=your_key_here
        </pre>

        <p className="mt-4 flex gap-3 text-sm text-zinc-300">
          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-purple-500/20 font-semibold text-purple-300">3</span>
          <span>
            Restart the dev server (<code className="rounded bg-white/10 px-1.5 py-0.5">npm run dev</code>) so it picks up the new value.
          </span>
        </p>
      </div>
    </main>
  );
}
