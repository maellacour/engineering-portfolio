"use client";

import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { StroopTest } from "./stroop-test";
import { TryGameSection } from "./try-game-section";

export function StroopSection() {
  const [unlocked, setUnlocked] = useState(false);

  return (
    <TryGameSection
      id="try-stroop"
      eyebrow="Last experiment"
      heading="Name the colour, not the word"
      intro="A reverse Stroop test: tap the name of the colour the word is printed in, not the word you read. Your brain reaches for the word first, so it takes focus to override it. Get eight in a row."
      game={<StroopTest onUnlock={() => setUnlocked(true)} />}
      reveal={
        unlocked && (
          <div className="border-primary/20 bg-primary/5 mt-6 flex max-w-lg flex-wrap items-center justify-between gap-3 rounded-2xl border p-4">
            <p className="text-muted-foreground text-sm">
              Eight in a row. Now that I have your attention, come say hi.
            </p>
            <a
              href="#contact"
              className={cn(
                buttonVariants({ variant: "default" }),
                "group shrink-0 gap-2",
              )}
            >
              Get in touch
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
            </a>
          </div>
        )
      }
    />
  );
}
