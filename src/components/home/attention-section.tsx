"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Reveal } from "@/components/reveal";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { AttentionGame, levelFor } from "./attention-game";

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

          {/* Revealed on the first solve: the running score and the EcoRescue tie-in. */}
          {wins > 0 && (
            <div className="border-primary/20 bg-primary/5 mt-6 max-w-md rounded-xl border p-4">
              <p className="text-primary font-mono text-xs tracking-wider uppercase">
                {wins} solved · now tracking {level.targets} of {level.dots}
              </p>
              <p className="text-muted-foreground mt-2 text-justify text-sm text-pretty hyphens-auto">
                EcoRescue puts this to work in a real study: an action game
                measuring attention and anxiety in adolescents, run across
                Geneva, Haifa and Miami.
              </p>
              <Link
                href="/projects/ecorescue"
                className={cn(
                  buttonVariants({ variant: "default" }),
                  "group mt-3 gap-2",
                )}
              >
                See EcoRescue
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
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
