"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

const COLORS = [
  { name: "red", hex: "#ef4444" },
  { name: "green", hex: "#22c55e" },
  { name: "blue", hex: "#3b82f6" },
  { name: "yellow", hex: "#eab308" },
];

const THRESHOLD = 8;

// Two rings of confetti, deterministic (no Math.random, so it is hydration-safe
// and reproducible): an outer ring that flies far and an inner ring that stays
// tighter — giving the burst some depth.
const RINGS = [
  { count: 14, dist: 96, size: 9, dur: 1150, offset: 0 },
  { count: 14, dist: 56, size: 6, dur: 900, offset: 0.22 },
];
const CONFETTI = RINGS.flatMap((r, ri) =>
  Array.from({ length: r.count }, (_, k) => {
    const angle = (k / r.count) * Math.PI * 2 + r.offset;
    return {
      dx: `${Math.round(Math.cos(angle) * r.dist)}px`,
      dy: `${Math.round(Math.sin(angle) * r.dist)}px`,
      hex: COLORS[(k + ri) % COLORS.length]!.hex,
      size: r.size,
      dur: r.dur,
    };
  }),
);

// An incongruent trial (ink ≠ word) that never repeats the previous combo.
function makeStim(prev?: { word: number; ink: number }) {
  let word: number;
  let ink: number;
  do {
    word = Math.floor(Math.random() * COLORS.length);
    ink = word;
    while (ink === word) ink = Math.floor(Math.random() * COLORS.length);
  } while (prev && prev.word === word && prev.ink === ink);
  return { word, ink };
}

export function StroopTest() {
  // Deterministic first render so server and client HTML match; the real
  // randomised trial is drawn after mount to avoid a hydration mismatch.
  const [stim, setStim] = useState({ word: 0, ink: 1 });
  const [streak, setStreak] = useState(0);
  const [best, setBest] = useState(0);
  const [flash, setFlash] = useState<"ok" | "no" | null>(null);
  const [unlocked, setUnlocked] = useState(false);
  const [celebrate, setCelebrate] = useState(false);
  const reduceMotion = useReducedMotion();

  useEffect(() => setStim((prev) => makeStim(prev)), []);

  const pick = (i: number) => {
    if (i === stim.ink) {
      const s = streak + 1;
      setStreak(s);
      setBest((b) => Math.max(b, s));
      setFlash("ok");
      setStim((prev) => makeStim(prev));
      if (s >= THRESHOLD && !unlocked) {
        setUnlocked(true);
        setCelebrate(true);
        window.setTimeout(() => setCelebrate(false), 1300);
      }
    } else {
      setStreak(0);
      setFlash("no");
    }
    window.setTimeout(() => setFlash(null), 350);
  };

  const cheering = celebrate && !reduceMotion;

  return (
    <div
      className={cn(
        "border-border/60 relative rounded-xl border bg-white/[0.02] p-4 backdrop-blur transition-colors",
        flash === "ok" && "border-green-500/50",
        flash === "no" && "border-red-500/50",
        cheering && "border-primary/60",
      )}
      style={
        cheering ? { animation: "stroop-cheer 1300ms ease-out" } : undefined
      }
    >
      {cheering && (
        <div
          aria-hidden
          className="pointer-events-none absolute top-1/2 left-1/2 z-10"
        >
          {CONFETTI.map((c, i) => (
            <span
              key={i}
              className="absolute rounded-full"
              style={{
                width: c.size,
                height: c.size,
                backgroundColor: c.hex,
                ["--dx" as string]: c.dx,
                ["--dy" as string]: c.dy,
                animation: `stroop-pop ${c.dur}ms ease-out forwards`,
              }}
            />
          ))}
        </div>
      )}

      <div className="flex items-center justify-between">
        <span className="text-primary font-mono text-xs tracking-wider uppercase">
          Stroop test
        </span>
        <span className="text-muted-foreground font-mono text-xs">
          streak {streak} · best {best}
        </span>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-x-6 gap-y-3">
        <span
          className="text-2xl font-bold tracking-wide tabular-nums sm:text-3xl"
          style={{ color: COLORS[stim.ink]!.hex }}
        >
          {COLORS[stim.word]!.name.toUpperCase()}
        </span>

        <div className="flex gap-2">
          {COLORS.map((c, i) => (
            <button
              key={c.name}
              type="button"
              onClick={() => pick(i)}
              aria-label={`ink is ${c.name}`}
              className="focus-visible:ring-ring size-8 rounded-full ring-1 ring-black/20 transition-transform hover:scale-110 focus-visible:ring-2 focus-visible:outline-none"
              style={{ backgroundColor: c.hex }}
            />
          ))}
        </div>

        <span className="text-muted-foreground text-xs">
          Tap the ink colour, not the word.
        </span>
      </div>

      {unlocked && (
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="border-primary/30 mt-4 space-y-2 border-t pt-4 text-sm"
        >
          <p>
            Eight in a row — you just beat the Stroop effect eight times,
            forcing the ink past the word your brain instinctively wants to read
            first. That tug-of-war between automatic and controlled attention is
            the exact territory I work in.
          </p>
          <p className="text-muted-foreground">
            NeuroTrainer takes it into the operating room: a VR tool that lets
            neurosurgeons and radiologists at HUG read MRI and CT volumes in
            real time.{" "}
            <Link
              href="/projects/neurotrainer"
              className="text-primary inline-flex items-center gap-1 font-medium hover:underline"
            >
              See the project <ArrowRight className="size-3.5" />
            </Link>
          </p>
        </motion.div>
      )}
    </div>
  );
}
