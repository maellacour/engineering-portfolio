import type { Metadata } from "next";
import Link from "next/link";
import { Globe, Mail, UserPlus } from "lucide-react";
import { site } from "@velite";
import { CldImage } from "@/components/cld";
import { GithubIcon, LinkedinIcon } from "@/components/icons";
import { buttonVariants } from "@/components/ui/button";
import { CardCapture } from "@/components/card/card-capture";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Contact card",
  description: "Save my details and let's stay in touch.",
  // A utility page for people I've just met, not something to index.
  robots: { index: false, follow: false },
};

export default function CardPage() {
  const { card, email, socials } = site;
  const linkedin = socials.find((s) => s.icon === "linkedin");
  const github = socials.find((s) => s.icon === "github");

  const secondaryLink =
    "text-muted-foreground hover:text-foreground inline-flex items-center gap-2 text-sm font-medium transition-colors focus-visible:ring-ring rounded-md focus-visible:ring-2 focus-visible:outline-none";

  return (
    <section className="mx-auto flex max-w-md flex-col items-center py-8 text-center sm:py-14">
      {/* Portrait with the site's signature halo */}
      <div className="relative w-40 sm:w-48">
        <div
          aria-hidden
          className="absolute -inset-[18%] animate-[spin_16s_linear_infinite] rounded-full opacity-50 blur-3xl motion-reduce:animate-none"
          style={{
            background:
              "conic-gradient(from 90deg, transparent, var(--primary), transparent 62%)",
          }}
        />
        <div className="relative aspect-square overflow-hidden rounded-full">
          <CldImage
            src={card.image}
            alt={card.name}
            width={512}
            height={512}
            sizes="12rem"
            className="h-full w-full object-cover"
            priority
          />
        </div>
      </div>

      <h1 className="font-display mt-6 text-3xl font-bold tracking-tight sm:text-4xl">
        {card.name}
      </h1>
      <p className="text-muted-foreground mt-2 text-base">
        {card.role}
        <span className="block text-sm">{card.org}</span>
      </p>
      <p className="text-primary mt-3 font-mono text-xs tracking-[0.2em] uppercase">
        {card.location}
      </p>
      <p className="text-foreground mt-5 text-lg leading-relaxed text-pretty">
        {card.tagline}
      </p>

      {/* Action 1: frictionless save-to-phone */}
      <a
        href="/card/vcard"
        download
        className={cn(buttonVariants({ size: "lg" }), "mt-8 w-full")}
      >
        <UserPlus className="size-4" />
        Add me to your contacts
      </a>

      {/* The real recontact channel */}
      {linkedin && (
        <a
          href={linkedin.href}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(
            buttonVariants({ variant: "outline", size: "lg" }),
            "mt-3 w-full",
          )}
        >
          <LinkedinIcon className="size-4" />
          Connect on LinkedIn
        </a>
      )}

      {/* Secondary contacts */}
      <div className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-3">
        <a href={`mailto:${email}`} className={secondaryLink}>
          <Mail className="size-4" />
          Email
        </a>
        <Link href="/" className={secondaryLink}>
          <Globe className="size-4" />
          Website
        </Link>
        {github && (
          <a
            href={github.href}
            target="_blank"
            rel="noopener noreferrer"
            className={secondaryLink}
          >
            <GithubIcon className="size-4" />
            GitHub
          </a>
        )}
      </div>

      {/* Reciprocal action: their details, secondary to the CTAs above */}
      <div className="border-border/60 mt-10 w-full rounded-2xl border bg-white/[0.02] p-5 text-left backdrop-blur sm:p-6">
        <h2 className="font-display text-lg font-semibold tracking-tight">
          Want me to follow up?
        </h2>
        <p className="text-muted-foreground mt-1 mb-4 text-sm">
          Leave your details and I&apos;ll reach out.
        </p>
        <CardCapture />
      </div>
    </section>
  );
}
