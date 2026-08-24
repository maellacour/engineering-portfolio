import Link from "next/link";
import { CldImage } from "@/components/cld";
import { ArrowRight } from "lucide-react";
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
      className="scroll-mt-24 py-16 sm:py-20"
      aria-labelledby="projects-heading"
    >
      <div className="max-w-2xl">
        <h2
          id="projects-heading"
          className="text-3xl font-bold tracking-tight sm:text-4xl"
        >
          {home.projects.title}
        </h2>
        <p className="text-muted-foreground mt-3 text-pretty">
          {home.projects.description}
        </p>
      </div>

      <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-3">
        {featured.map((project) => (
          <Link
            key={project.slug}
            href={project.url}
            className="group border-border/60 bg-card focus-visible:ring-ring flex flex-col overflow-hidden rounded-2xl border transition-shadow hover:shadow-xl focus-visible:ring-2 focus-visible:outline-none"
          >
            <div className="bg-muted aspect-video overflow-hidden">
              <CldImage
                src={project.cover}
                alt={project.title}
                width={800}
                height={450}
                sizes="(max-width: 1024px) 100vw, 33vw"
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>
            <div className="flex flex-1 flex-col gap-2 p-5">
              <h3 className="group-hover:text-primary text-lg font-semibold transition-colors">
                {project.title}
              </h3>
              <p className="text-muted-foreground line-clamp-2 text-sm">
                {project.description}
              </p>
              <span className="text-primary mt-auto inline-flex items-center gap-1 pt-2 text-sm font-medium">
                View project
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
              </span>
            </div>
          </Link>
        ))}
      </div>

      {others.length > 0 && (
        <>
          <h3 className="text-muted-foreground mt-12 mb-5 text-sm font-semibold tracking-wide uppercase">
            More projects
          </h3>
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {others.map((project) => (
              <Link
                key={project.slug}
                href={project.url}
                className="group border-border/60 bg-card focus-visible:ring-ring flex flex-col overflow-hidden rounded-xl border transition-shadow hover:shadow-lg focus-visible:ring-2 focus-visible:outline-none"
              >
                <div className="bg-muted aspect-video overflow-hidden">
                  <CldImage
                    src={project.cover}
                    alt={project.title}
                    width={400}
                    height={225}
                    sizes="(max-width: 640px) 50vw, 25vw"
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="flex items-center justify-between gap-2 p-3">
                  <h4 className="group-hover:text-primary truncate text-sm font-medium transition-colors">
                    {project.title}
                  </h4>
                  <ArrowRight className="text-muted-foreground group-hover:text-primary size-3.5 shrink-0 transition-transform group-hover:translate-x-0.5" />
                </div>
              </Link>
            ))}
          </div>
        </>
      )}
    </section>
  );
}
