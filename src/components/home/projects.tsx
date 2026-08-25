import Link from "next/link";
import { CldImage } from "@/components/cld";
import { ArrowUpRight } from "lucide-react";
import { home, projects } from "@velite";

const featured = projects
  .filter((p) => p.featured)
  .sort((a, b) => a.order - b.order);
const others = projects
  .filter((p) => !p.featured)
  .sort((a, b) => a.order - b.order);

export function Projects() {
  return (
    <section
      id="projects"
      className="scroll-mt-24 py-16 sm:py-24"
      aria-labelledby="projects-heading"
    >
      <div className="max-w-2xl">
        <h2
          id="projects-heading"
          className="font-display text-3xl font-bold tracking-tight sm:text-4xl"
        >
          {home.projects.title}
        </h2>
        {home.projects.description && (
          <p className="text-muted-foreground mt-3 text-pretty">
            {home.projects.description}
          </p>
        )}
      </div>

      {/* Featured — image-forward cards */}
      <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {featured.map((project) => (
          <Link
            key={project.slug}
            href={project.url}
            className="group border-border/60 focus-visible:ring-ring relative flex min-h-64 flex-col justify-end overflow-hidden rounded-2xl border transition-transform duration-300 hover:-translate-y-1 focus-visible:ring-2 focus-visible:outline-none"
          >
            <CldImage
              src={project.cover}
              alt={project.title}
              width={700}
              height={520}
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div
              aria-hidden
              className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"
            />
            <div className="relative p-5 text-white">
              <span className="text-primary font-mono text-[0.66rem] tracking-wider uppercase">
                {project.tag}
              </span>
              <h3 className="font-display mt-1 text-xl font-semibold">
                {project.title}
              </h3>
              <p className="mt-1 line-clamp-2 text-sm text-white/70">
                {project.description}
              </p>
            </div>
          </Link>
        ))}
      </div>

      {/* Others — mono index */}
      {others.length > 0 && (
        <div className="border-border/60 mt-6 border-t">
          {others.map((project) => (
            <Link
              key={project.slug}
              href={project.url}
              className="group border-border/60 hover:text-primary flex items-center gap-4 border-b py-4 transition-colors"
            >
              <span className="font-display flex-1 text-lg font-medium">
                {project.title}
              </span>
              <span className="text-muted-foreground hidden font-mono text-xs sm:inline">
                {project.tag}
              </span>
              <ArrowUpRight className="text-muted-foreground group-hover:text-primary size-4 shrink-0 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
