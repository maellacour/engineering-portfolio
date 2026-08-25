import { CldImage } from "@/components/cld";
import { home } from "@velite";
import { Reveal } from "@/components/reveal";

export function About() {
  const { about } = home;
  return (
    <section
      id="about"
      className="scroll-mt-24 py-16 sm:py-20"
      aria-labelledby="about-heading"
    >
      <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
        <Reveal>
          <h2
            id="about-heading"
            className="font-display text-3xl font-bold tracking-tight sm:text-4xl"
          >
            {about.title}
          </h2>
          <div
            className="prose prose-lg prose-zinc dark:prose-invert mt-6 max-w-none"
            dangerouslySetInnerHTML={{ __html: about.body }}
          />
        </Reveal>
        <Reveal delay={0.1}>
          <CldImage
            src={about.image.src}
            alt={about.image.alt}
            width={1024}
            height={1024}
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="ring-border/60 aspect-square w-full rounded-2xl object-cover shadow-lg ring-1"
          />
        </Reveal>
      </div>
    </section>
  );
}
