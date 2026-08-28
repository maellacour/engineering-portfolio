"use client";

import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { Reveal } from "@/components/reveal";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { StroopTest } from "./stroop-test";

export function StroopSection() {
  const [unlocked, setUnlocked] = useState(false);

  return (
    <section
      id="try-stroop"
      className="scroll-mt-24 py-16 sm:py-20"
      aria-labelledby="stroop-heading"
    >
      <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
        <div>
          <Reveal>
            <p className="text-primary font-mono text-xs tracking-[0.2em] uppercase">
              Last experiment
            </p>
            <h2
              id="stroop-heading"
              className="font-display mt-3 text-3xl font-bold tracking-tight text-balance sm:text-4xl"
            >
              Name the colour, not the word
            </h2>
            <p className="text-muted-foreground mt-5 max-w-md text-justify text-pretty hyphens-auto">
              A reverse Stroop test: tap the name of the colour the word is
              printed in, not the word you read. Your brain reaches for the word
              first, so it takes focus to override it. Get eight in a row.
            </p>
          </Reveal>

          {unlocked && (
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
          )}
        </div>

        <Reveal delay={0.1}>
          <StroopTest onUnlock={() => setUnlocked(true)} />
        </Reveal>
      </div>
    </section>
  );
}
