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
import { journey } from "@velite";
import { UnityIcon } from "@/components/icons";
import { cn } from "@/lib/utils";

const ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  ruler: Ruler,
  cog: Cog,
  brain: Brain,
  unity: UnityIcon,
  server: Server,
  sparkles: Sparkles,
};

const { eyebrow, stops } = journey;
const STEP = 100 / stops.length;
const HALF = STEP / 2;

export function JourneyMap() {
  const [active, setActive] = useState(stops.length - 1);
  const stop = stops[active]!;

  return (
    <div className="border-border/60 rounded-2xl border bg-white/[0.02] p-6 backdrop-blur sm:p-8">
      <p className="text-primary font-mono text-xs tracking-wider uppercase">
        {eyebrow}
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

        {stops.map((s, i) => {
          const Icon = ICONS[s.icon] ?? Sparkles;
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
        <p className="text-muted-foreground mt-1 text-justify text-sm text-pretty hyphens-auto">
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

        {stop.links.length > 0 && (
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
