import { Hero } from "@/components/home/hero";
import { Projects } from "@/components/home/projects";
import { Trust } from "@/components/home/trust";
import { About } from "@/components/home/about";
import { Contact } from "@/components/home/contact";

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
