"use client";

import { useState } from "react";
import { Reveal } from "@/components/reveal";
import { AttentionGame, levelFor } from "./attention-game";
import { RelatedProjectCard } from "./related-project-card";

export function AttentionSection() {
  const [wins, setWins] = useState(0);
  const level = levelFor(wins);

  return (
    <section
      id="try"
      className="scroll-mt-24 py-16 sm:py-20"
      aria-labelledby="try-heading"
    >
      <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
        <div>
          <Reveal>
            <p className="text-primary font-mono text-xs tracking-[0.2em] uppercase">
              Try what I build
            </p>
            <h2
              id="try-heading"
              className="font-display mt-3 text-3xl font-bold tracking-tight text-balance sm:text-4xl"
            >
              Keep two moving dots in sight
            </h2>
            <p className="text-muted-foreground mt-5 max-w-md text-justify text-pretty hyphens-auto">
              This is a multiple-object-tracking task: a standard way
              researchers measure visual attention. Two dots light up,
              everything starts moving, and you keep track of the right two.
              It&rsquo;s the kind of mechanic I build into games for
              cognitive-science studies.
            </p>
          </Reveal>

          {wins > 0 && (
            <div className="mt-6 max-w-lg">
              {/* Running score, on its own line. */}
              <p className="text-primary font-mono text-xs tracking-wider uppercase">
                {wins} solved · now tracking {level.targets} of {level.dots}
              </p>

              <div className="mt-4">
                <RelatedProjectCard
                  slug="ecorescue"
                  blurb="The same mechanic in a real attention & anxiety study."
                />
              </div>
            </div>
          )}
        </div>

        <Reveal delay={0.1}>
          <AttentionGame wins={wins} onWin={() => setWins((w) => w + 1)} />
        </Reveal>
      </div>
    </section>
  );
}
