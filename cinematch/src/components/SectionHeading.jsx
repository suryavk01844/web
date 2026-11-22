export default function SectionHeading({ eyebrow, title, subtitle, className = '' }) {
  return (
    <div className={className}>
      {eyebrow && (
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-purple-300">{eyebrow}</p>
      )}
      <h2 className="mt-2 font-display text-3xl font-bold tracking-tight text-white sm:text-4xl">{title}</h2>
      {subtitle && <p className="mt-2 max-w-2xl text-zinc-400">{subtitle}</p>}
    </div>
  );
}
