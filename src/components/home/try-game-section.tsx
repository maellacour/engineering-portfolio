import type { ReactNode } from "react";
import { Reveal } from "@/components/reveal";
import { cn } from "@/lib/utils";

// Shared layout for the "try a task I build" home sections: framing copy on one
// side, the interactive game on the other, and an optional block revealed once
// the visitor has engaged. gameSide flips the columns on desktop; the write-up
// always comes first on mobile.
export function TryGameSection({
  id,
  eyebrow,
  heading,
  intro,
  game,
  reveal,
  gameSide = "right",
}: {
  id: string;
  eyebrow: string;
  heading: string;
  intro: string;
  game: ReactNode;
  reveal?: ReactNode;
  gameSide?: "left" | "right";
}) {
  const headingId = `${id}-heading`;
  return (
    <section
      id={id}
      className="scroll-mt-24 py-16 sm:py-20"
      aria-labelledby={headingId}
    >
      <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
        <div className={cn(gameSide === "left" && "lg:order-2")}>
          <Reveal>
            <p className="text-primary font-mono text-xs tracking-[0.2em] uppercase">
              {eyebrow}
            </p>
            <h2
              id={headingId}
              className="font-display mt-3 text-3xl font-bold tracking-tight text-balance sm:text-4xl"
            >
              {heading}
            </h2>
            <p className="text-muted-foreground mt-5 max-w-md text-justify text-pretty hyphens-auto">
              {intro}
            </p>
          </Reveal>
          {reveal}
        </div>

        <Reveal delay={0.1} className={cn(gameSide === "left" && "lg:order-1")}>
          {game}
        </Reveal>
      </div>
    </section>
  );
}
