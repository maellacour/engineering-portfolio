import { defineConfig, defineCollection, s } from "velite";
import remarkBreaks from "remark-breaks";

// A media slot: a Cloudinary public ID plus optional alt text.
// `type` lets a gallery mix screenshots, GIFs and short videos.
const media = s.object({
  type: s.enum(["image", "video"]).default("image"),
  src: s.string(),
  alt: s.string(),
});

const site = defineCollection({
  name: "Site",
  pattern: "site.yml",
  single: true,
  schema: s.object({
    email: s.string(),
    resumeUrl: s.string(),
    socials: s.array(
      s.object({
        label: s.string(),
        href: s.string(),
        icon: s.enum(["linkedin", "github"]),
      }),
    ),
    nav: s.array(s.object({ label: s.string(), href: s.string() })),
    footer: s.object({ credits: s.string() }),
  }),
});

const home = defineCollection({
  name: "Home",
  pattern: "home.yml",
  single: true,
  schema: s.object({
    // Meta / SEO
    title: s.string(),
    description: s.string(),
    ogImage: s.string(),
    hero: s.object({
      title: s.string(),
      description: s.string(),
      image: media,
      links: s.array(s.object({ label: s.string(), href: s.string() })),
    }),
    build: s.object({
      title: s.string(),
      intro: s.string().optional(),
      items: s.array(s.object({ title: s.string(), body: s.string() })),
    }),
    projects: s.object({
      title: s.string(),
      description: s.string().optional(),
    }),
    about: s.object({
      title: s.string(),
      body: s.markdown(),
      image: media,
    }),
    contact: s.object({
      title: s.string(),
      body: s.markdown(),
      image: media,
    }),
  }),
});

const journey = defineCollection({
  name: "Journey",
  pattern: "journey.yml",
  single: true,
  schema: s.object({
    eyebrow: s.string(),
    stops: s.array(
      s.object({
        label: s.string(),
        icon: s.enum(["ruler", "cog", "brain", "unity", "server", "sparkles"]),
        blurb: s.string(),
        tags: s.array(s.string()),
        milestone: s.string().optional(),
        links: s
          .array(s.object({ label: s.string(), href: s.string() }))
          .default([]),
      }),
    ),
  }),
});

const projects = defineCollection({
  name: "Project",
  pattern: "projects/**/*.md",
  schema: s
    .object({
      title: s.string(),
      description: s.string(),
      cover: s.string(), // Cloudinary public ID
      date: s.number(), // year work started
      publishDate: s.number().optional(), // year shipped (preferred for display)
      tag: s.string(),
      featured: s.boolean().default(false),
      order: s.number().default(0),
      gallery: s.array(media).default([]),
      video: media.optional(),
      challengeTitle: s.string().default("Challenge"),
      blocks: s
        .array(s.object({ title: s.string(), body: s.markdown() }))
        .default([]),
      // The free-form narrative lives in the document body. This is also the
      // MDX escape hatch: swap s.markdown() for s.mdx() if a project ever needs
      // custom components inline.
      challenge: s.markdown(),
      // Case-study sections (frontmatter markdown). Default "" so an absent
      // field compiles to empty rather than falling back to the document body.
      status: s.markdown().default(""), // who uses it now / real-world impact
      lessons: s.markdown().default(""), // what you took away
      path: s.path(),
    })
    .transform((data) => {
      const slug = data.path.split("/").pop()!;
      return { ...data, slug, url: `/projects/${slug}` };
    }),
});

const notes = defineCollection({
  name: "Note",
  pattern: "notes/**/*.mdx",
  schema: s
    .object({
      title: s.string(),
      description: s.string().optional(),
      date: s.isodate(),
      draft: s.boolean().default(true),
      content: s.mdx(),
      path: s.path(),
    })
    .transform((data) => {
      const slug = data.path.split("/").pop()!;
      return { ...data, slug, url: `/notes/${slug}` };
    }),
});

export default defineConfig({
  root: "content",
  collections: { site, home, journey, projects, notes },
  markdown: { remarkPlugins: [remarkBreaks] },
});
