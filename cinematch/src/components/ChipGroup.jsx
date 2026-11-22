// A row of toggle "chips". Multi-select keeps an array in `value`; single-select keeps one
// value and lets the user click the active chip again to clear it (onChange receives '').
export default function ChipGroup({ options, value, onChange, multiple = false, label }) {
  const isActive = (v) => (multiple ? value.includes(v) : value === v);

  const toggle = (v) => {
    if (multiple) onChange(value.includes(v) ? value.filter((x) => x !== v) : [...value, v]);
    else onChange(value === v ? '' : v);
  };

  return (
    <div className="flex flex-wrap gap-2" role="group" aria-label={label}>
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          onClick={() => toggle(o.value)}
          aria-pressed={isActive(o.value)}
          className={`chip ${isActive(o.value) ? 'chip-active' : ''}`}
        >
          {o.emoji && (
            <span className="mr-1" aria-hidden="true">
              {o.emoji}
            </span>
          )}
          {o.label}
        </button>
      ))}
    </div>
  );
}
