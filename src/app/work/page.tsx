import type { Metadata } from "next";
import Link from "next/link";
import { CldImage } from "@/components/cld";
import { projects } from "@velite";
import { Reveal, RevealStagger, RevealItem } from "@/components/reveal";

export const metadata: Metadata = {
  title: "Work",
  description:
    "The full archive of projects — research games, XR tools, mobile apps and the infrastructure behind them.",
};

const all = [...projects].sort(
  (a, b) => (b.publishDate ?? b.date) - (a.publishDate ?? a.date),
);

export default function WorkPage() {
  return (
    <section className="py-12 sm:py-16">
      <Reveal>
        <h1 className="font-display text-4xl font-bold tracking-tight sm:text-5xl">
          Work
        </h1>
        <p className="text-muted-foreground mt-3 max-w-2xl text-pretty">
          The full archive — research games, XR tools, mobile apps, and the
          infrastructure that keeps studies running.
        </p>
      </Reveal>

      <RevealStagger className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {all.map((project) => (
          <RevealItem key={project.slug} className="h-full">
            <Link
              href={project.url}
              className="group border-border/60 focus-visible:ring-ring relative flex h-full min-h-64 flex-col justify-end overflow-hidden rounded-2xl border transition-transform duration-300 hover:-translate-y-1 focus-visible:ring-2 focus-visible:outline-none"
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
                <h2 className="font-display mt-1 text-xl font-semibold">
                  {project.title}
                </h2>
                <p className="mt-1 line-clamp-2 text-sm text-white/70">
                  {project.description}
                </p>
              </div>
            </Link>
          </RevealItem>
        ))}
      </RevealStagger>
    </section>
  );
}
