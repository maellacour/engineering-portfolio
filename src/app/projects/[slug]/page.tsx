import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { projects } from "@velite";
import { ProjectHeader } from "@/components/project/project-header";
import { ProjectGallery } from "@/components/project/project-gallery";
import { ProjectVideo } from "@/components/project/project-video";
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

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  if (!project) notFound();

  return (
    <article className="py-12">
      <Reveal>
        <ProjectHeader
          title={project.title}
          year={project.publishDate ?? project.date}
          tag={project.tag}
        />
      </Reveal>

      <Reveal>
        <ProjectGallery images={project.gallery} />
      </Reveal>

      <div className="mt-4 flex flex-col gap-10 sm:flex-row sm:gap-14">
        {project.blocks.length > 0 && (
          <aside className="space-y-6 sm:sticky sm:top-24 sm:w-1/3 sm:self-start">
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

        <div className="space-y-12 sm:w-2/3">
          <Reveal>
            <h2 className="font-display mb-5 text-2xl font-bold tracking-tight">
              {project.challengeTitle}
            </h2>
            <div
              className="prose prose-zinc dark:prose-invert max-w-none"
              dangerouslySetInnerHTML={{ __html: project.challenge }}
            />
          </Reveal>

          {project.status && (
            <Reveal>
              <h2 className="font-display mb-5 text-2xl font-bold tracking-tight">
                In use
              </h2>
              <div
                className="prose prose-zinc dark:prose-invert max-w-none"
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
                className="prose prose-zinc dark:prose-invert max-w-none"
                dangerouslySetInnerHTML={{ __html: project.lessons }}
              />
            </Reveal>
          )}
        </div>
      </div>

      {project.video && (
        <Reveal>
          <ProjectVideo src={project.video.src} />
        </Reveal>
      )}

      <Link
        href="/work"
        className="text-muted-foreground hover:text-foreground mt-16 inline-flex items-center gap-2 text-sm font-medium transition-colors"
      >
        <ArrowLeft className="size-4" />
        All work
      </Link>
    </article>
  );
}
