import { CldImage } from "@/components/cld";
import { Mail } from "lucide-react";
import { home, site } from "@velite";
import { GithubIcon, LinkedinIcon } from "@/components/icons";

const socialIcons = { linkedin: LinkedinIcon, github: GithubIcon } as const;

export function Contact() {
  const { contact } = home;
  return (
    <section
      id="contact"
      className="scroll-mt-24 py-16 sm:py-20"
      aria-labelledby="contact-heading"
    >
      <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
        <CldImage
          src={contact.image.src}
          alt={contact.image.alt}
          width={1000}
          height={750}
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="ring-border/60 aspect-[4/3] w-full rounded-2xl object-cover shadow-lg ring-1"
        />
        <div>
          <h2
            id="contact-heading"
            className="font-display text-3xl font-bold tracking-tight sm:text-4xl"
          >
            {contact.title}
          </h2>
          <div
            className="prose prose-zinc dark:prose-invert mt-6 max-w-none"
            dangerouslySetInnerHTML={{ __html: contact.body }}
          />
          <div className="mt-8 space-y-4">
            <a
              href={`mailto:${site.email}`}
              className="hover:text-primary inline-flex items-center gap-2 font-medium transition-colors"
            >
              <Mail className="size-5" />
              {site.email}
            </a>
            <div className="flex items-center gap-2">
              {site.socials.map((social) => {
                const Icon = socialIcons[social.icon];
                return (
                  <a
                    key={social.href}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    className="border-border/60 hover:bg-muted focus-visible:ring-ring inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:outline-none"
                  >
                    <Icon className="size-4" />
                    {social.label}
                  </a>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
