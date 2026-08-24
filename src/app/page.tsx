import { home } from "@velite";

export default function HomePage() {
  return (
    <section className="py-16">
      <h1 className="text-4xl font-bold tracking-tight">{home.hero.title}</h1>
      <p className="text-muted-foreground mt-4">{home.hero.description}</p>
    </section>
  );
}
