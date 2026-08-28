"use client";

import { useState } from "react";
import { useReducedMotion } from "motion/react";
import { Reveal } from "@/components/reveal";
import { GoNoGoGame, TRIALS } from "./go-no-go-game";
import { RelatedProjectCard } from "./related-project-card";

export function GoNoGoSection() {
  const reduce = useReducedMotion();
  const [best, setBest] = useState(0);
  const [played, setPlayed] = useState(false);

  const onComplete = (correct: number) => {
    setPlayed(true);
    setBest((b) => Math.max(b, correct));
  };

  return (
    <section
      id="try-inhibition"
      className="scroll-mt-24 py-16 sm:py-20"
      aria-labelledby="inhibition-heading"
    >
      <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
        {/* Desktop: game on the left (alternating with the first section).
            Mobile: keep the write-up first, then the game. */}
        <Reveal className="order-2 lg:order-1">
          <GoNoGoGame onComplete={onComplete} />
        </Reveal>

        <div className="order-1 lg:order-2">
          <Reveal>
            <p className="text-primary font-mono text-xs tracking-[0.2em] uppercase">
              One more experiment
            </p>
            <h2
              id="inhibition-heading"
              className="font-display mt-3 text-3xl font-bold tracking-tight text-balance sm:text-4xl"
            >
              Go on green, stop on red
            </h2>
            <p className="text-muted-foreground mt-5 max-w-md text-justify text-pretty hyphens-auto">
              This is a Go/No-Go task: it measures response inhibition, how well
              you hold back an action you&rsquo;re primed to make. Tap when the
              circle turns green, do nothing when it turns red. A missed green
              or a tapped red both count against you.
            </p>
          </Reveal>

          {(played || reduce) && (
            <div className="mt-6 max-w-lg space-y-4">
              {played && (
                <p className="text-primary font-mono text-xs tracking-wider uppercase">
                  Best {best}/{TRIALS}
                </p>
              )}
              <RelatedProjectCard
                slug="studova"
                blurb="The platform I built to design and run tasks like this."
              />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
