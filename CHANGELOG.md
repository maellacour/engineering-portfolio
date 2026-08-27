# Changelog

All notable changes to this project are documented here. The format is based on
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project
adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Changed

- The `/work` archive now presents every project in the horizontal row format
  from the home — the featured projects first, then the rest under a "More work"
  heading (replacing the previous card grid).
- Reworked site copy to read as hand-written: replaced em dashes used as
  sentence punctuation with commas, colons, semicolons, or parentheses across
  all content and page text.
- Typography: body text now in Bricolage Grotesque and labels/eyebrows in Space
  Mono (replacing DM Sans / JetBrains Mono); display stays Space Grotesk.
- Hero portrait now uses a borderless square frame to fit the new square profile
  image.

### Fixed

- Base font was applied to `<html>` while the `--font-sans` variable is defined
  on `<body>`, so the custom body font never took effect (fell back to the
  system font). Apply it on `<body>` instead.

## [0.3.0] — 2026-08-26

### Added

- Case-study project pages: an "In use" (real-world status) section and a "What
  I learned" section, a sticky at-a-glance sidebar, and scroll-reveals.
- A `/work` archive page listing every project; the home now features a curated
  set and links out to the archive.
- Contact form (name / email / message) posting to an `/api/contact` route that
  emails via Resend. Bot protection: honeypot, length caps, a link-spam
  heuristic, and optional Cloudflare Turnstile (server-verified).
- An About "journey" thread, content-driven from `content/journey.yml`: the path
  from math & geometry through ENSAM, the xCIT cognitive lab, Unity / XR (Unity
  Certified Expert milestone), backend, and AI.
- Easter eggs and mini-games in the About section, each with a reduced-motion
  fallback:
  - A multiple-object-tracking attention game (a nod to the cognitive-science
    work).
  - A Stroop test that unlocks a celebration and a link to NeuroTrainer after an
    eight-answer streak.
  - Click the portrait to play a short original piano flourish that reveals the
    caption.
  - A console greeting — ASCII art and contact links printed once on load.

### Changed

- Rebuilt "Selected work" as alternating full-width rows with directional
  entrance animations, image scroll-parallax, and an index watermark; featured
  order is now NeuroTrainer → TikTik → HarMoNie.
- Reframed "What I build" around the through-line of the work.
- Redesigned the About and Contact sections — editorial About (glowing sticky
  portrait, accent spine, lead paragraph); Contact as a glowing form panel.
- More personal, story-driven About copy.
- Removed the colour tint on the hero portrait; the background glow is kept.

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

[Unreleased]: https://github.com/maellacour/engineering-portfolio/compare/v0.3.0...HEAD
[0.3.0]: https://github.com/maellacour/engineering-portfolio/compare/v0.2.0...v0.3.0
[0.2.0]: https://github.com/maellacour/engineering-portfolio/compare/v0.1.0...v0.2.0
[0.1.0]: https://github.com/maellacour/engineering-portfolio/releases/tag/v0.1.0
