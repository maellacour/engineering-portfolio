"use client";

import { useState } from "react";
import { AttentionGame, levelFor } from "./attention-game";
import { RelatedProjectCard } from "./related-project-card";
import { TryGameSection } from "./try-game-section";

export function AttentionSection() {
  const [wins, setWins] = useState(0);
  const level = levelFor(wins);

  return (
    <TryGameSection
      id="try"
      eyebrow="Try what I build"
      heading="Keep two moving dots in sight"
      intro="This is a multiple-object-tracking task: a standard way researchers measure visual attention. Two dots light up, everything starts moving, and you keep track of the right two. It's the kind of mechanic I build into games for cognitive-science studies."
      game={<AttentionGame wins={wins} onWin={() => setWins((w) => w + 1)} />}
      reveal={
        wins > 0 && (
          <div className="mt-6 max-w-lg">
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
        )
      }
    />
  );
}
