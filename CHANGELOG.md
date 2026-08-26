# Changelog

All notable changes to this project are documented here. The format is based on
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project
adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- Case-study project pages: an "In use" (real-world status) section and a "What
  I learned" section, a sticky at-a-glance sidebar, and scroll-reveals.
- A `/work` archive page listing every project; the home now features a curated
  set and links out to the archive.
- Contact form (name / email / message, with a honeypot and validation) posting
  to an `/api/contact` route.

### Changed

- Removed the color tint on the hero portrait; the background glow is kept.
- More personal, story-driven About section.
- Redesigned the About and Contact sections — editorial About (glowing sticky
  portrait, accent spine, lead paragraph); Contact as a glowing form panel.

### Removed

- The "Portfolio Website" project (portfolio-as-a-project anti-pattern);
  `/projects/portfolio` now redirects to `/work`.

## [0.2.0] — 2026-08-25

### Added

- Scroll-reveal animations across the home sections — a subtle rise + fade +
  de-blur, with staggered cards. Respects `prefers-reduced-motion`.

### Fixed

- Restore the legacy favicon, logo and résumé PDF (missing from the initial
  scaffold) and remove the create-next-app demo SVGs.

## [0.1.0] — 2026-08-25

Initial preview release — the Next.js rewrite of the portfolio. The legacy Nuxt
site remains in production until the cutover (1.0.0).

### Added

- Next.js 15.5 (App Router) + TypeScript (strict) + Tailwind CSS v4.
- Velite content layer with typed schemas (site, home, projects, notes) — all
  content editable under `content/` without touching application code.
- "Immersive" design direction: near-black canvas with an Ultraviolet accent
  driven by a single hue token, a cursor-reactive background mesh, and a
  View-Transitions circular reveal on the dark/light toggle. Space Grotesk
  display, DM Sans body, JetBrains Mono labels. Hand-written components (no
  shadcn/Base UI).
- Home page: name-first hero, "What I build" (three capability axes), selected
  work (image-forward featured cards plus a thumbnailed index of the rest),
  about, and contact — content-driven, mobile-first, dark by default.
- Project detail pages at `/projects/[slug]`, preserving the legacy URLs 1:1.
- `/notes` section scaffold (index + MDX detail route); no pieces written yet.
- SEO via the Next Metadata API, dynamic Open Graph images (`next/og`),
  `sitemap.xml`, `robots.txt`, and a custom 404 page.
- Cloudinary image and video delivery via `next-cloudinary`.
- Respects `prefers-reduced-motion` throughout; visible keyboard focus.

[Unreleased]: https://github.com/maellacour/engineering-portfolio/compare/v0.2.0...HEAD
[0.2.0]: https://github.com/maellacour/engineering-portfolio/compare/v0.1.0...v0.2.0
[0.1.0]: https://github.com/maellacour/engineering-portfolio/releases/tag/v0.1.0
