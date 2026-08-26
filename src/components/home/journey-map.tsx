"use client";

import { useState } from "react";
import { Rocket, FlaskConical, Building2, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

// Draft chapter copy (from CONTEXT) — plain, editable later.
const STOPS = [
  {
    label: "Aerospace",
    icon: Rocket,
    blurb:
      "Grande École at Arts et Métiers, then aerospace — my student work even picked up an Airbus award.",
  },
  {
    label: "Code meets science",
    icon: FlaskConical,
    blurb:
      "Then I found where I do my best work: the seam between software and science.",
  },
  {
    label: "Geneva · FCBG",
    icon: Building2,
    blurb:
      "Since 2020, building research software at the Fondation Campus Biotech Geneva — games, VR tools, and the infrastructure behind multi-site studies.",
  },
  {
    label: "AI",
    icon: Sparkles,
    blurb:
      "Now going deeper on AI: code agents, a transcription pipeline my team lives on, and training toward fine-tuning speech models.",
    here: true,
  },
];

export function JourneyMap() {
  const [active, setActive] = useState(STOPS.length - 1);
  // node centres sit at 12.5% + i·25% across the row (flex-1 columns).
  const fill = 12.5 + active * 25;

  return (
    <div className="border-border/60 rounded-2xl border bg-white/[0.02] p-6 backdrop-blur sm:p-8">
      <p className="text-primary font-mono text-xs tracking-wider uppercase">
        The path so far
      </p>

      <div className="relative mt-8 flex items-start">
        {/* track */}
        <div
          aria-hidden
          className="bg-border/60 absolute top-[22px] right-[12.5%] left-[12.5%] h-0.5 rounded"
        />
        <div
          aria-hidden
          className="bg-primary absolute top-[22px] left-[12.5%] h-0.5 rounded transition-[width] duration-500"
          style={{ width: `${fill - 12.5}%` }}
        />

        {STOPS.map((stop, i) => {
          const Icon = stop.icon;
          const isActive = active === i;
          const traveled = i <= active;
          return (
            <button
              key={stop.label}
              type="button"
              onClick={() => setActive(i)}
              aria-pressed={isActive}
              aria-label={stop.label}
              className="group relative z-10 flex flex-1 flex-col items-center gap-2"
            >
              <span
                className={cn(
                  "relative flex size-11 items-center justify-center rounded-full border transition-all duration-300",
                  isActive
                    ? "border-primary bg-primary text-primary-foreground scale-110"
                    : traveled
                      ? "border-primary/50 bg-primary/10 text-primary"
                      : "border-border/60 bg-card text-muted-foreground group-hover:border-primary/50",
                )}
              >
                <Icon className="size-5" />
                {stop.here && !isActive && (
                  <span className="border-primary absolute inset-0 animate-ping rounded-full border motion-reduce:animate-none" />
                )}
              </span>
              <span
                className={cn(
                  "text-center font-mono text-[0.62rem] leading-tight tracking-wider uppercase",
                  isActive ? "text-foreground" : "text-muted-foreground",
                )}
              >
                {stop.label}
              </span>
              {stop.here && (
                <span className="text-primary/70 text-[0.55rem] tracking-wide">
                  you are here
                </span>
              )}
            </button>
          );
        })}
      </div>

      <div
        className="border-border/60 bg-background/40 mt-6 rounded-xl border p-4"
        aria-live="polite"
      >
        <h4 className="font-display font-semibold">{STOPS[active].label}</h4>
        <p className="text-muted-foreground mt-1 text-sm text-pretty">
          {STOPS[active].blurb}
        </p>
      </div>
    </div>
  );
}
