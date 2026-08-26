"use client";

import { CldImage } from "@/components/cld";
import { motion, useReducedMotion } from "motion/react";
import { ArrowDown } from "lucide-react";
import { home, site } from "@velite";
import { buttonVariants } from "@/components/ui/button";
import { GithubIcon, LinkedinIcon } from "@/components/icons";

const socialIcons = { linkedin: LinkedinIcon, github: GithubIcon } as const;

export function Hero() {
  const reduce = useReducedMotion();
  const { hero } = home;
  const { socials } = site;

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
        </div>
      </motion.div>

      {/* Text */}
      <div className="order-2 flex flex-col items-start lg:order-1">
        <motion.p
          {...rise(0)}
          className="font-display mb-4 text-lg font-semibold tracking-tight sm:text-xl"
        >
          Maël Lacour
        </motion.p>

        <motion.h1
          {...rise(0.1)}
          className="font-display text-foreground text-4xl leading-[1.05] font-bold tracking-tight text-balance sm:text-5xl lg:text-6xl"
        >
          {hero.title}
        </motion.h1>

        <motion.p
          {...rise(0.25)}
          className="text-muted-foreground mt-6 max-w-lg text-xl leading-relaxed text-pretty"
        >
          {hero.description}
        </motion.p>

        <motion.div
          {...rise(0.4)}
          className="mt-8 flex flex-wrap items-center gap-3"
        >
          {hero.links.map((link, i) => (
            <a
              key={link.href}
              href={link.href}
              className={buttonVariants({
                variant: i === 0 ? "default" : "outline",
                size: "lg",
              })}
            >
              {link.label}
            </a>
          ))}
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
