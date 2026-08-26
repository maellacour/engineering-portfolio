"use client";

import { useState } from "react";
import { Music } from "lucide-react";
import { CldImage } from "@/components/cld";
import { cn } from "@/lib/utils";

// An original, waltz-lilt piano flourish (not the recording) — synthesised with
// Web Audio, so there's no audio file to ship or license.
const MELODY: { f: number; d: number }[] = [
  { f: 659.25, d: 0.34 }, // E5
  { f: 783.99, d: 0.17 }, // G5
  { f: 1046.5, d: 0.17 }, // C6
  { f: 987.77, d: 0.34 }, // B5
  { f: 880.0, d: 0.17 }, // A5
  { f: 783.99, d: 0.17 }, // G5
  { f: 880.0, d: 0.34 }, // A5
  { f: 698.46, d: 0.17 }, // F5
  { f: 880.0, d: 0.17 }, // A5
  { f: 783.99, d: 0.34 }, // G5
  { f: 659.25, d: 0.17 }, // E5
  { f: 523.25, d: 0.17 }, // C5
  { f: 587.33, d: 0.34 }, // D5
  { f: 698.46, d: 0.17 }, // F5
  { f: 659.25, d: 0.17 }, // E5
  { f: 523.25, d: 0.6 }, // C5
];

const REVEAL_MS =
  MELODY.reduce((total, note) => total + note.d, 0) * 1000 + 400;

function playNote(ctx: AudioContext, freq: number, at: number, dur: number) {
  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0.0001, at);
  gain.gain.exponentialRampToValueAtTime(0.2, at + 0.012);
  gain.gain.exponentialRampToValueAtTime(0.0001, at + dur);
  gain.connect(ctx.destination);

  // triangle body + a soft sub-octave sine for warmth
  const tone = ctx.createOscillator();
  tone.type = "triangle";
  tone.frequency.value = freq;
  tone.connect(gain);
  tone.start(at);
  tone.stop(at + dur + 0.05);

  const sub = ctx.createGain();
  sub.gain.value = 0.5;
  sub.connect(gain);
  const body = ctx.createOscillator();
  body.type = "sine";
  body.frequency.value = freq / 2;
  body.connect(sub);
  body.start(at);
  body.stop(at + dur + 0.05);
}

export function AboutPortrait({ src, alt }: { src: string; alt: string }) {
  const [playing, setPlaying] = useState(false);
  const [revealed, setRevealed] = useState(false);

  const play = () => {
    try {
      const ctx = new AudioContext();
      let t = ctx.currentTime + 0.03;
      for (const n of MELODY) {
        playNote(ctx, n.f, t, n.d);
        t += n.d;
      }
      setTimeout(() => void ctx.close(), (t - ctx.currentTime + 0.4) * 1000);
    } catch {
      // no Web Audio — the visual + caption reveal still fire
    }
    setPlaying(false);
    requestAnimationFrame(() => setPlaying(true));
    setTimeout(() => setPlaying(false), 1000);
    setRevealed(true);
    setTimeout(() => setRevealed(false), REVEAL_MS);
  };

  return (
    <div>
      <button
        type="button"
        onClick={play}
        aria-label="Play a little tune"
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

      <p
        className={cn(
          "mt-3 text-center font-mono text-xs transition-colors",
          revealed ? "text-primary" : "text-muted-foreground",
        )}
      >
        {revealed ? "Il jouait du piano debout 🎵🎶" : alt}
      </p>
    </div>
  );
}
