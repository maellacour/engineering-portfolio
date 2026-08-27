"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

const DOT_COUNT = 7;
const TARGET_COUNT = 2;
const MARGIN = 9; // keep dots inside the circle (percent)
const R = 50 - MARGIN; // arena radius in percent
const SHOW_MS = 1600;
const MOVE_MS = 4200;
const SHOW_SPEED = 0.4; // slower drift while the targets are revealed
const BASE_SPEED = 0.6;

type Phase = "idle" | "show" | "move" | "answer" | "result";
type Dot = { x: number; y: number; vx: number; vy: number };

function pickTargets() {
  const idx = [...Array(DOT_COUNT).keys()];
  for (let i = idx.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [idx[i], idx[j]] = [idx[j], idx[i]];
  }
  return idx.slice(0, TARGET_COUNT);
}

export function AttentionGame() {
  const reduce = useReducedMotion();
  const [phase, setPhase] = useState<Phase>("idle");
  const [targets, setTargets] = useState<number[]>([]);
  const [picked, setPicked] = useState<number[]>([]);

  const dots = useRef<Dot[]>([]);
  const els = useRef<(HTMLButtonElement | null)[]>([]);
  const raf = useRef(0);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const paint = useCallback(() => {
    dots.current.forEach((d, i) => {
      const el = els.current[i];
      if (el) {
        el.style.left = `${d.x}%`;
        el.style.top = `${d.y}%`;
      }
    });
  }, []);

  const seed = useCallback(() => {
    dots.current = Array.from({ length: DOT_COUNT }, () => {
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
  }, [paint]);

  useEffect(() => {
    seed();
    return () => {
      clearTimeout(timer.current);
      cancelAnimationFrame(raf.current);
    };
  }, [seed]);

  const start = () => {
    setPicked([]);
    seed();
    setTargets(pickTargets());
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
    if (next.length === TARGET_COUNT) setPhase("result");
  };

  const revealTargets = phase === "show" || phase === "result";
  const won =
    phase === "result" &&
    picked.length === TARGET_COUNT &&
    picked.every((p) => targets.includes(p));

  if (reduce) {
    return (
      <div className="border-border/60 rounded-2xl border bg-white/[0.02] p-6 backdrop-blur">
        <p className="text-primary font-mono text-xs tracking-wider uppercase">
          A tiny experiment
        </p>
        <p className="text-muted-foreground mt-2 text-sm">
          I build attention-tracking tasks (like multiple-object tracking) for
          cognitive-science studies. See{" "}
          <Link href="/projects/ecorescue" className="text-primary underline">
            EcoRescue
          </Link>
          .
        </p>
      </div>
    );
  }

  const prompt =
    phase === "idle"
      ? "Keep your eye on the two highlighted dots."
      : phase === "show"
        ? "Memorise them…"
        : phase === "move"
          ? "Track them…"
          : phase === "answer"
            ? `Which two? (${picked.length}/2)`
            : won
              ? "Nailed it."
              : "Not quite. Harder than it looks.";

  return (
    <div className="border-border/60 rounded-2xl border bg-white/[0.02] p-5 backdrop-blur sm:p-6">
      <div className="flex items-center justify-between gap-4">
        <p className="text-primary font-mono text-xs tracking-wider uppercase">
          A tiny experiment
        </p>
        <p className="text-muted-foreground text-sm" aria-live="polite">
          {prompt}
        </p>
      </div>

      <div className="border-border/60 bg-background/40 relative mx-auto mt-4 aspect-square w-full max-w-sm overflow-hidden rounded-full border">
        {Array.from({ length: DOT_COUNT }).map((_, i) => {
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
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
          <p className="text-muted-foreground text-sm">
            That&apos;s a multiple-object-tracking task, the kind I build for{" "}
            <Link href="/projects/ecorescue" className="text-primary underline">
              cognitive-science studies
            </Link>
            .
          </p>
          <button
            type="button"
            onClick={start}
            className="border-border/60 hover:border-primary/40 shrink-0 rounded-full border px-4 py-2 text-sm font-medium transition-colors"
          >
            Play again
          </button>
        </div>
      )}
    </div>
  );
}
