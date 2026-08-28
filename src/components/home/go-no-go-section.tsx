"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";
import { Reveal } from "@/components/reveal";
import { cn } from "@/lib/utils";
import { RelatedProjectCard } from "./related-project-card";

const TRIALS = 14;
const STIM_MS = 850; // response window
const GAP_MS = 550; // inter-stimulus interval
const NOGO_PROB = 0.28;

type Phase = "idle" | "run" | "result";
type Stim = "go" | "nogo" | null;

export function GoNoGoSection() {
  const reduce = useReducedMotion();
  const [phase, setPhase] = useState<Phase>("idle");
  const [stim, setStim] = useState<Stim>(null);
  const [trial, setTrial] = useState(0);
  const [flash, setFlash] = useState<"ok" | "bad" | null>(null);
  const [result, setResult] = useState<number | null>(null);
  const [best, setBest] = useState(0);
  const [played, setPlayed] = useState(false);

  const responded = useRef(false);
  const correct = useRef(0);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const alive = useRef(true);

  useEffect(() => {
    alive.current = true;
    return () => {
      alive.current = false;
      timers.current.forEach(clearTimeout);
    };
  }, []);

  const later = (fn: () => void, ms: number) => {
    const t = setTimeout(() => {
      if (alive.current) fn();
    }, ms);
    timers.current.push(t);
  };

  const start = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
    correct.current = 0;
    setResult(null);
    setFlash(null);
    setPhase("run");

    // ~1 in 4 trials is a no-go, and never the first one.
    const seq: Stim[] = Array.from({ length: TRIALS }, (_, i) =>
      i > 0 && Math.random() < NOGO_PROB ? "nogo" : "go",
    );
    runTrial(seq, 0);
  };

  const runTrial = (seq: Stim[], i: number) => {
    if (i >= seq.length) {
      const c = correct.current;
      setBest((b) => Math.max(b, c));
      setResult(c);
      setPlayed(true);
      setPhase("result");
      setStim(null);
      return;
    }
    setTrial(i + 1);
    setStim(null); // inter-stimulus gap
    later(() => {
      const s = seq[i]!;
      responded.current = false;
      setStim(s);
      later(() => {
        // Score what the player did (or didn't do) in the response window.
        const r = responded.current;
        if (s === "nogo" && !r) correct.current += 1; // correct rejection
        if (s === "go" && !r) {
          setFlash("bad"); // miss
          later(() => setFlash(null), 220);
        }
        setStim(null);
        runTrial(seq, i + 1);
      }, STIM_MS);
    }, GAP_MS);
  };

  const tap = () => {
    if (phase !== "run" || stim === null || responded.current) return;
    responded.current = true;
    if (stim === "go") {
      correct.current += 1;
      setFlash("ok");
    } else {
      setFlash("bad"); // false alarm
    }
    later(() => setFlash(null), 220);
  };

  const instruction =
    phase === "idle"
      ? "Tap on green, hold on red."
      : phase === "run"
        ? `Trial ${trial}/${TRIALS}`
        : `You got ${result}/${TRIALS}${best ? ` · best ${best}` : ""}.`;

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
          {reduce ? (
            <div className="border-border/60 rounded-2xl border bg-white/[0.02] p-6 text-center backdrop-blur">
              <p className="text-muted-foreground text-sm">
                Motion is reduced, so this timed task is turned off here.
              </p>
            </div>
          ) : (
            <div className="border-border/60 rounded-2xl border bg-white/[0.02] p-5 backdrop-blur sm:p-6">
              <p className="text-muted-foreground text-sm" aria-live="polite">
                {instruction}
              </p>

              <button
                type="button"
                onClick={() => (phase === "run" ? tap() : undefined)}
                disabled={phase !== "run"}
                aria-label="Tap when the circle is green"
                className={cn(
                  "relative mx-auto mt-4 flex aspect-square w-full max-w-sm items-center justify-center rounded-full border transition-colors duration-150",
                  stim === "go"
                    ? "border-green-400/60 bg-green-500/80"
                    : stim === "nogo"
                      ? "border-red-400/60 bg-red-500/80"
                      : "border-border/60 bg-background/40",
                  phase === "run" && "cursor-pointer",
                  flash === "ok" && "ring-4 ring-green-400/70",
                  flash === "bad" && "ring-4 ring-red-400/70",
                )}
              >
                {phase === "run" && stim && (
                  <span className="text-2xl font-bold tracking-wide text-white">
                    {stim === "go" ? "GO" : "STOP"}
                  </span>
                )}
              </button>

              {phase === "idle" && (
                <div className="mt-4 flex justify-center">
                  <button
                    type="button"
                    onClick={start}
                    className="bg-primary text-primary-foreground rounded-full px-5 py-2.5 text-sm font-semibold transition-transform hover:-translate-y-0.5"
                  >
                    Start
                  </button>
                </div>
              )}

              {phase === "result" && (
                <div className="mt-4 flex justify-end">
                  <button
                    type="button"
                    onClick={start}
                    className="bg-primary text-primary-foreground rounded-full px-5 py-2 text-sm font-semibold transition-transform hover:-translate-y-0.5"
                  >
                    Play again
                  </button>
                </div>
              )}
            </div>
          )}
        </Reveal>

        {/* Text on the right. */}
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
            <div className="mt-6 max-w-lg">
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
