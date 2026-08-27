import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { CldImage } from "@/components/cld";
import { cn } from "@/lib/utils";

type NavProject = { url: string; cover: string; title: string };

export function ProjectNav({
  prev,
  next,
}: {
  prev: NavProject;
  next: NavProject;
}) {
  return (
    <nav className="border-border/60 mt-20 grid gap-4 border-t pt-10 sm:grid-cols-2">
      <NavCard project={prev} direction="prev" />
      <NavCard project={next} direction="next" />
    </nav>
  );
}

function NavCard({
  project,
  direction,
}: {
  project: NavProject;
  direction: "prev" | "next";
}) {
  const isNext = direction === "next";
  return (
    <Link
      href={project.url}
      className={cn(
        "group border-border/60 hover:border-primary/40 flex items-center gap-4 rounded-2xl border p-4 transition-colors",
        isNext && "sm:flex-row-reverse sm:text-right",
      )}
    >
      <div className="size-16 shrink-0 overflow-hidden rounded-lg">
        <CldImage
          src={project.cover}
          alt={project.title}
          width={128}
          height={128}
          className="h-full w-full object-cover"
        />
      </div>
      <div className="min-w-0">
        <span
          className={cn(
            "text-muted-foreground flex items-center gap-1 font-mono text-[0.65rem] tracking-wider uppercase",
            isNext && "sm:justify-end",
          )}
        >
          {isNext ? (
            <>
              Next project <ArrowRight className="size-3.5" />
            </>
          ) : (
            <>
              <ArrowLeft className="size-3.5" /> Previous project
            </>
          )}
        </span>
        <p className="font-display group-hover:text-primary mt-1 truncate font-semibold tracking-tight transition-colors">
          {project.title}
        </p>
      </div>
    </Link>
  );
}
