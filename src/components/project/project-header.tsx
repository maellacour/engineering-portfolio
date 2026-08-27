export function ProjectHeader({
  title,
  year,
  tag,
}: {
  title: string;
  year: number;
  tag: string;
}) {
  // Tags are stored as a "·"-separated string (e.g. "VR · Unity · Medical").
  const tags = tag
    .split("·")
    .map((t) => t.trim())
    .filter(Boolean);

  return (
    <header className="mb-6">
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <span className="text-primary font-mono text-xs tracking-wider uppercase">
          {year}
        </span>
        {tags.map((t) => (
          <span
            key={t}
            className="border-border/60 text-muted-foreground rounded-full border px-2.5 py-0.5 font-mono text-[0.65rem] tracking-wider uppercase"
          >
            {t}
          </span>
        ))}
      </div>
      <h1 className="font-display text-4xl font-bold tracking-tight text-balance sm:text-5xl">
        {title}
      </h1>
    </header>
  );
}
