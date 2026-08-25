import { Calendar, Tag } from "lucide-react";

export function ProjectHeader({
  title,
  year,
  tag,
}: {
  title: string;
  year: number;
  tag: string;
}) {
  return (
    <header className="mb-8">
      <h1 className="font-display text-4xl font-bold tracking-tight text-balance sm:text-5xl">
        {title}
      </h1>
      <div className="text-muted-foreground mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm">
        <span className="inline-flex items-center gap-2">
          <Calendar className="size-4" />
          {year}
        </span>
        <span className="inline-flex items-center gap-2">
          <Tag className="size-4" />
          {tag}
        </span>
      </div>
    </header>
  );
}
