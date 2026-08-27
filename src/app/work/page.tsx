import type { Metadata } from "next";
import { projects } from "@velite";
import { Reveal } from "@/components/reveal";
import { ProjectRow } from "@/components/home/project-row";

export const metadata: Metadata = {
  title: "Work",
  description:
    "The full archive of projects: research games, XR tools, mobile apps and the infrastructure behind them.",
};

const featured = projects
  .filter((p) => p.featured)
  .sort((a, b) => a.order - b.order);

const rest = projects
  .filter((p) => !p.featured)
  .sort((a, b) => (b.publishDate ?? b.date) - (a.publishDate ?? a.date));

export default function WorkPage() {
  return (
    <section className="py-12 sm:py-16">
      <Reveal>
        <h1 className="font-display text-4xl font-bold tracking-tight sm:text-5xl">
          Work
        </h1>
        <p className="text-muted-foreground mt-3 max-w-2xl text-pretty">
          The full archive: research games, XR tools, mobile apps, and the
          infrastructure that keeps studies running.
        </p>
      </Reveal>

      {featured.length > 0 && (
        <div className="mt-12 space-y-16 sm:space-y-24">
          {featured.map((project, i) => (
            <ProjectRow key={project.slug} project={project} index={i} />
          ))}
        </div>
      )}

      {rest.length > 0 && (
        <div className="mt-20 sm:mt-28">
          <Reveal>
            <h2 className="font-display text-2xl font-bold tracking-tight sm:text-3xl">
              More work
            </h2>
          </Reveal>

          <div className="mt-12 space-y-16 sm:space-y-24">
            {rest.map((project, i) => (
              <ProjectRow
                key={project.slug}
                project={project}
                index={featured.length + i}
              />
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
