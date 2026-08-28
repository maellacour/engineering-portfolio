"use client";

import { useState } from "react";
import { useReducedMotion } from "motion/react";
import { GoNoGoGame, TRIALS } from "./go-no-go-game";
import { RelatedProjectCard } from "./related-project-card";
import { TryGameSection } from "./try-game-section";

export function GoNoGoSection() {
  const reduce = useReducedMotion();
  const [best, setBest] = useState(0);
  const [played, setPlayed] = useState(false);

  const onComplete = (correct: number) => {
    setPlayed(true);
    setBest((b) => Math.max(b, correct));
  };

  return (
    <TryGameSection
      id="try-inhibition"
      gameSide="left"
      eyebrow="One more experiment"
      heading="Go on green, stop on red"
      intro="This is a Go/No-Go task: it measures response inhibition, how well you hold back an action you're primed to make. Tap when the circle turns green, do nothing when it turns red. A missed green or a tapped red both count against you."
      game={<GoNoGoGame onComplete={onComplete} />}
      reveal={
        (played || reduce) && (
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
        )
      }
    />
  );
}
