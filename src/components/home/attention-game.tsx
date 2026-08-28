"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

const MARGIN = 9; // keep dots inside the circle (percent)
const R = 50 - MARGIN; // arena radius in percent
const SHOW_MS = 1600;
const MOVE_MS = 4200;
const SHOW_SPEED = 0.4; // slower drift while the targets are revealed
const BASE_SPEED = 0.6;

// Difficulty ramps with cumulative wins: one more dot to track and one more on
// screen at 3 solves, then again at 10. Drift speed stays the same.
const LEVELS = [
  { at: 0, dots: 7, targets: 2 },
  { at: 3, dots: 8, targets: 3 },
  { at: 10, dots: 9, targets: 4 },
] as const;

export type Level = { dots: number; targets: number };

export function levelFor(wins: number): Level {
  let level: Level = LEVELS[0];
  for (const l of LEVELS) if (wins >= l.at) level = l;
  return level;
}

type Phase = "idle" | "show" | "move" | "answer" | "result";
type Dot = { x: number; y: number; vx: number; vy: number };

// Deterministic confetti burst (no Math.random, so it is hydration-safe; it
// only renders after a win anyway).
const CONFETTI_COLORS = ["#6366f1", "#22c55e", "#eab308", "#f97316"];
const CONFETTI = Array.from({ length: 16 }, (_, k) => {
  const angle = (k / 16) * Math.PI * 2;
  const dist = 68 + (k % 2) * 26;
  return {
    dx: `${Math.round(Math.cos(angle) * dist)}px`,
    dy: `${Math.round(Math.sin(angle) * dist)}px`,
    color: CONFETTI_COLORS[k % CONFETTI_COLORS.length]!,
    size: 6 + (k % 2) * 3,
    dur: 900 + (k % 3) * 120,
  };
});

function pickTargets(total: number, count: number) {
  const idx = [...Array(total).keys()];
  for (let i = idx.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [idx[i], idx[j]] = [idx[j]!, idx[i]!];
  }
  return idx.slice(0, count);
}

export function AttentionGame({
  wins,
  onWin,
}: {
  wins: number;
  onWin: () => void;
}) {
  const reduce = useReducedMotion();
  const [level, setLevel] = useState<Level>(() => levelFor(0));
  const [phase, setPhase] = useState<Phase>("idle");
  const [targets, setTargets] = useState<number[]>([]);
  const [picked, setPicked] = useState<number[]>([]);
  const [celebrate, setCelebrate] = useState(false);

  const dots = useRef<Dot[]>([]);
  const els = useRef<(HTMLButtonElement | null)[]>([]);
  const raf = useRef(0);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const cheerTimer = useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined,
  );

  const paint = useCallback(() => {
    dots.current.forEach((d, i) => {
      const el = els.current[i];
      if (el) {
        el.style.left = `${d.x}%`;
        el.style.top = `${d.y}%`;
      }
    });
  }, []);

  const seed = useCallback(
    (count: number) => {
      dots.current = Array.from({ length: count }, () => {
        const a = Math.random() * Math.PI * 2;
        const r = R * Math.sqrt(Math.random());
        const dir = Math.random() * Math.PI * 2;
        return {
          x: 50 + r * Math.cos(a),
          y: 50 + r * Math.sin(a),
          vx: Math.cos(dir) * BASE_SPEED,
          vy: Math.sin(dir) * BASE_SPEED,
        };
      });
      paint();
    },
    [paint],
  );

  useEffect(() => {
    seed(levelFor(0).dots);
    return () => {
      clearTimeout(timer.current);
      clearTimeout(cheerTimer.current);
      cancelAnimationFrame(raf.current);
    };
  }, [seed]);

  const start = () => {
    const lvl = levelFor(wins);
    setLevel(lvl);
    setPicked([]);
    setCelebrate(false);
    clearTimeout(cheerTimer.current);
    seed(lvl.dots);
    setTargets(pickTargets(lvl.dots, lvl.targets));
    setPhase("show");
    timer.current = setTimeout(() => setPhase("move"), SHOW_MS);
  };

  // Drive the drift during both the reveal (slow) and the tracking (full speed).
  useEffect(() => {
    if (phase !== "show" && phase !== "move") return;
    const factor = phase === "show" ? SHOW_SPEED : 1;
    let running = true;
    const loop = () => {
      if (!running) return;
      for (const d of dots.current) {
        d.x += d.vx * factor;
        d.y += d.vy * factor;
        const dx = d.x - 50;
        const dy = d.y - 50;
        const dist = Math.hypot(dx, dy) || 1;
        if (dist > R) {
          const nx = dx / dist;
          const ny = dy / dist;
          const vdotn = d.vx * nx + d.vy * ny;
          if (vdotn > 0) {
            d.vx -= 2 * vdotn * nx;
            d.vy -= 2 * vdotn * ny;
          }
          d.x = 50 + nx * R;
          d.y = 50 + ny * R;
        }
      }
      paint();
      raf.current = requestAnimationFrame(loop);
    };
    raf.current = requestAnimationFrame(loop);
    const stop =
      phase === "move"
        ? setTimeout(() => setPhase("answer"), MOVE_MS)
        : undefined;
    return () => {
      running = false;
      cancelAnimationFrame(raf.current);
      clearTimeout(stop);
    };
  }, [phase, paint]);

  const pick = (i: number) => {
    if (phase !== "answer" || picked.includes(i)) return;
    const next = [...picked, i];
    setPicked(next);
    if (next.length === level.targets) {
      const won = next.every((p) => targets.includes(p));
      setPhase("result");
      if (won) {
        onWin();
        setCelebrate(true);
        cheerTimer.current = setTimeout(() => setCelebrate(false), 1200);
      }
    }
  };

  const revealTargets = phase === "show" || phase === "result";
  const won =
    phase === "result" &&
    picked.length === level.targets &&
    picked.every((p) => targets.includes(p));

  if (reduce) {
    return (
      <div className="border-border/60 rounded-2xl border bg-white/[0.02] p-6 text-center backdrop-blur">
        <p className="text-muted-foreground text-sm">
          Motion is reduced, so the dot-tracking task sits still here.
        </p>
      </div>
    );
  }

  const prompt =
    phase === "idle"
      ? `Keep your eye on the ${level.targets} highlighted dots.`
      : phase === "show"
        ? "Memorise them…"
        : phase === "move"
          ? "Track them…"
          : phase === "answer"
            ? `Which ${level.targets}? (${picked.length}/${level.targets})`
            : won
              ? "Nailed it."
              : "Not quite. Harder than it looks.";

  return (
    <div className="border-border/60 rounded-2xl border bg-white/[0.02] p-5 backdrop-blur sm:p-6">
      <p className="text-muted-foreground text-sm" aria-live="polite">
        {prompt}
      </p>

      <div
        className={cn(
          "border-border/60 bg-background/40 relative mx-auto mt-4 aspect-square w-full max-w-sm overflow-hidden rounded-full border",
          celebrate && "animate-[stroop-cheer_1s_ease]",
        )}
      >
        {Array.from({ length: level.dots }).map((_, i) => {
          const isRevealed = revealTargets && targets.includes(i);
          const isSelected = picked.includes(i);
          return (
            <button
              key={i}
              ref={(el) => {
                els.current[i] = el;
              }}
              type="button"
              disabled={phase !== "answer"}
              onClick={() => pick(i)}
              aria-label={`Dot ${i + 1}`}
              className={cn(
                "focus-visible:ring-primary absolute size-5 -translate-x-1/2 -translate-y-1/2 rounded-full transition-[background-color,box-shadow] duration-300 focus-visible:ring-2 focus-visible:outline-none",
                phase === "answer" &&
                  "hover:ring-primary/60 cursor-pointer hover:ring-2",
                isRevealed
                  ? "bg-primary ring-primary/30 ring-4"
                  : "bg-foreground/70",
                phase === "answer" && isSelected && "ring-primary ring-2",
                phase === "result" &&
                  isSelected &&
                  !targets.includes(i) &&
                  "bg-destructive",
              )}
              style={{ left: "50%", top: "50%" }}
            />
          );
        })}

        {celebrate && (
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
                  backgroundColor: c.color,
                  ["--dx" as string]: c.dx,
                  ["--dy" as string]: c.dy,
                  animation: `stroop-pop ${c.dur}ms ease-out forwards`,
                }}
              />
            ))}
          </div>
        )}

        {phase === "idle" && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/30">
            <button
              type="button"
              onClick={start}
              className="bg-primary text-primary-foreground rounded-full px-5 py-2.5 text-sm font-semibold transition-transform hover:-translate-y-0.5"
            >
              Track the dots
            </button>
          </div>
        )}
      </div>

      {phase === "result" && (
        <div className="mt-4 flex justify-end">
          <button
            type="button"
            onClick={start}
            className="border-border/60 hover:border-primary/40 rounded-full border px-4 py-2 text-sm font-medium transition-colors"
          >
            Play again
          </button>
        </div>
      )}
    </div>
  );
}
