"use client";

import { useState } from "react";
import { Brain, Rocket, Server, Sparkles } from "lucide-react";
import { UnityIcon } from "@/components/icons";
import { cn } from "@/lib/utils";

// Draft chapter copy (from CONTEXT) — plain, editable later. The last three are
// facets of the current work at FCBG, not steps away from it.
const STOPS = [
  {
    label: "Cognitive lab",
    icon: Brain,
    blurb:
      "It started in a cognitive-science lab — an internship that gave me my first taste of research.",
  },
  {
    label: "Aerospace",
    icon: Rocket,
    blurb:
      "Then Grande École at Arts et Métiers and a turn through aerospace; my student work even won an Airbus award.",
  },
  {
    label: "Unity · XR",
    icon: UnityIcon,
    blurb:
      "In 2020 I joined the Fondation Campus Biotech Geneva, building research games and VR tools in Unity — engaging enough that participants keep coming back.",
  },
  {
    label: "Backend & DevOps",
    icon: Server,
    blurb:
      "And the layer underneath: backends, data pipelines, CI/CD, cloud — the unglamorous work that keeps multi-site studies running.",
  },
  {
    label: "AI",
    icon: Sparkles,
    blurb:
      "Lately, AI woven across all of it: code agents, a transcription pipeline my team lives on, and training toward fine-tuning speech models.",
  },
];

const STEP = 100 / STOPS.length;
const HALF = STEP / 2;

export function JourneyMap() {
  const [active, setActive] = useState(STOPS.length - 1);

  return (
    <div className="border-border/60 rounded-2xl border bg-white/[0.02] p-6 backdrop-blur sm:p-8">
      <p className="text-primary font-mono text-xs tracking-wider uppercase">
        The path so far
      </p>

      <div className="relative mt-8 flex items-start">
        <div
          aria-hidden
          className="bg-border/60 absolute top-[22px] h-0.5 rounded"
          style={{ left: `${HALF}%`, right: `${HALF}%` }}
        />
        <div
          aria-hidden
          className="bg-primary absolute top-[22px] h-0.5 rounded transition-[width] duration-500"
          style={{ left: `${HALF}%`, width: `${active * STEP}%` }}
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
              className="group relative z-10 flex flex-1 flex-col items-center gap-2 px-1"
            >
              <span
                className={cn(
                  "flex size-11 items-center justify-center rounded-full border transition-all duration-300",
                  isActive
                    ? "border-primary bg-primary text-primary-foreground scale-110"
                    : traveled
                      ? "border-primary/50 bg-primary/10 text-primary"
                      : "border-border/60 bg-card text-muted-foreground group-hover:border-primary/50",
                )}
              >
                <Icon className="size-5" />
              </span>
              <span
                className={cn(
                  "text-center font-mono text-[0.6rem] leading-tight tracking-wide uppercase",
                  isActive ? "text-foreground" : "text-muted-foreground",
                )}
              >
                {stop.label}
              </span>
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
