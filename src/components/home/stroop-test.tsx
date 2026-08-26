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

const THRESHOLD = 6;

// A ring of confetti vectors — deterministic (no Math.random, so it is
// hydration-safe and reproducible).
const CONFETTI = Array.from({ length: 12 }, (_, i) => {
  const angle = (i / 12) * Math.PI * 2;
  return {
    dx: `${Math.round(Math.cos(angle) * 52)}px`,
    dy: `${Math.round(Math.sin(angle) * 52)}px`,
    hex: COLORS[i % COLORS.length]!.hex,
  };
});

// An incongruent trial: the ink is always a different colour than the word.
function makeStim() {
  const word = Math.floor(Math.random() * COLORS.length);
  let ink = word;
  while (ink === word) ink = Math.floor(Math.random() * COLORS.length);
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

  useEffect(() => setStim(makeStim()), []);

  const pick = (i: number) => {
    if (i === stim.ink) {
      const s = streak + 1;
      setStreak(s);
      setBest((b) => Math.max(b, s));
      setFlash("ok");
      setStim(makeStim());
      if (s >= THRESHOLD && !unlocked) {
        setUnlocked(true);
        setCelebrate(true);
        window.setTimeout(() => setCelebrate(false), 900);
      }
    } else {
      setStreak(0);
      setFlash("no");
    }
    window.setTimeout(() => setFlash(null), 350);
  };

  return (
    <div
      className={cn(
        "border-border/60 relative rounded-xl border bg-white/[0.02] p-4 backdrop-blur transition-colors",
        flash === "ok" && "border-green-500/50",
        flash === "no" && "border-red-500/50",
      )}
    >
      {celebrate && !reduceMotion && (
        <div
          aria-hidden
          className="pointer-events-none absolute top-1/2 left-1/2 z-10"
        >
          {CONFETTI.map((c, i) => (
            <span
              key={i}
              className="absolute size-1.5 rounded-full"
              style={{
                backgroundColor: c.hex,
                ["--dx" as string]: c.dx,
                ["--dy" as string]: c.dy,
                animation: "stroop-pop 800ms ease-out forwards",
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
          className="border-primary/30 mt-4 border-t pt-4"
        >
          <p className="text-sm">
            Six clean reads through the interference — that&apos;s your
            attention doing real work. It&apos;s the kind of machinery I build
            tools for.{" "}
            <Link
              href="/projects/neurotrainer"
              className="text-primary inline-flex items-center gap-1 font-medium hover:underline"
            >
              Meet NeuroTrainer <ArrowRight className="size-3.5" />
            </Link>
          </p>
        </motion.div>
      )}
    </div>
  );
}
