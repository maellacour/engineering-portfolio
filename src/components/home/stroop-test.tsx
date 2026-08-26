"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

const COLORS = [
  { name: "red", hex: "#ef4444" },
  { name: "green", hex: "#22c55e" },
  { name: "blue", hex: "#3b82f6" },
  { name: "yellow", hex: "#eab308" },
];

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

  useEffect(() => setStim(makeStim()), []);

  const pick = (i: number) => {
    if (i === stim.ink) {
      const s = streak + 1;
      setStreak(s);
      setBest((b) => Math.max(b, s));
      setFlash("ok");
      setStim(makeStim());
    } else {
      setStreak(0);
      setFlash("no");
    }
    window.setTimeout(() => setFlash(null), 350);
  };

  return (
    <div
      className={cn(
        "border-border/60 rounded-xl border bg-white/[0.02] p-4 backdrop-blur transition-colors",
        flash === "ok" && "border-green-500/50",
        flash === "no" && "border-red-500/50",
      )}
    >
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
    </div>
  );
}
