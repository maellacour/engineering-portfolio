import { home } from "@velite";
import { Reveal, RevealStagger, RevealItem } from "@/components/reveal";

export function WhatIBuild() {
  const { build } = home;
  return (
    <section
      id="build"
      className="scroll-mt-24 py-16 sm:py-24"
      aria-labelledby="build-heading"
    >
      <Reveal>
        <h2
          id="build-heading"
          className="font-display max-w-2xl text-3xl font-bold tracking-tight sm:text-4xl"
        >
          {build.title}
        </h2>
        {build.intro && (
          <p className="text-muted-foreground mt-3 max-w-2xl text-justify text-pretty hyphens-auto">
            {build.intro}
          </p>
        )}
      </Reveal>

      <RevealStagger className="mt-10 grid gap-4 md:grid-cols-3">
        {build.items.map((item, i) => (
          <RevealItem
            key={item.title}
            className="border-border/60 hover:border-primary/40 rounded-2xl border bg-white/[0.02] p-6 backdrop-blur transition-colors"
          >
            <span className="text-primary font-mono text-xs tracking-wider">
              {String(i + 1).padStart(2, "0")}
            </span>
            <h3 className="font-display mt-3 text-xl font-semibold">
              {item.title}
            </h3>
            <p className="text-muted-foreground mt-2 text-justify leading-relaxed hyphens-auto">
              {item.body}
            </p>
          </RevealItem>
        ))}
      </RevealStagger>
    </section>
  );
}
