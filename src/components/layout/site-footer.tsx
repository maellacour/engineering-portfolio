import { site } from "@velite";
import { GithubIcon, LinkedinIcon } from "@/components/icons";

const socialIcons = {
  linkedin: LinkedinIcon,
  github: GithubIcon,
} as const;

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-border/60 mt-24 flex items-center justify-between border-t py-6">
      <p className="text-muted-foreground text-xs">
        © {year} {site.footer.credits}
      </p>
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
    </footer>
  );
}
