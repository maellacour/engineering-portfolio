# CONTEXT.md — Who I am, what I've built, where I'm going

Background briefing for the agent working on this site. This is **context, not
copy**: use it to make better decisions about structure, emphasis, project
descriptions, image alt text, and ordering. Brand copy is drafted from this
context, written into the `content/` files, and approved by Maël — the
boundaries below still apply.

---

## Who I am

Maël Lacour, engineer, based in Geneva. Grande École engineer from Arts et
Métiers ParisTech. I started in aerospace (Airbus-awarded student work), then
found the place where I do my best work: the intersection of software
engineering and science.

Since 2020 I've been Lead/Senior XR & Full Stack Engineer at Fondation Campus
Biotech Geneva (FCBG), a neuroscience research campus. My job is turning
research protocols into software that real people use: cognitive-training
games engaging enough that study participants keep coming back, VR tools
reliable enough for educational and clinical settings, and the infrastructure
that keeps multi-site studies running.

Unity Certified Expert Programmer. Outside work: paragliding.

## What I've actually built

**Research games** (Unity, with UNIGE / Bavelier Lab and partners):
- *RobbinGoblins* — a tower-defense game that is also a calibrated attention
  experiment (multiple-object tracking, adaptive staircases), run with UNIGE
  and U. Wisconsin–Madison.
- *EcoRescue* — an attention-training game feeding a three-site study
  (Geneva, Haifa, Miami).
- *TikTik* — a cooperative 2D puzzle game for research on collaborative
  problem-solving, with online multiplayer.

**XR tools**:
- *Anatomy.VR* — a Meta Quest 3 anatomy lab for Université Libre de
  Bruxelles, where educators author annotations directly inside the headset.
- *NeuroTrainer* — a VR viewer for volumetric medical imaging (MRI/CT),
  built with HUG.

**Mobile**: *HarMoNie* — a Flutter health-education app for music students,
commissioned by Haute École de Musique de Genève, taken from research
protocol to release.

**The layer underneath**: backends (Parse, Laravel/MySQL), Azure
infrastructure, data pipelines, CI/CD. Not glamorous, but it's why
participants can log in on day one of a study.

**Open source**: Unity packages published on OpenUPM under
`com.maellacour.*` (eyap-library, experiment-library) — shared foundations I
reuse across projects.

**Side projects**: *Studova*, a SaaS for research-study management (early
stage), and personal Flutter apps.

## How I work with AI (important — this is a pillar of the site)

I'm not an AI researcher; I'm a practitioner who ships with AI daily, in a
context where correctness matters:
- Code agents (Claude Code) working on real Unity and Flutter codebases,
  with the review discipline research software demands.
- A transcription-to-notes pipeline (Whisper + Claude) my team uses for
  meetings.
- Shared conventions for AI-assisted development (CLAUDE.md files as a team
  practice).
- Pragmatic about limits: I care about where the human review boundary sits.

Currently going deeper on the ML side: training toward fine-tuning speech/
transcription models (Whisper-type), French/English, scientific vocabulary.

## Where I'm going — and how it should shape the site

Frame everything as a **trajectory**, not a snapshot:
*research proves I can build → AI is how I build today → AI is where I'm
heading.*

1. **Near term**: I want to open the door to AI-related services. Whether
   they'll be independent or carried by FCBG is **not decided** — so the site
   signals capability and openness, never a commercial offer. (Do not publish
   any services offer until this is settled and cleared with FCBG.)
2. **Speaking**: I'm starting to speak publicly — first panel on AI in
   engineering practice at HPE Explore Geneva, Sept 24, 2026. People will
   look this site up on their phones right after hearing me. The written
   Notes are what makes that visit convert.
3. **Longer term**: a possible career move toward AI/ML engineering. The AI
   axis of this site is a living section that will grow (training milestones,
   fine-tuning work, writing); design and structure should make it easy to
   extend without redesigning.

## Audiences, restated

1. Professional contacts who look me up on mobile within 24h of meeting me —
   including, soon, people who heard me talk about AI. Twenty seconds to
   convey: who, what, why credible, how to reach.
2. Friends and family, non-technical — visuals over vocabulary.

Not a sales site. Not a CV. A place that shows work and direction.

## Boundaries — do not cross

- **No commercial services offer** anywhere until I settle the question (and
  clear it with my employer).
- **Nothing about my real-estate activity** — that will be a separate site
  and brand.
- **Research described at the public level only**: institutions and published
  study framing are fine; never participant data, study internals, server
  names, infrastructure details, or anything operational about FCBG systems.
- **No inflation**: I'm a practitioner, not an AI evangelist. Claims stay
  attached to things I've actually shipped. If a sentence would sound at home
  in a startup landing page, rewrite it plainer.