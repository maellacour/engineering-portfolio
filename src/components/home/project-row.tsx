"use client";

import { useRef } from "react";
import Link from "next/link";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "motion/react";
import { ArrowRight } from "lucide-react";
import { CldImage } from "@/components/cld";
import { cn } from "@/lib/utils";

type Project = {
  url: string;
  cover: string;
  title: string;
  tag: string;
  description: string;
  status: string;
  publishDate?: number;
  date: number;
};

const EASE = [0.22, 1, 0.36, 1] as const;

export function ProjectRow({
  project,
  index,
}: {
  project: Project;
  index: number;
}) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [24, -24]);

  const flip = index % 2 === 1;

  return (
    <motion.article
      ref={ref}
      initial={
        reduce ? false : { opacity: 0, x: flip ? 52 : -52, filter: "blur(6px)" }
      }
      whileInView={
        reduce ? undefined : { opacity: 1, x: 0, filter: "blur(0px)" }
      }
      viewport={{ once: true, margin: "0px 0px -15% 0px" }}
      transition={{ duration: 0.65, ease: EASE }}
      className="relative grid items-center gap-6 lg:grid-cols-2 lg:gap-14"
    >
      <span
        aria-hidden
        className={cn(
          "font-display text-primary/[0.07] pointer-events-none absolute -top-10 -z-10 text-[7rem] leading-none font-bold select-none sm:text-[9rem]",
          flip ? "right-0" : "left-0",
        )}
      >
        {String(index + 1).padStart(2, "0")}
      </span>

      <Link
        href={project.url}
        className={cn(
          "group border-border/60 focus-visible:ring-ring block overflow-hidden rounded-2xl border focus-visible:ring-2 focus-visible:outline-none",
          flip && "lg:order-last",
        )}
      >
        <motion.div style={{ y }} className="overflow-hidden">
          <CldImage
            src={project.cover}
            alt={project.title}
            width={900}
            height={563}
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="aspect-[16/10] w-full scale-110 object-cover transition-transform duration-700 group-hover:scale-[1.16]"
          />
        </motion.div>
      </Link>

      <div>
        <p className="text-primary font-mono text-xs tracking-wider uppercase">
          {project.tag}{" "}
          <span className="text-muted-foreground">
            · {project.publishDate ?? project.date}
          </span>
        </p>
        <h3 className="font-display mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
          <Link
            href={project.url}
            className="hover:text-primary transition-colors"
          >
            {project.title}
          </Link>
        </h3>
        <p className="text-muted-foreground mt-3 text-pretty">
          {project.description}
        </p>

        {project.status && (
          <div className="border-primary/20 bg-primary/5 mt-5 rounded-lg border px-4 py-3">
            <span className="text-primary font-mono text-[0.65rem] tracking-wider uppercase">
              In use
            </span>
            <div
              className="text-muted-foreground mt-1 text-sm [&>p]:m-0"
              dangerouslySetInnerHTML={{ __html: project.status }}
            />
          </div>
        )}

        <Link
          href={project.url}
          className="group text-primary mt-5 inline-flex items-center gap-1.5 text-sm font-medium"
        >
          View project
          <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>
    </motion.article>
  );
}
