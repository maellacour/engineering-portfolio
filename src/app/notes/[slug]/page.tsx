import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { notes } from "@velite";
import { MDXContent } from "@/components/mdx-content";

export function generateStaticParams() {
  return notes.map((note) => ({ slug: note.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const note = notes.find((n) => n.slug === slug);
  if (!note) return {};
  return { title: note.title, description: note.description };
}

export default async function NotePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const note = notes.find((n) => n.slug === slug);
  if (!note) notFound();

  return (
    <article className="py-12">
      <header className="mb-8">
        <time dateTime={note.date} className="text-muted-foreground text-sm">
          {new Date(note.date).toLocaleDateString("en", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </time>
        <h1 className="mt-2 text-4xl font-bold tracking-tight text-balance sm:text-5xl">
          {note.title}
        </h1>
      </header>

      <div className="prose prose-zinc dark:prose-invert max-w-none">
        <MDXContent code={note.content} />
      </div>

      <Link
        href="/notes"
        className="text-muted-foreground hover:text-foreground mt-16 inline-flex items-center gap-2 text-sm font-medium transition-colors"
      >
        <ArrowLeft className="size-4" />
        All notes
      </Link>
    </article>
  );
}
