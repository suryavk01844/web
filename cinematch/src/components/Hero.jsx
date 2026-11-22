import PosterImage from './PosterImage';
import { ShuffleIcon } from './Icons';

// Three tilted, floating posters on large screens.
const FRAMES = [
  { cls: 'left-2 top-10 w-44 animate-float', tilt: '-8deg' },
  { cls: 'left-40 top-0 w-52 animate-float-slow z-10', tilt: '4deg' },
  { cls: 'left-24 top-56 w-44 animate-float', tilt: '9deg' },
];

export default function Hero({ posters, onGetStarted, onRandom }) {
  return (
    <section id="top" className="relative overflow-hidden px-4 pb-20 pt-16 sm:px-6 sm:pt-24 lg:px-10">
      {/* Glow effects */}
      <div className="pointer-events-none absolute -left-32 -top-32 h-[28rem] w-[28rem] rounded-full bg-purple-600/30 blur-[120px]" />
      <div className="pointer-events-none absolute -right-24 top-20 h-[26rem] w-[26rem] rounded-full bg-red-600/25 blur-[120px]" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-ink-950 to-transparent" />

      <div className="relative mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="animate-fade-up">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-medium uppercase tracking-widest text-purple-200">
            <span className="h-1.5 w-1.5 rounded-full bg-red-500" /> Smart Movie Selector
          </span>

          <h1 className="mt-6 font-display text-5xl font-extrabold leading-[1.05] tracking-tight text-white sm:text-6xl lg:text-7xl">
            Find Your <span className="text-gradient">Perfect Movie</span>
          </h1>

          <p className="mt-6 max-w-xl text-lg text-zinc-400 sm:text-xl">
            Tell us your mood. We'll find your next favourite movie.
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-3">
            <button type="button" onClick={onGetStarted} className="btn-primary px-7 py-3.5 text-base">
              Get Started
            </button>
            <button type="button" onClick={onRandom} className="btn-ghost px-6 py-3.5 text-base">
              <ShuffleIcon className="h-4 w-4" /> Surprise Me
            </button>
          </div>
        </div>

        <div className="relative hidden h-[34rem] lg:block" aria-hidden="true">
          {posters.slice(0, 3).map((movie, i) => (
            <div
              key={movie.id}
              className={`absolute overflow-hidden rounded-2xl border border-white/15 shadow-2xl shadow-purple-950/60 ${FRAMES[i].cls}`}
              style={{ '--tilt': FRAMES[i].tilt, transform: `rotate(${FRAMES[i].tilt})` }}
            >
              <PosterImage key={movie.id} path={movie.posterPath} title={movie.title} size="w500" className="aspect-[2/3] w-full" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
