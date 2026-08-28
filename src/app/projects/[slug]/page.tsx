import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { projects } from "@velite";
import { CldImage } from "@/components/cld";
import { ProjectHeader } from "@/components/project/project-header";
import { ProjectGallery } from "@/components/project/project-gallery";
import { ProjectVideo } from "@/components/project/project-video";
import { ProjectNav } from "@/components/project/project-nav";
import { Reveal } from "@/components/reveal";

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  if (!project) return {};
  return {
    title: project.title,
    description: project.description,
    openGraph: {
      title: project.title,
      description: project.description,
      type: "article",
    },
  };
}

// Same order the /work archive uses: featured first (by order), then the rest
// newest-first. Prev/next wrap around so there is always another project.
const ordered = [
  ...projects.filter((p) => p.featured).sort((a, b) => a.order - b.order),
  ...projects
    .filter((p) => !p.featured)
    .sort((a, b) => (b.publishDate ?? b.date) - (a.publishDate ?? a.date)),
];

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  if (!project) notFound();

  const idx = ordered.findIndex((p) => p.slug === slug);
  const prev = ordered[(idx - 1 + ordered.length) % ordered.length];
  const next = ordered[(idx + 1) % ordered.length];
  // The cover doubles as the hero, so drop it from the gallery grid.
  const gallery = project.gallery.filter((img) => img.src !== project.cover);

  return (
    <article className="py-12">
      <Reveal>
        <Link
          href="/work"
          className="text-muted-foreground hover:text-foreground mb-8 inline-flex items-center gap-2 text-sm font-medium transition-colors"
        >
          <ArrowLeft className="size-4" />
          All work
        </Link>
        <ProjectHeader
          title={project.title}
          year={project.publishDate ?? project.date}
          tag={project.tag}
        />
        <p className="text-muted-foreground max-w-2xl text-justify text-lg leading-relaxed text-pretty hyphens-auto">
          {project.description}
        </p>
      </Reveal>

      <Reveal>
        <div className="mt-8 overflow-hidden rounded-2xl">
          <CldImage
            src={project.cover}
            alt={project.title}
            width={1600}
            height={900}
            sizes="(max-width: 1024px) 100vw, 960px"
            className="aspect-[16/9] w-full object-cover"
            priority
          />
        </div>
      </Reveal>

      <div className="mt-12 flex flex-col gap-10 sm:flex-row sm:gap-14">
        {project.blocks.length > 0 && (
          <aside className="order-2 space-y-6 sm:sticky sm:top-24 sm:order-1 sm:w-1/3 sm:self-start">
            {project.blocks.map((block) => (
              <div key={block.title}>
                <h3 className="text-muted-foreground mb-1.5 font-mono text-xs tracking-wider uppercase">
                  {block.title}
                </h3>
                <div
                  className="prose prose-sm prose-zinc dark:prose-invert max-w-none"
                  dangerouslySetInnerHTML={{ __html: block.body }}
                />
              </div>
            ))}
          </aside>
        )}

        <div className="order-1 space-y-12 sm:order-2 sm:w-2/3">
          <Reveal>
            <h2 className="font-display mb-5 text-2xl font-bold tracking-tight">
              {project.challengeTitle}
            </h2>
            <div
              className="prose prose-zinc dark:prose-invert max-w-none text-justify hyphens-auto"
              dangerouslySetInnerHTML={{ __html: project.challenge }}
            />
          </Reveal>

          {project.status && (
            <Reveal>
              <h2 className="font-display mb-5 text-2xl font-bold tracking-tight">
                In use
              </h2>
              <div
                className="prose prose-zinc dark:prose-invert max-w-none text-justify hyphens-auto"
                dangerouslySetInnerHTML={{ __html: project.status }}
              />
            </Reveal>
          )}

          {project.lessons && (
            <Reveal>
              <h2 className="font-display mb-5 text-2xl font-bold tracking-tight">
                What I learned
              </h2>
              <div
                className="prose prose-zinc dark:prose-invert max-w-none text-justify hyphens-auto"
                dangerouslySetInnerHTML={{ __html: project.lessons }}
              />
            </Reveal>
          )}
        </div>
      </div>

      <ProjectGallery images={gallery} />

      {project.video && (
        <Reveal>
          <ProjectVideo src={project.video.src} poster={project.cover} />
        </Reveal>
      )}

      <ProjectNav prev={prev} next={next} />
    </article>
  );
}
