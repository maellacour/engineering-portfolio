# Changelog

All notable changes to this project are documented here. The format is based on
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project
adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- Next.js 15.5 (App Router) + TypeScript rewrite of the legacy Nuxt 3 site.
- Velite content layer with typed schemas for site, home, trust, projects and
  notes.
- All 7 projects ported verbatim to a structured project schema with an MDX
  escape hatch for the body narrative.
- Home page: portrait-led hero, project grid (featured + more), trust, about
  and contact sections — content-driven, mobile-first, dark mode by default.
- Project detail pages at `/projects/[slug]`, preserving legacy URLs 1:1.
- `/notes` section scaffold (index + MDX detail route); no content yet.
- SEO via the Next Metadata API and dynamic Open Graph images (`next/og`).
- `sitemap.xml`, `robots.txt`, and a custom 404 page.
- Cloudinary image/video delivery via `next-cloudinary`.
- `COPY_TODO.md` checklist for brand copy left as `TODO_COPY`.

[Unreleased]: https://github.com/maellacour/engineering-portfolio
