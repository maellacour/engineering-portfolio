"use client";

import { useState } from "react";
import { Music } from "lucide-react";
import { CldImage } from "@/components/cld";
import { cn } from "@/lib/utils";
import { playTune, TUNE_MS } from "@/lib/piano";

export function AboutPortrait({ src, alt }: { src: string; alt: string }) {
  const [playing, setPlaying] = useState(false);
  const [revealed, setRevealed] = useState(false);

  const play = () => {
    playTune();
    setPlaying(false);
    requestAnimationFrame(() => setPlaying(true));
    setTimeout(() => setPlaying(false), 1000);
    setRevealed(true);
    setTimeout(() => setRevealed(false), TUNE_MS);
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

      {revealed && (
        <p
          className="text-primary mt-3 text-center font-mono text-xs"
          aria-live="polite"
        >
          Il jouait du piano debout 🎵🎶
        </p>
      )}
    </div>
  );
}
