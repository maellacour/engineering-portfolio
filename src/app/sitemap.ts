import type { MetadataRoute } from "next";
import { projects, notes } from "@velite";

const base = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = ["", "/notes"].map((path) => ({
    url: `${base}${path}`,
  }));

  const projectRoutes = projects.map((project) => ({
    url: `${base}${project.url}`,
    lastModified: new Date(`${project.publishDate ?? project.date}-01-01`),
  }));

  const noteRoutes = notes
    .filter((note) => !note.draft)
    .map((note) => ({
      url: `${base}${note.url}`,
      lastModified: new Date(note.date),
    }));

  return [...staticRoutes, ...projectRoutes, ...noteRoutes];
}
