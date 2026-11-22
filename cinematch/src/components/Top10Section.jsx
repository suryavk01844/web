import PosterCard from './PosterCard';
import ErrorMessage from './ErrorMessage';
import SectionHeading from './SectionHeading';
import { PosterSkeleton } from './Spinner';

export default function Top10Section({ movies, loading, error, onRetry, onOpen }) {
  return (
    <section id="top10" className="scroll-mt-20 px-4 py-16 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          eyebrow="Hall of fame"
          title="Top 10 Movies of All Time"
          subtitle="The highest-rated movies on TMDB, ranked by audience score."
        />

        <div className="mt-8">
          {error ? (
            <ErrorMessage error={error} onRetry={onRetry} />
          ) : (
            <ol className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-5">
              {loading
                ? Array.from({ length: 10 }, (_, i) => (
                    <li key={i}>
                      <PosterSkeleton />
                    </li>
                  ))
                : movies.map((m, i) => (
                    <li key={m.id}>
                      <PosterCard movie={m} rank={i + 1} onOpen={onOpen} />
                    </li>
                  ))}
            </ol>
          )}
        </div>
      </div>
    </section>
  );
}
