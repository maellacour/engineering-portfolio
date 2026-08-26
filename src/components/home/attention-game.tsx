"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

const DOT_COUNT = 7;
const MARGIN = 9; // keep dots off the edges (percent)
const SHOW_MS = 1300;
const MOVE_MS = 4200;

type Phase = "idle" | "show" | "move" | "answer" | "result";
type Dot = { x: number; y: number; vx: number; vy: number };

const rand = (min: number, max: number) => min + Math.random() * (max - min);

export function AttentionGame() {
  const reduce = useReducedMotion();
  const [phase, setPhase] = useState<Phase>("idle");
  const [target, setTarget] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);

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
    dots.current = Array.from({ length: DOT_COUNT }, () => ({
      x: rand(MARGIN, 100 - MARGIN),
      y: rand(MARGIN, 100 - MARGIN),
      vx: rand(-0.6, 0.6) || 0.4,
      vy: rand(-0.6, 0.6) || 0.4,
    }));
    paint();
  }, [paint]);

  // Spread the dots out on mount so the idle state looks intentional.
  useEffect(() => {
    seed();
    return () => {
      clearTimeout(timer.current);
      cancelAnimationFrame(raf.current);
    };
  }, [seed]);

  const start = () => {
    setPicked(null);
    seed();
    setTarget(Math.floor(Math.random() * DOT_COUNT));
    setPhase("show");
    timer.current = setTimeout(() => setPhase("move"), SHOW_MS);
  };

  // Drive the tracking motion.
  useEffect(() => {
    if (phase !== "move") return;
    let running = true;
    const loop = () => {
      if (!running) return;
      for (const d of dots.current) {
        d.x += d.vx;
        d.y += d.vy;
        if (d.x <= MARGIN) {
          d.x = MARGIN;
          d.vx = Math.abs(d.vx);
        } else if (d.x >= 100 - MARGIN) {
          d.x = 100 - MARGIN;
          d.vx = -Math.abs(d.vx);
        }
        if (d.y <= MARGIN) {
          d.y = MARGIN;
          d.vy = Math.abs(d.vy);
        } else if (d.y >= 100 - MARGIN) {
          d.y = 100 - MARGIN;
          d.vy = -Math.abs(d.vy);
        }
      }
      paint();
      raf.current = requestAnimationFrame(loop);
    };
    raf.current = requestAnimationFrame(loop);
    const stop = setTimeout(() => setPhase("answer"), MOVE_MS);
    return () => {
      running = false;
      cancelAnimationFrame(raf.current);
      clearTimeout(stop);
    };
  }, [phase, paint]);

  const pick = (i: number) => {
    if (phase !== "answer") return;
    setPicked(i);
    setPhase("result");
  };

  const won = phase === "result" && picked === target;
  const revealTarget = phase === "show" || phase === "result";

  // Reduced-motion: no tracking task, just the idea + a way to reach the work.
  if (reduce) {
    return (
      <div className="border-border/60 rounded-2xl border bg-white/[0.02] p-6 backdrop-blur">
        <p className="text-primary font-mono text-xs tracking-wider uppercase">
          A tiny experiment
        </p>
        <p className="text-muted-foreground mt-2 text-sm">
          I build attention-tracking tasks — like multiple-object tracking — for
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
      ? "Keep your eye on the highlighted dot."
      : phase === "show"
        ? "Memorise it…"
        : phase === "move"
          ? "Track it…"
          : phase === "answer"
            ? "Which one was it?"
            : won
              ? "Nailed it."
              : "Not quite — harder than it looks.";

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

      <div className="border-border/60 bg-background/40 relative mt-4 h-60 overflow-hidden rounded-xl border sm:h-72">
        {Array.from({ length: DOT_COUNT }).map((_, i) => (
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
              revealTarget && i === target
                ? "bg-primary ring-primary/30 ring-4"
                : "bg-foreground/70",
              phase === "result" &&
                picked === i &&
                i !== target &&
                "bg-destructive",
            )}
            style={{ left: "50%", top: "50%" }}
          />
        ))}

        {phase === "idle" && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/30">
            <button
              type="button"
              onClick={start}
              className="bg-primary text-primary-foreground rounded-full px-5 py-2.5 text-sm font-semibold transition-transform hover:-translate-y-0.5"
            >
              Track the dot
            </button>
          </div>
        )}
      </div>

      {phase === "result" && (
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
          <p className="text-muted-foreground text-sm">
            That&apos;s a multiple-object-tracking task — the kind I build for{" "}
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
