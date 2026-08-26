"use client";

import { useState } from "react";
import { Music } from "lucide-react";
import { CldImage } from "@/components/cld";
import { cn } from "@/lib/utils";

// A short, cheerful, self-composed piano flourish (C major) — a playful nod, not
// the recording. Synthesised with Web Audio so there's no audio file to ship.
const MELODY: { f: number; d: number }[] = [
  { f: 523.25, d: 0.16 }, // C5
  { f: 659.25, d: 0.16 }, // E5
  { f: 783.99, d: 0.16 }, // G5
  { f: 880.0, d: 0.22 }, // A5
  { f: 783.99, d: 0.16 }, // G5
  { f: 659.25, d: 0.16 }, // E5
  { f: 587.33, d: 0.16 }, // D5
  { f: 523.25, d: 0.32 }, // C5
];

function playNote(ctx: AudioContext, freq: number, at: number, dur: number) {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = "triangle";
  osc.frequency.value = freq;
  gain.gain.setValueAtTime(0.0001, at);
  gain.gain.exponentialRampToValueAtTime(0.22, at + 0.01);
  gain.gain.exponentialRampToValueAtTime(0.0001, at + dur);
  osc.connect(gain).connect(ctx.destination);
  osc.start(at);
  osc.stop(at + dur + 0.05);
}

export function AboutPortrait({ src, alt }: { src: string; alt: string }) {
  const [playing, setPlaying] = useState(false);

  const play = () => {
    try {
      const ctx = new AudioContext();
      let t = ctx.currentTime + 0.03;
      for (const n of MELODY) {
        playNote(ctx, n.f, t, n.d);
        t += n.d;
      }
      const done = t - ctx.currentTime + 0.4;
      setTimeout(() => void ctx.close(), done * 1000);
    } catch {
      // no Web Audio support — the visual nod still fires
    }
    setPlaying(false);
    requestAnimationFrame(() => setPlaying(true));
    setTimeout(() => setPlaying(false), 1000);
  };

  return (
    <button
      type="button"
      onClick={play}
      aria-label="Play a little tune"
      title="🎹"
      className="group relative block w-full cursor-pointer"
    >
      <CldImage
        src={src}
        alt={alt}
        width={640}
        height={640}
        sizes="(max-width: 1024px) 16rem, 20rem"
        className={cn(
          "ring-border/60 aspect-square w-full rounded-2xl object-cover shadow-2xl ring-1 transition-transform group-active:scale-[0.98]",
          playing &&
            "animate-[portrait-bob_0.6s_ease] motion-reduce:animate-none",
        )}
      />
      {playing && (
        <span className="text-primary pointer-events-none absolute top-2 left-1/2 animate-[note-rise_1s_ease-out_forwards] motion-reduce:hidden">
          <Music className="size-6" />
        </span>
      )}
    </button>
  );
}
