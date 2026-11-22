import PosterCard from './PosterCard';
import ErrorMessage from './ErrorMessage';
import SectionHeading from './SectionHeading';
import { PosterSkeleton } from './Spinner';

const TILE = 'w-40 shrink-0 snap-start sm:w-44 md:w-48';

// A titled, horizontally scrolling row of posters (Trending, Popular).
export default function MovieRow({ id, eyebrow, title, subtitle, movies, loading, error, onRetry, onOpen }) {
  return (
    <section id={id} className="scroll-mt-20 px-4 py-10 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <SectionHeading eyebrow={eyebrow} title={title} subtitle={subtitle} />

        <div className="mt-6">
          {error ? (
            <ErrorMessage error={error} onRetry={onRetry} compact />
          ) : (
            <div className="no-scrollbar -mx-4 flex snap-x gap-4 overflow-x-auto px-4 pb-4 sm:-mx-6 sm:px-6 lg:mx-0 lg:px-0">
              {loading
                ? Array.from({ length: 8 }, (_, i) => <PosterSkeleton key={i} className={TILE} />)
                : movies.map((m) => <PosterCard key={m.id} movie={m} onOpen={onOpen} className={TILE} />)}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
