import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { projects } from "@velite";
import { ProjectHeader } from "@/components/project/project-header";
import { ProjectGallery } from "@/components/project/project-gallery";
import { ProjectVideo } from "@/components/project/project-video";

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
      <ProjectHeader
        title={project.title}
        year={project.publishDate ?? project.date}
        tag={project.tag}
      />

      <ProjectGallery images={project.gallery} />

      <div className="mt-4 flex flex-col gap-10 sm:flex-row">
        {project.blocks.length > 0 && (
          <aside className="space-y-8 sm:w-1/3">
            {project.blocks.map((block) => (
              <div key={block.title}>
                <h3 className="mb-2 text-lg font-semibold">{block.title}</h3>
                <div
                  className="prose prose-sm prose-zinc dark:prose-invert max-w-none"
                  dangerouslySetInnerHTML={{ __html: block.body }}
                />
              </div>
            ))}
          </aside>
        )}

        <div className="sm:w-2/3">
          <h2 className="mb-6 text-2xl font-bold tracking-tight">
            {project.challengeTitle}
          </h2>
          <div
            className="prose prose-zinc dark:prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: project.challenge }}
          />
        </div>
      </div>

      {project.video && <ProjectVideo src={project.video.src} />}

      <Link
        href="/#projects"
        className="text-muted-foreground hover:text-foreground mt-16 inline-flex items-center gap-2 text-sm font-medium transition-colors"
      >
        <ArrowLeft className="size-4" />
        Back to projects
      </Link>
    </article>
  );
}
