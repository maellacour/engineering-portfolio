# MIGRATION_PLAN.md — Nuxt 3 → Next.js

Phase 1 deliverable: audit of the legacy Nuxt site and a proposed migration
plan. **No application code has been written.** This document is for your
review. Nothing in Phase 2 starts until you validate the plan.

- **Legacy (read-only, stays in prod):** `/home/eyp/Projects/portfolios/personal-portfolio`
- **Target (this repo):** `/home/eyp/Projects/portfolios/engineering-portfolio`

---

## 1. Executive summary

The legacy site is a small, highly regular content-driven portfolio: **one
home page + 7 project pages**, no blog, no dynamic data, static-generated. The
migration is low-risk on routing (1:1 URL mapping, **zero redirects required**)
but has **one real design decision**: how to port the project pages, which are
authored in Nuxt's MDC component syntax that has no equivalent in Velite/MDX.

The biggest single item for your arbitration is **§8 (project content model)**.
Almost everything else is mechanical.

---

## 2. Legacy audit

### 2.1 Routes (the complete public surface)

| URL | Source | Notes |
|-----|--------|-------|
| `/` | `app/pages/index.vue` | Home: hero, projects, trust, about, contact |
| `/projects/studova` | `content/projects/studova.md` | Featured |
| `/projects/neurotrainer` | `content/projects/neurotrainer.md` | Featured |
| `/projects/harmonie` | `content/projects/harmonie.md` | Featured |
| `/projects/ecorescue` | `content/projects/ecorescue.md` | Other |
| `/projects/tiktik` | `content/projects/tiktik.md` | Other |
| `/projects/borgia` | `content/projects/borgia.md` | Other |
| `/projects/portfolio` | `content/projects/portfolio.md` | Other |

Static assets served at root: `/favicon.ico`, `/logo.png`,
`/LACOUR.Mael.Resume.No-Tel.pdf`.

Note: `app.vue` and `index.vue` reference `/og.png` as an OG fallback, but
there is **no `public/og.png`** — OG images are generated at runtime by
`nuxt-og-image`. See §2.5 and §9.

### 2.2 Home page structure (`index.vue`)

Five stacked sections, in order:

1. **Hero** (`landing/Hero.vue`) — title, description, profile image (Cloudinary),
   a "Download CV" button, an "Available for consulting" status pill, social
   icons. Entrance animations via `motion-v` (blur/scale/opacity).
2. **Projects** (`landing/Projects.vue`) — a 3-card "Featured" grid + a 4-card
   "More Projects" grid.
3. **Trust** (`landing/Trust.vue`) — 6 institution/recognition cards.
4. **About** (`landing/About.vue`) — image + HTML prose.
5. **Contact** (`landing/Contact.vue`) — image + HTML prose + email/social buttons.

### 2.3 Content-driven vs. hard-coded

This split matters because the brief requires content to be editable without
touching code. Today it is **partially** so:

| Element | Today | Should become |
|---------|-------|---------------|
| Hero title/description/image/CTA | `content/index.yml` | Content ✅ (keep) |
| Projects section title/description | `content/index.yml` | Content ✅ |
| About title/description/image | `content/index.yml` (HTML in YAML) | Content ✅ |
| Contact title/description/image | `content/index.yml` (HTML in YAML) | Content ✅ |
| **Featured vs Other project split** | **hard-coded arrays** in `Projects.vue` | Content (schema field) |
| **Trust: 6 institutions** | **hard-coded** in `Trust.vue` | Content (YAML list) |
| Email / LinkedIn / GitHub | `app.config.ts` `global` | Content (site config file) |
| "Available" status flag | `app.config.ts` `global.available` | Content (site config) |
| Footer credits + links | `app.config.ts` `footer` | Content (site config) |
| Nav links | `app/utils/links.ts` | Content or code (small) |

Observations worth flagging:

- **About/Contact descriptions are raw HTML embedded in YAML** (`<p>…</p>` +
  `v-html`). Porting verbatim is fine, but in the new site these should be
  markdown fields (cleaner, safer, no `dangerouslySetInnerHTML`). Text unchanged.
- **`Trust.vue` and several copy strings contain retired formulations**
  ("let's build something that matters", "Available for consulting",
  "ambitious founders"). Per your rules these are **dropped** and replaced with
  `TODO_COPY`. See §10.

### 2.4 Project page content model (the MDC structure)

Each `content/projects/*.md` uses Nuxt Content **MDC** (Markdown Components)
syntax — block components with `::name`, nesting via `:::`/`::::`, and named
slots via `#title` / `#details`:

```
::projects-header{title, publishDate, tag}
::projects-gallery
  :::projects-gallery-image{name, index, alt}   (×N)
::projects-sections
  :::projects-left-section
    ::::projects-left-block  (#title / #details)   (×N: Type, Objectives, Tools, Metrics…)
  :::projects-right-section  (#title / #details)    ("Challenge" narrative)
::cloudinary-video{videoId}   (optional; 4 of 7 projects)
```

Structural facts across all 7 files:

- **Every** project has: header, left-section blocks, a right-section "Challenge".
- **6 of 7** have a gallery (portfolio has 1 image; borgia has none).
- **4 of 7** (ecorescue, neurotrainer, tiktik + a `## Watch the video` heading)
  embed a Cloudinary video.
- Left blocks are freeform markdown (bold, lists, links) — count varies 2–5.
- `{{ $doc.description }}` interpolation injects the frontmatter `description`
  into the "Objectives" block in several files.
- Project frontmatter today: `title`, `description`, `image`, `date` (number/year).
- The header component **also** carries `publishDate` and `tag`, defined inside
  the MDC body, **not** the frontmatter — and `publishDate` sometimes differs
  from `date` (studova: `date: 2024`, `publishDate: 2025`). ⚠️ see §13.
- `ProjectsPartnerItem.vue` exists but is **used by no markdown file** — dead
  component, will not be ported.

### 2.5 External integrations

| Concern | Legacy | Notes for migration |
|---------|--------|---------------------|
| Images | Cloudinary via `@nuxtjs/cloudinary` + `@nuxt/image` (`<CldImage>`) | Cloud name `dyvpecjfg`. Public IDs stored bare in content (e.g. `Studova-hero_p7swln.png`). → `next-cloudinary`. |
| Video | `<CldVideoPlayer>` | → `next-cloudinary` `CldVideoPlayer`. |
| SEO | `@nuxtjs/seo` + `useSeoMeta` | → Next Metadata API. |
| OG images | `nuxt-og-image` (satori) with `OgImages/Home.vue`, `OgImages/Project.vue` | → Next `ImageResponse` (`opengraph-image.tsx`). Templates rebuilt (satori JSX ≠ React exactly, but close). |
| Fonts | `@nuxt/fonts`, **DM Sans** | → `next/font/google` DM Sans. |
| Icons | `@iconify-json/heroicons`, `@iconify-json/simple-icons` (`i-heroicons-*`, `i-simple-icons-*`) | → `lucide-react` (UI) + a simple-icons pack for brand logos. See §7. |
| Color mode | `@nuxt/ui` colorMode, fallback **dark** | → `next-themes`, default dark. |
| Animation | `motion-v` | → `motion` (Motion for React, ex-`framer-motion`). |
| Analytics | CLAUDE.md **claims** Cloudflare Analytics, but **no analytics module is wired** in `nuxt.config.ts` and no token in `.env` | **None active.** Per your rules I will **not** add analytics without asking. |
| Deployment | Nitro SSG (`prerender`, `crawlLinks`); no `vercel.json`/`netlify.toml` in repo | Target: Next static/SSG on your host of choice (assume Vercel unless told otherwise). ⚠️ §13. |

Theme: primary **indigo**, neutral **zinc**, background gray-50/gray-900.

---

## 3. Target stack & versions (verified against npm, 2026-08-24)

Versions checked live on the registry; peer-compat noted.

| Package | Latest stable | Decision |
|---------|--------------|----------|
| `next` | **16.3.2** | ⚠️ see compat note below |
| `react` / `react-dom` | **19.2.8** | Use 19. |
| `typescript` | current 5.x | strict mode. |
| `tailwindcss` + `@tailwindcss/postcss` | **4.3.3** | Tailwind v4 (CSS-first config). Legacy is already Tailwind v4-era. |
| `velite` | **0.4.0** | Node `^18.20 || >=20.3`. Build-time content layer. |
| `next-cloudinary` | **6.18.8** | ⚠️ peer compat below. |
| `next-themes` | **0.4.6** | Dark mode. |
| `zod` | **4.4.3** | Velite re-exports its own `s`/zod; pin one version to avoid drift. |
| `motion` | current | Animations. |
| `shadcn` (CLI) | **4.19.0** | Primitives only (see §7). |
| Icons | `lucide-react` + brand-icon pack | §7. |

### ✅ Resolved — Next version (was the one non-trivial version choice)

`next-cloudinary@6.18.8` declares its peer range as
`next: "…^15"` — **it does not list Next 16.** I checked whether a newer
next-cloudinary fixes this: it does **not**.

- The only newer line, `7.0.0-beta.11`, declares the **identical** peer range
  (`…^15`) — no Next 16 support added.
- That beta (published 2025-09-16) is **older** than stable `6.18.8`
  (2026-08-07) — a stale branch, not the future. No release, stable or beta,
  supports Next 16.

**Decision: pin `next@15.5.x`.** Fully inside next-cloudinary's supported range,
zero peer warnings. Nothing here needs a Next-16-only feature (App Router, RSC,
Metadata API, `ImageResponse` all present in 15.5). Bump to 16 later in one line
once next-cloudinary catches up.

---

## 4. Target Next.js tree (App Router)

```
engineering-portfolio/
├── content/
│   ├── site.yml                 # NEW: global config (email, socials, footer, nav, availability)
│   ├── home.yml                 # ← index.yml (hero/projects/about/contact copy)
│   ├── trust.yml                # NEW: institutions list (was hard-coded)
│   ├── projects/*.md            # ← projects/*.md, restructured (see §8)
│   └── notes/                   # NEW: empty; scaffolding only
├── content/i18n/                # (optional future) — structure allows it; not used now
├── velite.config.ts            # Velite schemas (proposed in §6)
├── src/
│   ├── app/
│   │   ├── layout.tsx           # root: fonts, ThemeProvider, header/footer, <html lang>
│   │   ├── page.tsx             # home ( ← index.vue )
│   │   ├── opengraph-image.tsx  # ← OgImages/Home.vue
│   │   ├── projects/
│   │   │   └── [slug]/
│   │   │       ├── page.tsx            # ← pages/projects/[...slug].vue
│   │   │       └── opengraph-image.tsx # ← OgImages/Project.vue
│   │   ├── notes/
│   │   │   └── page.tsx          # NEW: notes index (empty state)
│   │   └── not-found.tsx
│   ├── components/
│   │   ├── ui/                   # shadcn primitives (button, navigation-menu, card…)
│   │   ├── layout/               # Header, Footer, ThemeToggle (hand-written)
│   │   ├── home/                 # Hero, Projects, Trust, About, Contact (hand-written)
│   │   └── project/              # ProjectHeader, ProjectGallery, ProjectBlock, ProjectVideo
│   ├── lib/                      # cloudinary helpers, cn(), site config accessor
│   └── styles/globals.css        # Tailwind v4 + tokens (indigo/zinc, dark default)
├── public/                       # favicon.ico, logo.png, resume PDF (copied as-is)
├── CHANGELOG.md                  # Keep a Changelog
└── package.json
```

`src/` is optional — I can flatten to root `app/` if you prefer. Stated so you
can veto now.

---

## 5. File-by-file mapping (old → new)

### Pages / routes

| Legacy | New |
|--------|-----|
| `app/app.vue` | `src/app/layout.tsx` (+ `next-themes` provider) |
| `app/layouts/default.vue` | folded into `layout.tsx` (container + header + footer) |
| `app/pages/index.vue` | `src/app/page.tsx` |
| `app/pages/projects/[...slug].vue` | `src/app/projects/[slug]/page.tsx` (`generateStaticParams`) |
| — | `src/app/notes/page.tsx` (NEW) |

### Components

| Legacy (Nuxt) | New (React) | Kind |
|---------------|-------------|------|
| `AppHeader.vue` | `components/layout/Header.tsx` | hand-written Tailwind |
| `AppFooter.vue` | `components/layout/Footer.tsx` | hand-written |
| `ColorModeButton.vue` | `components/layout/ThemeToggle.tsx` | `next-themes` |
| `landing/Hero.vue` | `components/home/Hero.tsx` | hand-written + `motion` |
| `landing/Projects.vue` | `components/home/Projects.tsx` | hand-written cards |
| `landing/Trust.vue` | `components/home/Trust.tsx` | hand-written, data from `trust.yml` |
| `landing/About.vue` | `components/home/About.tsx` | hand-written |
| `landing/Contact.vue` | `components/home/Contact.tsx` | hand-written |
| `content/projects/ProjectsHeader.vue` | `components/project/ProjectHeader.tsx` | see §8 |
| `content/projects/ProjectsGallery(+Image).vue` | `components/project/ProjectGallery.tsx` | `CldImage` |
| `content/projects/ProjectsSections/LeftSection/LeftBlock/RightSection.vue` | `components/project/ProjectBlocks.tsx` | see §8 |
| `content/cloudinary/CloudinaryVideo.vue` | `components/project/ProjectVideo.tsx` | `CldVideoPlayer` |
| `content/projects/ProjectsPartnerItem.vue` | **dropped** (unused) | — |
| `ImagePlaceholder.vue` | ported only if still referenced (it is a fallback SVG) | optional |
| `OgImages/Home.vue` | `app/opengraph-image.tsx` | `ImageResponse` |
| `OgImages/Project.vue` | `app/projects/[slug]/opengraph-image.tsx` | `ImageResponse` |
| `app/utils/links.ts` | `content/site.yml` (nav) or `lib/nav.ts` | — |

### Config

| Legacy | New |
|--------|-----|
| `nuxt.config.ts` | `next.config.ts` + `velite.config.ts` |
| `app.config.ts` (`global`, `footer`, `ui`) | `content/site.yml` + `globals.css` tokens |
| `content.config.ts` (Nuxt Content schemas) | `velite.config.ts` |
| `tailwind.config.ts` (DM Sans) | `globals.css` (`@theme`) + `next/font` |
| `.env.example` | `.env.example` (Cloudinary cloud name, site URL) |
| `eslint.config.mjs` | ESLint flat config (Next + Prettier) |

### Content

| Legacy | New |
|--------|-----|
| `content/index.yml` | split → `content/home.yml` + `content/site.yml` + `content/trust.yml` |
| `content/projects/*.md` (7) | `content/projects/*.md` (7, restructured — §8) |
| `public/*` | `public/*` (verbatim copy) |

---

## 6. Proposed Velite schema (`velite.config.ts`)

Illustrative — this is a *proposal for your review*, not committed code. Uses
Velite's `s` helpers (`s.markdown()` compiles a markdown string → HTML at build,
which cleanly replaces the `v-html`/prose slots). Depends on §8 being approved.

```ts
import { defineConfig, s } from 'velite'

const media = s.object({
  type: s.enum(['image', 'video']).default('image'),
  src: s.string(),          // Cloudinary public ID (bare, as today)
  alt: s.string(),
})

const projects = {
  name: 'Project',
  pattern: 'projects/**/*.md',
  schema: s.object({
    slug: s.path(),                         // → /projects/<slug>, preserves URLs
    title: s.string(),
    description: s.string(),                 // verbatim from legacy
    cover: s.string(),                       // Cloudinary public ID (legacy `image`)
    date: s.number(),                        // year
    publishDate: s.number().optional(),      // header's publishDate (⚠️ §13)
    tag: s.string(),                         // "SaaS · Full-Stack · …"
    featured: s.boolean().default(false),    // was hard-coded — now content
    order: s.number().default(0),            // controls grid order
    gallery: s.array(media).default([]),
    video: media.optional(),                 // the single Cloudinary video
    blocks: s.array(s.object({               // left-column meta blocks
      title: s.string(),
      body: s.markdown(),                    // markdown → HTML
    })).default([]),
    challenge: s.markdown(),                 // right-column narrative (from body)
  }),
}

const home = { /* mirrors home.yml: hero, projects, about, contact */ }
const site = { /* email, socials, footer, nav, available */ }
const trust = { /* array of { icon, name, tagline } */ }
const notes = {
  name: 'Note',
  pattern: 'notes/**/*.mdx',
  schema: s.object({
    slug: s.path(), title: s.string(), description: s.string().optional(),
    date: s.isodate(), draft: s.boolean().default(true),
  }),
}

export default defineConfig({ collections: { projects, home, site, trust, notes } })
```

---

## 7. Nuxt UI Pro → shadcn/ui mapping

Per your design rules: **shadcn for primitives only; hero, project cards and
page layout are hand-written Tailwind.** So most Nuxt UI Pro layout components do
**not** map to a shadcn block — they map to hand-written markup.

| Nuxt UI Pro | Target | Notes |
|-------------|--------|-------|
| `UButton` | shadcn **Button** | primitive ✅ |
| `UNavigationMenu` | shadcn **NavigationMenu** | primitive ✅ |
| `UApp` | ThemeProvider + layout | — |
| `UContainer` | hand Tailwind (`max-w-*`) | layout, by hand |
| `UPage` / `UMain` | hand Tailwind wrappers | by hand |
| `UPageHero` | **hand-written** `Hero.tsx` | identity component — no template |
| `UPageSection` | **hand-written** section wrapper | by hand |
| `UPageHeader` | **hand-written** | by hand |
| `UCard` (project cards) | **hand-written** | your rule: cards by hand |
| `UFooter` | **hand-written** `Footer.tsx` | by hand |
| `UIcon` (heroicons) | **`lucide-react`** | closest 1:1 for UI glyphs |
| `UIcon` (simple-icons: linkedin, github, unity) | brand-icon pack | choice below |
| `ContentRenderer` | Velite output + MDX/HTML | §8 |
| `<Motion>` (motion-v) | `motion` (React) | respect `prefers-reduced-motion` |
| `CldImage` / `CldVideoPlayer` | `next-cloudinary` equivalents | same names |
| colorMode | `next-themes` | default dark |

**Brand icons choice:** heroicons → `lucide-react`. Simple-icons (LinkedIn,
GitHub, Unity) has no lucide equivalent for Unity; I'd add
`@icons-pack/react-simple-icons`. Flagged as item in §13 if you'd rather inline
SVGs.

---

## 8. Project content model — **the main decision**

The MDC syntax (`::projects-header`, `#title`/`#details` slots) is a Nuxt Content
feature with **no equivalent in Velite/MDX**. It cannot be ported verbatim; the
*wrapper syntax* must change. Your rule "port text verbatim" applies to the
**prose**, which is preserved either way. Two ways to do the wrapper:

### Option A — MDX with components (closest to today's authoring)
Rewrite each `.md` as `.mdx`, replacing MDC blocks with JSX components:
`<ProjectHeader … />`, `<ProjectGallery>…`, `<ProjectBlock title="…">…`,
`<ProjectVideo … />`. Prose stays as markdown inside the components.
- 👍 Familiar block-in-body authoring; flexible free-form layout per project.
- 👎 Editing content means writing JSX-ish MDX — brushes against "edit content
  without touching code". Velite MDX + custom components is more wiring.

### Option B — structured data schema (recommended)
Model a project as typed fields (frontmatter + a markdown body for the one long
narrative), rendered by **one** hand-built template. The legacy structure is
extremely regular (header + gallery + N meta blocks + one "Challenge" + optional
video), so it fits cleanly:

```markdown
---
title: Studova
description: "…verbatim…"
cover: Studova-hero_p7swln.png
date: 2024
publishDate: 2025
tag: "SaaS · Full-Stack · Research Tooling"
featured: true
order: 1
gallery:
  - { src: 01-landing.png, alt: Tasks Overview }
  - …
video: null
blocks:
  - title: Project Type
    body: |
      Personal SaaS Platform
      Research & Development
  - title: Objectives
    body: |
      …verbatim…
challenge: >     # ← or use the markdown body below the frontmatter
---

The core problem: research studies have wildly different shapes… (verbatim)
```

- 👍 Pure content editing — no JSX, no code. Matches the brief's hard rule.
- 👍 Featured/order/tag/publishDate all become data (kills the hard-coded arrays).
- 👍 One template = consistent design, less surface to break.
- 👎 Authoring format differs from legacy MDC (but prose is verbatim; §13 notes
  the `{{ $doc.description }}` inlining — the Objectives block that referenced the
  description will get the text inlined once, verbatim).

**Decision: Option B — with an MDX escape hatch (hybrid).** Structured fields
cover the regular 90% (header, gallery, meta blocks, video); the markdown body
below the frontmatter renders as free MDX for any future one-off (embedded demo,
custom diagram, bespoke section). Regular projects never touch it; a special one
has room to breathe. Same schema, no downside. `challenge` prose lives in that
body.

---

## 9. URL preservation & redirects

Target route `src/app/projects/[slug]/page.tsx` with `generateStaticParams()`
over the Velite `projects` collection reproduces every legacy URL exactly:

```
/                       ✅ unchanged
/projects/studova       ✅
/projects/neurotrainer  ✅
/projects/harmonie      ✅
/projects/ecorescue     ✅
/projects/tiktik        ✅
/projects/borgia        ✅
/projects/portfolio     ✅
```

**Redirects required: none.** The slug is the filename, identical in both
systems. (Legacy used a `[...slug]` catch-all but only ever resolved these flat
paths.)

Caveats to confirm:
- **Trailing slashes:** both Nuxt and Next default to no trailing slash — no
  change. I'll keep Next's default.
- **`/og.png`:** referenced but never existed as a file; OG served dynamically.
  New site serves OG via `opengraph-image.tsx`. No redirect needed; just don't
  reintroduce a dead `/og.png` reference.
- New `/notes` route is additive (no legacy collision).

I'll include a redirect stub in `next.config.ts` (empty) so the mechanism exists
if you later rename anything.

---

## 10. Copy handling (TODO_COPY)

All brand copy is **written by you**, not me. Plan:

- Centralise every editable string in `content/home.yml` + `content/site.yml`.
- Where legacy copy is **retired**, insert literal `TODO_COPY` and drop the old
  text. Retired/blocked strings I will **not** carry over:
  - Home description: *"…ambitious founders build the tools that push boundaries."*
  - About: *"available for consulting …"* / *"build something that matters"*
  - Contact: *"Let's build something that matters."* + consulting framing
  - Trust footer line: *"let's build something that matters."*
  - Hero pill: *"Available for consulting"*
- **Project descriptions and project body prose are carried over verbatim** (they
  are portfolio facts, not brand positioning).
- Meta titles/descriptions that echo retired copy → `TODO_COPY`.

I'll produce a short `COPY_TODO.md` listing each `TODO_COPY` slot with context so
you can fill them in one pass.

---

## 11. i18n readiness (structure only, not implemented)

- Content keyed so a locale can be added later: `content/home.yml` →
  `content/en/home.yml` shape is a one-line change; Velite patterns support
  `**/` globbing per-locale.
- No `next-intl`/routing added now. Copy lives in content files, not hard-coded
  in components, so extraction later is mechanical.
- `<html lang="en">` set explicitly; single default locale `en`.

## 12. Media slot (schema-level, per your brief)

The `media` type in §6 already reserves image **and** video slots
(`type: image | video`), so project galleries can mix screenshots, GIFs (served
as image or mp4 via Cloudinary), and short videos without a schema change. Legacy
had a separate `cloudinary-video`; the new schema folds it into `video` +
`gallery[]`.

---

## 13. Points needing your arbitration

**Resolved:**
1. ✅ **Next version** → **Next 15.5.x** (§3). Updating next-cloudinary does not
   unlock 16; the beta is stale and has the same peer range.
2. ✅ **Project content model** → **Option B, hybrid** (structured fields + MDX
   escape-hatch body) (§8).
6. ✅ **Deployment** → **Vercel** (static/SSG).
7. ✅ **Analytics** → ship **without** now; keep wiring trivial to add later
   (env var + one provider component slot reserved in `layout.tsx`).

**Still open (minor — I'll pick the noted default if you don't weigh in):**
3. **`date` vs `publishDate`** (studova: 2024 vs 2025; others align). Which is
   canonical for display/sorting? *Default:* keep both, display `publishDate`,
   sort by it, fall back to `date`.
4. **`src/` directory** (§4). *Default:* use `src/`.
5. **Brand icons** (§7). *Default:* add `@icons-pack/react-simple-icons` for
   LinkedIn/GitHub/Unity; `lucide-react` for UI glyphs.
8. **Nav** — "Contact" → `/#contact` today. *Default:* keep single-page anchor
   nav; add a `/notes` nav link only once notes have content.

## 14. Proposed Phase 2 sequence (after you validate)

One commit per step; lint/typecheck green before each.

1. Scaffold Next + TS + Tailwind v4 + ESLint/Prettier → verify: `dev` boots.
2. Velite config + port content (site/home/trust + 7 projects) → verify: build
   emits typed data, no schema errors.
3. Layout shell: fonts, theme (dark default), header/footer, container.
4. Home sections (hero → projects → trust → about → contact), mobile-first.
5. Project template + `generateStaticParams` → verify: all 7 URLs render, gallery
   + video work.
6. Cloudinary wiring (`CldImage`/`CldVideoPlayer`).
7. SEO Metadata API + OG image routes → verify: OG renders for home + a project.
8. `/notes` scaffold (index + empty state).
9. `COPY_TODO.md` + all `TODO_COPY` placeholders in place.
10. Parity pass vs legacy (URLs, responsive, keyboard focus, reduced-motion),
    CHANGELOG, README.

---

**Phase 1 ends here. Awaiting your validation (especially items 1, 2, 6, 7 in
§13) before writing any application code.**
