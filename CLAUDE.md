# CLAUDE.md — engineering-portfolio

Guidance for Claude Code working in this repository.

---

## Project

Personal engineering portfolio for Maël Lacour, rewritten in Next.js.
Replaces a Nuxt 3 site (Nuxt UI Pro + Nuxt Content) currently live at
`www.maellacour.com`.

- **Legacy source (read-only reference):** `/home/eyp/Projects/portfolios/personal-portfolio`
- **This project:** `/home/eyp/Projects/portfolios/engineering-portfolio`

The legacy Nuxt project stays in production during the migration. **Never
modify it.** Read from it freely.

A separate real-estate site may live alongside this one later. Keep this
repository scoped to the engineering identity only.

See CONTEXT.md for background on who this site represents and where it's heading

---

## Behavioral Guidelines

> These guidelines bias toward caution over speed. For trivial tasks, use judgment.

### 1. Think Before Coding

**Don't assume. Don't hide confusion. Surface tradeoffs.**

Before implementing:
- State your assumptions explicitly. If uncertain, ask.
- If multiple interpretations exist, present them — don't pick silently.
- If a simpler approach exists, say so. Push back when warranted.
- If something is unclear, stop. Name what's confusing. Ask.

### 2. Simplicity First

**Minimum code that solves the problem. Nothing speculative.**

- No features beyond what was asked.
- No abstractions for single-use code.
- No "flexibility" or "configurability" that wasn't requested.
- No error handling for impossible scenarios.
- If you write 200 lines and it could be 50, rewrite it.

Ask yourself: "Would a senior engineer say this is overcomplicated?" If yes, simplify.

### 3. Surgical Changes

**Touch only what you must. Clean up only your own mess.**

When editing existing code:
- Don't "improve" adjacent code, comments, or formatting.
- Don't refactor things that aren't broken.
- Match existing style, even if you'd do it differently.
- If you notice unrelated dead code, mention it — don't delete it.

When your changes create orphans:
- Remove imports/variables/functions that YOUR changes made unused.
- Don't remove pre-existing dead code unless asked.

The test: every changed line should trace directly to the user's request.

### 4. Git Commits

- Conventional Commits, one commit per logical step. No big-bang diffs.
- Never add a `Co-Authored-By: Claude` trailer to commit messages.

### 5. Goal-Driven Execution

**Define success criteria. Loop until verified.**

Transform tasks into verifiable goals:
- "Add validation" → "Write tests for invalid inputs, then make them pass"
- "Fix the bug" → "Write a test that reproduces it, then make it pass"
- "Refactor X" → "Ensure tests pass before and after"

For multi-step tasks, state a brief plan:

```
1. [Step] → verify: [check]
2. [Step] → verify: [check]
3. [Step] → verify: [check]
```

---

## Who this site is for

Two audiences, in priority order:

1. **Professional contacts met at events or conferences** who look me up on
   mobile within 24 hours. They need, in ~20 seconds: who I am, what I build,
   why it's credible, how to reach me.
2. **Friends and family**, non-technical, who want to see what I actually
   work on. They need visuals, not jargon.

This is **not** a sales site for consulting services.

<!-- TODO: fill before starting
- One-line positioning (the headline):
- Axes by priority (XR/research, AI, full stack, side projects):
- Consulting mention — keep / drop / soften:
- Tone (sober and institutional / direct and personal / other):
-->

---

## Stack

- Next.js (App Router) + TypeScript
- Tailwind CSS
- shadcn/ui
- Velite — markdown/MDX content layer with typed schemas
- next-cloudinary — image delivery (existing Cloudinary account)
- Next Metadata API for SEO

**Do not use Contentlayer** — unmaintained.

Never assume version numbers. Check current stable versions and mutual
compatibility before pinning anything in `package.json`. Flag non-trivial
choices instead of deciding silently.

<!-- TODO: fill in once the stack is pinned
- Node version:
- Package manager:
- Hosting / deploy target:
-->

---

## Content system

All editable content lives in markdown/MDX or YAML under `content/`, validated
by Velite schemas. **Adding or editing content must never require touching
application code.**

- `content/projects/` — one file per project
- `content/notes/` — written pieces (scaffolded, empty for now)
- Brand copy — centralised in a single file, see below

Project entries need a media slot (screenshots, GIFs, short videos). The
legacy site has no visuals; this one must support them from the start.

Preserve existing URLs: `/projects/[slug]` must match the legacy site exactly.
Any change requires an explicit redirect.

---

## Copy rules

Brand copy is **drafted by Claude from `CONTEXT.md`, then reviewed and edited by
Maël**. Write plainly and only from facts in `CONTEXT.md` — never invent claims
or marketing gloss, and honour the boundaries there (no services offer, no
inflation, research at the public level only). When the context doesn't cover
something, ask rather than guess.

Retired formulations — do not reuse:
- "ambitious founders"
- "let's build something that matters"
- "available for consulting"

Project descriptions were originally ported from the legacy site, but they are
now maintained in this repo and no longer need to match the legacy wording. Edit
them like any other copy, following the rules above.

Where copy is written: plain verbs, sentence case, active voice, no filler.
Specific beats clever. Name things the way a reader recognises them, not the
way the system is built.

The site must read as written by Maël, not by a model. Avoid the punctuation and
phrasing people now associate with AI: no em dashes (`—`) as sentence
punctuation (use commas, colons, semicolons, periods, or parentheses instead),
and steer clear of tells like "not just X, but Y", forced rule-of-three lists,
and hollow connectors ("moreover", "furthermore", "in the ever-evolving world
of"). Ordinary hyphens in compounds (`self-paced`, `full-stack`) are fine. This
applies to user-visible copy and, where practical, to code comments too.

---

## Design

**Direction: "Immersive."** Deep-dark canvas, indigo primary. Signature element:
a cursor-reactive indigo mesh glow behind the hero (subtle, static-friendly on
touch). Display type in Space Grotesk, body in Bricolage Grotesque, labels/eyebrows in
Space Mono. Portrait gets a duotone/halo treatment; project cards are
image-forward with a gradient scrim. Depth via layering and `backdrop-filter`.

Guardrails that apply regardless of direction:

- **Hand-written Tailwind is the default.** The site's identity — hero, project
  cards, layout, most UI — is written by hand. Reach for a headless primitive
  library (Radix / Base UI / shadcn) only when a component genuinely needs
  robust accessibility not worth rebuilding (dialog, dropdown, combobox,
  tooltip). It's a tool, not a mandate — don't force it where hand-writing is
  simpler.
- **Never ship default-styled shadcn blocks/templates for identity components.**
  Default shadcn styling reads as templated on sight; if you do use a primitive,
  restyle it fully to the site's system.
- Spend boldness in one place. One memorable element, everything around it
  quiet.
- Quality floor, unannounced: responsive down to mobile, visible keyboard
  focus, `prefers-reduced-motion` respected.
- Mobile first — most visitors arrive on a phone.

---

## Conventions

- TypeScript strict; no `any` without a comment explaining why.
- Structure ready for i18n (EN now, FR possible later) without implementing
  i18n yet.
- ESLint + Prettier enforced; no commits that fail lint.
- `CHANGELOG.md` in Keep a Changelog format.

---

## Do not

- Modify the legacy Nuxt project.
- Write brand copy.
- Add analytics, tracking, or third-party scripts without asking.
- Introduce a dependency that duplicates something already in the stack.
- Break an existing public URL without an accompanying redirect.
