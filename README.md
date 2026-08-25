# engineering-portfolio

Personal engineering portfolio for Maël Lacour — a Next.js rewrite of the
previous Nuxt 3 site. Content-driven: everything editable lives in
`content/`, validated by [Velite](https://velite.js.org) schemas.

## Stack

- **Next.js 15.5** (App Router) + TypeScript (strict)
- **Tailwind CSS v4** + **shadcn/ui** (primitives only)
- **Velite** — typed markdown/MDX/YAML content layer
- **next-cloudinary** — image & video delivery
- **next-themes** — dark mode (default) · **motion** — animation
- Next **Metadata API** + `next/og` for SEO and social images

## Getting started

```bash
npm install
cp .env.example .env.local   # fill in the Cloudinary cloud name
npm run dev                  # http://localhost:3000
```

### Environment

| Variable | Purpose |
|----------|---------|
| `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` | Cloudinary cloud for images/videos (not secret) |
| `NEXT_PUBLIC_SITE_URL` | Absolute base URL for SEO / OG / sitemap |

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Dev server (runs Velite in watch mode) |
| `npm run build` | Production build (runs Velite first) |
| `npm run start` | Serve the production build |
| `npm run lint` | ESLint |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run format` | Prettier write |

## Editing content

All content is in `content/` — **no code changes needed** to add or edit it.

- `content/site.yml` — email, socials, nav, footer
- `content/home.yml` — hero, "What I build", selected-work heading, about, contact
- `content/projects/*.md` — one file per project (see an existing one for the shape)
- `content/notes/*.mdx` — written pieces (empty for now)

Copy lives directly in the `content/` files; [`CONTEXT.md`](./CONTEXT.md)
captures the background that informs it.

### Adding a project

Create `content/projects/<slug>.md`. The URL is `/projects/<slug>`. Frontmatter
carries the structured fields (cover, tag, gallery, blocks, optional video);
the markdown body is the "Challenge" narrative. Cloudinary public IDs go in
`cover`, `gallery[].src`, and `video.src`.

## Deployment

Deploys to **Vercel** as a static/SSG site. Set both environment variables in
the Vercel project settings. `next build` regenerates the content layer, so no
extra build step is required.

## Notes

- URLs from the legacy site are preserved 1:1 (`/projects/<slug>`).
- The migration plan and audit live in [`MIGRATION_PLAN.md`](./MIGRATION_PLAN.md).
- Structure is i18n-ready (single locale `en` today) without i18n implemented.
