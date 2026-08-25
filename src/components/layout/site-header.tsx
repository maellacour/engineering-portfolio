import Link from "next/link";
import { site } from "@velite";
import { ThemeToggle } from "./theme-toggle";

export function SiteHeader() {
  return (
    <header className="fixed top-2 left-1/2 z-50 -translate-x-1/2 sm:top-4">
      <nav
        aria-label="Primary"
        className="border-border/60 bg-background/70 flex items-center gap-1 rounded-full border py-1 pr-1 pl-2 shadow-lg shadow-black/5 backdrop-blur-md"
      >
        {site.nav.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="text-muted-foreground hover:text-foreground hover:bg-muted focus-visible:ring-ring rounded-full px-3 py-1.5 text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:outline-none"
          >
            {item.label}
          </Link>
        ))}
        <ThemeToggle />
      </nav>
    </header>
  );
}
