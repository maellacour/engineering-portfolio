"use client";

import { useState } from "react";
import {
  Ruler,
  Cog,
  Brain,
  Server,
  Sparkles,
  Award,
  ArrowRight,
} from "lucide-react";
import { UnityIcon } from "@/components/icons";
import { cn } from "@/lib/utils";

// Draft content (from CONTEXT) — a "what I learned & picked up" thread meant to
// complement the prose About, not repeat it. Labels describe the skill, not the
// institution (that lives in the blurb). Editable later.
type Stop = {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  blurb: string;
  tags: string[];
  milestone?: string;
  links?: { label: string; href: string }[];
};

const STOPS: Stop[] = [
  {
    label: "Math & geometry",
    icon: Ruler,
    blurb:
      "Two years of classe préparatoire (PT) — physics and technology, and a lot of math and geometry. The groundwork everything else sits on.",
    tags: ["Mathematics", "Geometry", "Physics"],
  },
  {
    label: "Engineering",
    icon: Cog,
    blurb:
      "Grande École engineering at Arts et Métiers (ENSAM) — learning to build with rigor. My student work on a 3D platform for Airbus won an Award for Excellence.",
    tags: ["Engineering", "3D", "Aerospace"],
  },
  {
    label: "Cognitive science",
    icon: Brain,
    blurb:
      "An internship at xCIT, a cognitive-science lab in Luxembourg — my first taste of research, and where the pull toward the brain began.",
    tags: ["Cognition", "Research", "Experiments"],
    // links: [{ label: "Paper", href: "…" }],  // add when you have them
  },
  {
    label: "Unity · XR",
    icon: UnityIcon,
    blurb:
      "At the Fondation Campus Biotech Geneva since 2020: research games and VR tools in Unity — custom HLSL shaders, headset UX, and experiment tooling.",
    tags: ["Unity", "C#", "HLSL", "VR", "Research"],
    milestone: "Unity Certified Expert — Programmer",
  },
  {
    label: "Backend",
    icon: Server,
    blurb:
      "The layer that keeps studies running — backends, data pipelines, cloud, and CI/CD.",
    tags: ["Laravel", "PostgreSQL", "Azure", "CI/CD", "Docker"],
  },
  {
    label: "AI",
    icon: Sparkles,
    blurb:
      "Lately, putting AI to work across the stack — code agents, a transcription-to-notes pipeline my team lives on, and going deeper on ML.",
    tags: ["Claude Code", "Whisper", "Fine-tuning", "Speech models"],
  },
];

const STEP = 100 / STOPS.length;
const HALF = STEP / 2;

export function JourneyMap() {
  const [active, setActive] = useState(STOPS.length - 1);
  const stop = STOPS[active]!;

  return (
    <div className="border-border/60 rounded-2xl border bg-white/[0.02] p-6 backdrop-blur sm:p-8">
      <p className="text-primary font-mono text-xs tracking-wider uppercase">
        How I got here
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
        {/* the line continues into the future */}
        <div
          aria-hidden
          className="absolute top-[14px] right-0 flex h-4 items-center"
          style={{ left: `${100 - HALF}%` }}
        >
          <span className="border-border/60 h-0 flex-1 border-t border-dashed" />
          <ArrowRight className="text-muted-foreground/60 ml-1 size-4 shrink-0" />
        </div>

        {STOPS.map((s, i) => {
          const Icon = s.icon;
          const isActive = active === i;
          const traveled = i <= active;
          return (
            <button
              key={s.label}
              type="button"
              onClick={() => setActive(i)}
              aria-pressed={isActive}
              aria-label={s.label}
              className="group relative z-10 flex flex-1 flex-col items-center gap-2 px-0.5"
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
                  "text-center font-mono text-[0.58rem] leading-tight tracking-wide uppercase",
                  isActive ? "text-foreground" : "text-muted-foreground",
                )}
              >
                {s.label}
              </span>
            </button>
          );
        })}
      </div>

      <div
        className="border-border/60 bg-background/40 mt-6 rounded-xl border p-4"
        aria-live="polite"
      >
        <h4 className="font-display font-semibold">{stop.label}</h4>
        <p className="text-muted-foreground mt-1 text-sm text-pretty">
          {stop.blurb}
        </p>

        <div className="mt-3 flex flex-wrap gap-1.5">
          {stop.tags.map((tag) => (
            <span
              key={tag}
              className="border-border/60 text-muted-foreground rounded-full border px-2.5 py-0.5 font-mono text-[0.65rem]"
            >
              {tag}
            </span>
          ))}
        </div>

        {stop.milestone && (
          <p className="text-primary mt-3 inline-flex items-center gap-1.5 text-xs font-medium">
            <Award className="size-3.5" />
            {stop.milestone}
          </p>
        )}

        {stop.links && stop.links.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1">
            {stop.links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary text-xs underline underline-offset-2"
              >
                {link.label}
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
