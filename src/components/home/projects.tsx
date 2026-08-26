import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { home, projects } from "@velite";
import { Reveal } from "@/components/reveal";
import { ProjectRow } from "./project-row";

const featured = projects
  .filter((p) => p.featured)
  .sort((a, b) => a.order - b.order);
const hasArchive = projects.some((p) => !p.featured);

export function Projects() {
  return (
    <section
      id="projects"
      className="scroll-mt-24 py-16 sm:py-24"
      aria-labelledby="projects-heading"
    >
      <Reveal>
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
      </Reveal>

      <div className="mt-14 space-y-16 sm:space-y-24">
        {featured.map((project, i) => (
          <ProjectRow key={project.slug} project={project} index={i} />
        ))}
      </div>

      {hasArchive && (
        <Reveal className="mt-16">
          <Link
            href="/work"
            className="group border-border/60 hover:border-primary/40 inline-flex items-center gap-2 rounded-full border px-5 py-2.5 text-sm font-medium transition-colors"
          >
            View all work
            <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </Reveal>
      )}
    </section>
  );
}
