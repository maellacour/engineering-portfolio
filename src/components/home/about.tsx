import { home } from "@velite";
import { Reveal } from "@/components/reveal";
import { AboutPortrait } from "./about-portrait";
import { AttentionGame } from "./attention-game";

export function About() {
  const { about } = home;
  return (
    <section
      id="about"
      className="scroll-mt-24 py-20 sm:py-28"
      aria-labelledby="about-heading"
    >
      <div className="grid items-start gap-12 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-16">
        <Reveal className="lg:sticky lg:top-28">
          <div className="relative mx-auto w-56 sm:w-64 lg:w-full lg:max-w-xs">
            <div
              aria-hidden
              className="bg-primary/25 absolute -inset-6 -z-10 rounded-full blur-3xl"
            />
            <AboutPortrait src={about.image.src} alt={about.image.alt} />
            <p className="text-muted-foreground mt-3 text-center font-mono text-xs">
              {about.image.alt}
            </p>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <h2
            id="about-heading"
            className="text-primary font-mono text-xs tracking-[0.2em] uppercase"
          >
            {about.title}
          </h2>
          <div className="border-primary/30 mt-6 border-l-2 pl-6 sm:pl-8">
            <div
              className="prose prose-lg prose-zinc dark:prose-invert [&>p:first-of-type]:text-foreground max-w-none [&>p:first-of-type]:text-xl"
              dangerouslySetInnerHTML={{ __html: about.body }}
            />
          </div>
        </Reveal>
      </div>

      <Reveal className="mt-14">
        <AttentionGame />
      </Reveal>
    </section>
  );
}
