import Link from "next/link";
import { CldImage } from "@/components/cld";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { home, projects } from "@velite";
import { Reveal } from "@/components/reveal";
import { cn } from "@/lib/utils";

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

      <div className="mt-14 space-y-16 sm:space-y-20">
        {featured.map((project, i) => (
          <Reveal key={project.slug}>
            <article className="grid items-center gap-6 lg:grid-cols-2 lg:gap-14">
              <Link
                href={project.url}
                className={cn(
                  "group border-border/60 focus-visible:ring-ring block overflow-hidden rounded-2xl border focus-visible:ring-2 focus-visible:outline-none",
                  i % 2 === 1 && "lg:order-last",
                )}
              >
                <CldImage
                  src={project.cover}
                  alt={project.title}
                  width={900}
                  height={563}
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="aspect-[16/10] w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </Link>

              <div>
                <p className="text-primary font-mono text-xs tracking-wider uppercase">
                  {project.tag}{" "}
                  <span className="text-muted-foreground">
                    · {project.publishDate ?? project.date}
                  </span>
                </p>
                <h3 className="font-display mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
                  <Link
                    href={project.url}
                    className="hover:text-primary transition-colors"
                  >
                    {project.title}
                  </Link>
                </h3>
                <p className="text-muted-foreground mt-3 text-pretty">
                  {project.description}
                </p>

                {project.status && (
                  <div className="border-primary/20 bg-primary/5 mt-5 rounded-lg border px-4 py-3">
                    <span className="text-primary font-mono text-[0.65rem] tracking-wider uppercase">
                      In use
                    </span>
                    <div
                      className="text-muted-foreground mt-1 text-sm [&>p]:m-0"
                      dangerouslySetInnerHTML={{ __html: project.status }}
                    />
                  </div>
                )}

                <Link
                  href={project.url}
                  className="group text-primary mt-5 inline-flex items-center gap-1.5 text-sm font-medium"
                >
                  View project
                  <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
                </Link>
              </div>
            </article>
          </Reveal>
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
