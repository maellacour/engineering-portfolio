---
title: EcoRescue
description: "Action game for adolescents, built for a University of Geneva anxiety study funded by the SNSF and the European Research Council. Players depollute planets across galaxies — the gameplay data feeds longitudinal research on anxiety and attention."
cover: EcoRescue.Hero.png
date: 2022
publishDate: 2022
tag: "Unity · Research · UNIGE"
featured: false
order: 1
challengeTitle: Challenge
gallery:
  - { src: Galaxie2_ywtmek.png, alt: EcoRescue Galaxy }
  - { src: Collection_fpox3r.png, alt: EcoRescue Collection Stickers }
  - { src: Desert_vw4zm7.png, alt: EcoRescue Desert }
  - { src: Statistics.EcoRescue_ufg8mb.png, alt: EcoRescue Statistics }
  - { src: AllCleanPlanets_aa1zkz.png, alt: EcoRescue all clean planets }
  - { src: EcoRescue.Partners_t5x93h.png, alt: EcoRescue partners }
video:
  type: video
  src: EcoRescue.Video.mov
  alt: EcoRescue gameplay video
blocks:
  - title: Research partner
    body: |
      Researcher: Naima Gradi
      Position: PhD Fellow

      Professor: Daphne Bavelier
      Affiliation: University of Geneva — Professor of Brain & Cognitive Sciences · ERC Synergy grant holder

      Professor: Swann Pichon
      Affiliation: HES-SO
  - title: Objectives
    body: |
      Action game for adolescents, built for a University of Geneva anxiety study funded by the SNSF and the European Research Council. Players depollute planets across galaxies — the gameplay data feeds longitudinal research on anxiety and attention.

      The research hypothesis: fast-paced, positive-valence gameplay could measurably reduce anxiety and improve attention in adolescents over a multi-week intervention. My team at FCBG built the game and the data collection layer — the researchers designed the protocol and interpreted the results.
  - title: Tools & Technologies
    body: |
      Unity, C#, Shaders, HLSL
  - title: Funding
    body: |
      Swiss National Science Foundation grant (10001C_212812)
      European Research Council Synergy grant — The Self-Teaching Brain (810580)
---

The core tension: the game had to be genuinely fun for teenagers — or the intervention data would be meaningless. But every session also had to produce clean, structured behavioural records for a longitudinal study. Fun and measurement pull in opposite directions. Solving that meant designing gameplay loops where the data collection was invisible: timed events, accuracy tracking, and session metadata logged continuously without interrupting the experience.

Technically, this required a statistics and event system that captured task performance at the moment of action — not reconstructed from replay — and serialised it cleanly to formats the research team could ingest directly. Session integrity was non-negotiable: a crashed session with partial data is worse than no session at all.

The collaboration model with UNIGE and HES-SO shaped how we iterated. Researchers defined the measurement targets; my team at FCBG translated those into game mechanics and instrumentation. Every design decision had both a player rationale and a scientific one.
