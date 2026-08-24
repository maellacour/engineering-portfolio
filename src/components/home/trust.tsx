import {
  GraduationCap,
  Heart,
  Library,
  Plane,
  type LucideIcon,
} from "lucide-react";
import { trust } from "@velite";
import { UnityIcon } from "@/components/icons";

const icons: Record<string, LucideIcon | typeof UnityIcon> = {
  "graduation-cap": GraduationCap,
  library: Library,
  heart: Heart,
  plane: Plane,
  unity: UnityIcon,
};

export function Trust() {
  return (
    <section
      id="trust"
      className="scroll-mt-24 py-16 sm:py-20"
      aria-labelledby="trust-heading"
    >
      <div className="max-w-2xl">
        <h2
          id="trust-heading"
          className="text-3xl font-bold tracking-tight sm:text-4xl"
        >
          {trust.title}
        </h2>
        <p className="text-muted-foreground mt-3 text-pretty">
          {trust.description}
        </p>
      </div>

      <ul className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {trust.items.map((item) => {
          const Icon = icons[item.icon] ?? GraduationCap;
          return (
            <li
              key={item.name}
              className="border-border/60 bg-card flex items-start gap-4 rounded-xl border p-5"
            >
              <span className="bg-primary/10 flex size-10 shrink-0 items-center justify-center rounded-lg">
                <Icon className="text-primary size-5" />
              </span>
              <div>
                <p className="font-semibold">{item.name}</p>
                <p className="text-muted-foreground mt-0.5 text-sm">
                  {item.tagline}
                </p>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
