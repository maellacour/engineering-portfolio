import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { projects } from "@velite";
import { CldImage } from "@/components/cld";

// A compact, clearly-tappable link to a project: cover thumbnail, label,
// title and a one-line tie-in. Reused by any interactive section that wants to
// point to the real work behind it.
export function RelatedProjectCard({
  slug,
  blurb,
  label = "See related project",
}: {
  slug: string;
  blurb: string;
  label?: string;
}) {
  const project = projects.find((p) => p.slug === slug);
  if (!project) return null;

  return (
    <Link
      href={project.url}
      className="group border-border/60 hover:border-primary/40 flex items-center gap-4 rounded-2xl border p-4 transition-colors"
    >
      <div className="size-16 shrink-0 overflow-hidden rounded-lg">
        <CldImage
          src={project.cover}
          alt={project.title}
          width={128}
          height={128}
          className="h-full w-full object-cover"
        />
      </div>
      <div className="min-w-0">
        <span className="text-primary font-mono text-[0.65rem] tracking-wider uppercase">
          {label}
        </span>
        <p className="font-display group-hover:text-primary font-semibold tracking-tight transition-colors">
          {project.title}
        </p>
        <p className="text-muted-foreground text-sm">{blurb}</p>
      </div>
      <ArrowRight className="text-muted-foreground group-hover:text-primary ml-auto size-4 shrink-0 transition-transform group-hover:translate-x-0.5" />
    </Link>
  );
}
