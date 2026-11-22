import { WATCH_REGION } from '../config';
import { DURATIONS, GENRES, LANGUAGES, MOODS, MOVIE_TYPES, PLATFORMS } from '../utils/constants';
import ChipGroup from './ChipGroup';

const THIS_YEAR = new Date().getFullYear();
const YEARS = Array.from({ length: THIS_YEAR - 1919 }, (_, i) => THIS_YEAR - i); // this year back to 1920

function Section({ title, hint, children }) {
  return (
    <fieldset className="border-t border-white/10 pt-5 first:border-0 first:pt-0">
      <legend className="mb-3 flex w-full items-baseline justify-between gap-2 text-sm font-semibold text-white">
        <span>{title}</span>
        {hint && <span className="text-xs font-normal text-zinc-500">{hint}</span>}
      </legend>
      {children}
    </fieldset>
  );
}

export default function FilterPanel({ filters, onChange, onReset, activeCount }) {
  // Keep the year range valid: moving one end past the other drags the other end along.
  const setYearFrom = (v) => {
    const patch = { yearFrom: v };
    if (v && filters.yearTo && Number(v) > Number(filters.yearTo)) patch.yearTo = v;
    onChange(patch);
  };
  const setYearTo = (v) => {
    const patch = { yearTo: v };
    if (v && filters.yearFrom && Number(v) < Number(filters.yearFrom)) patch.yearFrom = v;
    onChange(patch);
  };

  return (
    <div className="glass space-y-5 rounded-2xl p-5">
      <div className="flex items-center justify-between">
        <h3 className="font-display text-lg font-semibold text-white">
          Your preferences
          {activeCount > 0 && (
            <span className="ml-2 rounded-full bg-purple-500/20 px-2 py-0.5 text-xs font-semibold text-purple-200">
              {activeCount} active
            </span>
          )}
        </h3>
        <button
          type="button"
          onClick={onReset}
          disabled={activeCount === 0}
          className="text-sm font-medium text-red-400 transition hover:text-red-300 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Reset
        </button>
      </div>

      <Section title="Mood" hint="fine-tunes the ranking">
        <ChipGroup
          label="Mood"
          options={MOODS}
          value={filters.mood}
          onChange={(v) => onChange({ mood: v })}
        />
      </Section>

      <Section title="Genre" hint="pick any">
        <ChipGroup
          label="Genre"
          multiple
          options={GENRES}
          value={filters.genres}
          onChange={(v) => onChange({ genres: v })}
        />
      </Section>

      <Section title="Language">
        <ChipGroup
          label="Language"
          options={LANGUAGES}
          value={filters.language}
          onChange={(v) => onChange({ language: v })}
        />
      </Section>

      <Section title="Release year">
        <div className="grid grid-cols-2 gap-3">
          <label className="text-xs text-zinc-500">
            From
            <select
              className="field mt-1"
              value={filters.yearFrom}
              onChange={(e) => setYearFrom(e.target.value)}
              aria-label="Release year from"
            >
              <option value="">Any</option>
              {YEARS.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          </label>
          <label className="text-xs text-zinc-500">
            To
            <select
              className="field mt-1"
              value={filters.yearTo}
              onChange={(e) => setYearTo(e.target.value)}
              aria-label="Release year to"
            >
              <option value="">Any</option>
              {YEARS.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          </label>
        </div>
      </Section>

      <Section title="Minimum rating" hint="TMDB score out of 10">
        <div className="flex items-center gap-4">
          <input
            type="range"
            min="0"
            max="9"
            step="0.5"
            value={filters.minRating}
            onChange={(e) => onChange({ minRating: Number(e.target.value) })}
            className="range-brand w-full"
            aria-label="Minimum rating"
          />
          <span className="w-12 shrink-0 text-right text-sm font-semibold text-amber-300">
            {filters.minRating > 0 ? `${filters.minRating.toFixed(1)}+` : 'Any'}
          </span>
        </div>
      </Section>

      <Section title="Duration">
        <ChipGroup
          label="Duration"
          options={DURATIONS}
          value={filters.duration}
          onChange={(v) => onChange({ duration: v })}
        />
      </Section>

      <Section title="Movie type">
        <ChipGroup
          label="Movie type"
          options={MOVIE_TYPES}
          value={filters.type}
          onChange={(v) => onChange({ type: v })}
        />
      </Section>

      <Section title="Platform" hint={`availability in ${WATCH_REGION}`}>
        <ChipGroup
          label="Platform"
          options={PLATFORMS}
          value={filters.platform}
          onChange={(v) => onChange({ platform: v || 'any' })}
        />
      </Section>
    </div>
  );
}
