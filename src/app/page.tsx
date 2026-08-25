import type { Metadata } from "next";
import { home } from "@velite";
import { Hero } from "@/components/home/hero";
import { WhatIBuild } from "@/components/home/what-i-build";
import { Projects } from "@/components/home/projects";
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
      <WhatIBuild />
      <Projects />
      <About />
      <Contact />
    </>
  );
}
