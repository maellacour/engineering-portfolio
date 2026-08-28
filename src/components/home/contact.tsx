import { Mail } from "lucide-react";
import { home, site } from "@velite";
import { GithubIcon, LinkedinIcon } from "@/components/icons";
import { Reveal } from "@/components/reveal";
import { ContactForm } from "./contact-form";

const socialIcons = { linkedin: LinkedinIcon, github: GithubIcon } as const;

export function Contact() {
  const { contact } = home;
  return (
    <section
      id="contact"
      className="scroll-mt-24 py-20 sm:py-28"
      aria-labelledby="contact-heading"
    >
      <Reveal>
        <div className="border-border/60 relative overflow-hidden rounded-3xl border bg-white/[0.02] p-8 backdrop-blur sm:p-12">
          <div
            aria-hidden
            className="bg-primary/20 absolute -top-24 -right-16 -z-10 size-72 rounded-full blur-3xl"
          />
          <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
            <div>
              <span className="text-primary font-mono text-xs tracking-[0.2em] uppercase">
                Contact
              </span>
              <h2
                id="contact-heading"
                className="font-display mt-3 text-3xl font-bold tracking-tight sm:text-4xl"
              >
                {contact.title}
              </h2>
              <div
                className="prose prose-zinc dark:prose-invert mt-4 max-w-none text-justify hyphens-auto"
                dangerouslySetInnerHTML={{ __html: contact.body }}
              />

              <div className="border-border/60 mt-8 border-t pt-6">
                <p className="text-muted-foreground mb-3 text-sm">
                  Prefer email or socials?
                </p>
                <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
                  <a
                    href={`mailto:${site.email}`}
                    className="hover:text-primary inline-flex items-center gap-2 text-sm font-medium transition-colors"
                  >
                    <Mail className="size-4" />
                    {site.email}
                  </a>
                  <div className="flex items-center gap-1">
                    {site.socials.map((social) => {
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
                </div>
              </div>
            </div>

            <ContactForm />
          </div>
        </div>
      </Reveal>
    </section>
  );
}
