import type { Metadata } from "next";
import { home } from "@velite";
import { Hero } from "@/components/home/hero";
import { Projects } from "@/components/home/projects";
import { Trust } from "@/components/home/trust";
import { About } from "@/components/home/about";
import { Contact } from "@/components/home/contact";

export const metadata: Metadata = {
  title: { absolute: home.title },
  description: home.description,
  openGraph: { title: home.title, description: home.description },
};

export default function HomePage() {
  return (
    <>
      <Hero />
      <Projects />
      <Trust />
      <About />
      <Contact />
    </>
  );
}
