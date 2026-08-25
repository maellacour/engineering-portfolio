"use client";

import { CldImage } from "@/components/cld";
import { motion, useReducedMotion } from "motion/react";
import { Download, ArrowDown } from "lucide-react";
import { home, site } from "@velite";
import { buttonVariants } from "@/components/ui/button";
import { GithubIcon, LinkedinIcon } from "@/components/icons";

const socialIcons = { linkedin: LinkedinIcon, github: GithubIcon } as const;

export function Hero() {
  const reduce = useReducedMotion();
  const { hero } = home;
  const { availability, socials } = site;

  const rise = (delay: number) =>
    reduce
      ? {}
      : {
          initial: { opacity: 0, y: 16, filter: "blur(8px)" },
          animate: { opacity: 1, y: 0, filter: "blur(0px)" },
          transition: { duration: 0.6, delay },
        };

  return (
    <section className="relative grid items-center gap-10 py-8 sm:py-14 lg:grid-cols-[0.82fr_1.18fr] lg:gap-12">
      {/* Portrait — first on mobile, right on desktop */}
      <motion.div
        {...(reduce
          ? {}
          : {
              initial: { opacity: 0, scale: 1.04, filter: "blur(12px)" },
              animate: { opacity: 1, scale: 1, filter: "blur(0px)" },
              transition: { duration: 0.8, delay: 0.1 },
            })}
        className="relative order-1 mx-auto w-64 sm:w-80 lg:order-2 lg:mx-0 lg:w-full lg:max-w-none"
      >
        <div
          aria-hidden
          className="absolute -inset-[18%] animate-[spin_16s_linear_infinite] rounded-full opacity-50 blur-3xl motion-reduce:animate-none"
          style={{
            background:
              "conic-gradient(from 90deg, transparent, var(--primary), transparent 62%)",
          }}
        />
        <div className="border-border/60 relative aspect-[4/5] overflow-hidden rounded-2xl border">
          <CldImage
            src={hero.image.src}
            alt={hero.image.alt}
            width={900}
            height={1125}
            sizes="(max-width: 1024px) 20rem, 40rem"
            className="h-full w-full object-cover"
            priority
          />
          <div
            aria-hidden
            className="bg-primary absolute inset-0 opacity-20 mix-blend-color"
          />
        </div>
      </motion.div>

      {/* Text */}
      <div className="order-2 flex flex-col items-start lg:order-1">
        {availability.available && (
          <motion.span
            {...rise(0)}
            className="border-border/60 mb-6 inline-flex items-center gap-2 rounded-full border bg-white/[0.03] px-3 py-1.5 backdrop-blur"
          >
            <span className="relative flex size-2">
              <span className="bg-primary absolute inline-flex size-full animate-ping rounded-full opacity-75 motion-reduce:animate-none" />
              <span className="bg-primary relative inline-flex size-2 rounded-full" />
            </span>
            <span className="text-muted-foreground font-mono text-xs tracking-wide uppercase">
              {availability.availableLabel}
            </span>
          </motion.span>
        )}

        <motion.h1
          {...rise(0.1)}
          className="font-display from-foreground to-primary bg-gradient-to-br bg-clip-text text-4xl leading-[1.02] font-bold tracking-tight text-balance text-transparent sm:text-5xl lg:text-6xl"
        >
          {hero.title}
        </motion.h1>

        <motion.p
          {...rise(0.25)}
          className="text-muted-foreground mt-5 max-w-md text-lg text-pretty"
        >
          {hero.description}
        </motion.p>

        <motion.div
          {...rise(0.4)}
          className="mt-8 flex flex-wrap items-center gap-3"
        >
          <a
            href={hero.cta.href}
            target="_blank"
            rel="noopener noreferrer"
            className={buttonVariants({ size: "lg" })}
          >
            <Download className="size-4" />
            {hero.cta.label}
          </a>
          <div className="ml-1 flex items-center gap-1">
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

        <a
          href="#projects"
          aria-label="Jump to projects"
          className="text-muted-foreground hover:text-foreground mt-10 hidden items-center gap-2 font-mono text-xs tracking-wide uppercase transition-colors lg:inline-flex"
        >
          <ArrowDown className="size-4 animate-bounce motion-reduce:animate-none" />
          Scroll
        </a>
      </div>
    </section>
  );
}
