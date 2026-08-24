# COPY_TODO — brand copy to write

Every editable brand-copy slot is a literal `TODO_COPY` in the content files
below. Fill them in and the site updates with **no code changes**. Legacy text
is shown only as *reference* — some is reusable, some is **retired** (see the
banned list at the bottom) and must be rewritten, not pasted.

Guidance (from CLAUDE.md): plain verbs, sentence case, active voice, no filler.
Specific beats clever.

---

## `content/home.yml`

| Field | What it is | Legacy reference |
|-------|-----------|------------------|
| `title` | Browser tab / meta title | "Hey, I'm Mael Lacour" (reusable) |
| `description` | Meta description (SEO + OG) | ⚠️ legacy used the retired "ambitious founders" line — rewrite |
| `hero.title` | Big hero headline | "Hey, I'm Mael Lacour" (reusable) |
| `hero.description` | Hero subtitle under the name | ⚠️ same retired line — rewrite |
| `hero.cta.label` | Primary hero button label | "Download CV" (reusable). `href` already points to the résumé PDF |
| `projects.title` | Projects section heading | "Featured Projects" (reusable) |
| `projects.description` | Projects section intro | "A selection of projects spanning XR research tools, SaaS platforms, mobile apps, and multiplayer games…" (reusable, trim as you like) |
| `about.title` | About section heading | "About Me" (reusable) |
| `about.body` | About prose (markdown; paragraphs allowed) | ⚠️ legacy ended with "available for consulting" — rewrite that part |
| `contact.title` | Contact section heading | "Let's Connect" (reusable) |
| `contact.body` | Contact prose (markdown) | ⚠️ legacy closed with "Let's build something that matters" — rewrite |

`about.body` and `contact.body` accept markdown (bold, links, multiple
paragraphs). Everything else is plain text.

## `content/site.yml`

| Field | What it is | Note |
|-------|-----------|------|
| `email` | Public contact address | Currently `contact.dev@maellacour.com`, de-obfuscated from the legacy "contact.dev at maellacour.com" — **confirm this is correct** |
| `availability.availableLabel` | Text on the hero status pill when `available: true` | ⚠️ "Available for consulting" is retired. Write something that fits a non-sales site, **or** set `availability.available: false` to hide the pill entirely |
| `availability.unavailableLabel` | Pill text when `available: false` | Legacy: "Not available at the moment" |

## `content/trust.yml`

| Field | What it is | Legacy reference |
|-------|-----------|------------------|
| `title` | Section heading | "Institutions & Recognition" (reusable) |
| `description` | Section intro | "Seven years of research collaborations, certified expertise, and engineering excellence." (reusable) |

The institution list (`items`) is carried over verbatim — no action needed.

---

## Retired formulations — do not reuse

- "ambitious founders"
- "let's build something that matters"
- "available for consulting"

## Not copy (leave as-is)

Project titles, descriptions and body prose are ported **verbatim** from the
legacy site and are intentionally untouched. Image references are Cloudinary
public IDs. The `/notes` section has no copy yet — write notes as MDX files in
`content/notes/`.
