import type { Metadata } from "next";
import Link from "next/link";
import { notes } from "@velite";

export const metadata: Metadata = {
  title: "Notes",
};

const isDev = process.env.NODE_ENV === "development";

const published = notes
  .filter((note) => isDev || !note.draft)
  .sort((a, b) => b.date.localeCompare(a.date));

export default function NotesPage() {
  return (
    <section className="py-16">
      <h1 className="font-display text-4xl font-bold tracking-tight sm:text-5xl">
        Notes
      </h1>
      <p className="text-muted-foreground mt-3 max-w-xl text-pretty">
        Field notes on building software for research, and on putting AI to work
        in real engineering practice.
      </p>

      {published.length === 0 ? (
        <p className="text-muted-foreground mt-12 text-sm">Nothing here yet.</p>
      ) : (
        <ul className="divide-border/60 mt-12 divide-y">
          {published.map((note) => (
            <li key={note.slug}>
              <Link
                href={note.url}
                className="group focus-visible:ring-ring block rounded-lg py-5 focus-visible:ring-2 focus-visible:outline-none"
              >
                <time
                  dateTime={note.date}
                  className="text-muted-foreground text-xs"
                >
                  {new Date(note.date).toLocaleDateString("en", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </time>
                <h2 className="group-hover:text-primary mt-1 text-lg font-semibold transition-colors">
                  {note.title}
                </h2>
                {note.description && (
                  <p className="text-muted-foreground mt-1 text-sm">
                    {note.description}
                  </p>
                )}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
