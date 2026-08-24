"use client";

import { CldImage } from "@/components/cld";
import { motion, useReducedMotion } from "motion/react";
import { Download } from "lucide-react";
import { home, site } from "@velite";
import { buttonVariants } from "@/components/ui/button";
import { GithubIcon, LinkedinIcon } from "@/components/icons";

const socialIcons = { linkedin: LinkedinIcon, github: GithubIcon } as const;

export function Hero() {
  const reduce = useReducedMotion();
  const { hero } = home;
  const { availability, socials } = site;

  // Entrance animation, disabled under prefers-reduced-motion.
  const rise = (delay: number) =>
    reduce
      ? {}
      : {
          initial: { opacity: 0, y: 14, filter: "blur(8px)" },
          animate: { opacity: 1, y: 0, filter: "blur(0px)" },
          transition: { duration: 0.6, delay },
        };

  return (
    <section className="grid items-center gap-8 py-12 sm:py-16 lg:grid-cols-[1fr_auto] lg:gap-16">
      {/* Portrait — first on mobile, right on desktop. The one bold element. */}
      <motion.div
        {...(reduce
          ? {}
          : {
              initial: { opacity: 0, scale: 1.04, filter: "blur(12px)" },
              animate: { opacity: 1, scale: 1, filter: "blur(0px)" },
              transition: { duration: 0.7, delay: 0.1 },
            })}
        className="relative mx-auto w-56 shrink-0 sm:w-72 lg:order-last lg:mx-0"
      >
        <div
          aria-hidden
          className="bg-primary/25 absolute -inset-4 -z-10 rounded-full blur-3xl"
        />
        <CldImage
          src={hero.image.src}
          alt={hero.image.alt}
          width={640}
          height={640}
          sizes="(max-width: 1024px) 18rem, 18rem"
          className="ring-border/60 aspect-square w-full rounded-3xl object-cover shadow-2xl ring-1"
          priority
        />
      </motion.div>

      <div className="text-center lg:text-left">
        <motion.h1
          {...rise(0.1)}
          className="text-4xl font-bold tracking-tight text-balance sm:text-5xl"
        >
          {hero.title}
        </motion.h1>

        <motion.p
          {...rise(0.25)}
          className="text-muted-foreground mt-4 max-w-xl text-lg text-pretty"
        >
          {hero.description}
        </motion.p>

        <motion.div
          {...rise(0.4)}
          className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:flex-wrap lg:items-start"
        >
          <div className="flex flex-wrap items-center justify-center gap-3">
            <a
              href={hero.cta.href}
              target="_blank"
              rel="noopener noreferrer"
              className={buttonVariants({ size: "lg" })}
            >
              <Download className="size-4" />
              {hero.cta.label}
            </a>

            {availability.available && (
              <span className="text-muted-foreground inline-flex items-center gap-2 text-sm">
                <span className="relative flex size-2">
                  <span className="bg-primary absolute inline-flex size-full animate-ping rounded-full opacity-75" />
                  <span className="bg-primary relative inline-flex size-2 rounded-full" />
                </span>
                {availability.availableLabel}
              </span>
            )}
          </div>

          <div className="flex items-center gap-1">
            {socials.map((social) => {
              const Icon = socialIcons[social.icon];
              return (
                <a
                  key={social.href}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="text-muted-foreground hover:text-foreground hover:bg-muted focus-visible:ring-ring rounded-full p-2 transition-colors focus-visible:ring-2 focus-visible:outline-none"
                >
                  <Icon className="size-4" />
                </a>
              );
            })}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
