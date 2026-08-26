---
title: HarMoNie
description: "Mobile app for the Haute École de Musique de Genève — multilingual health education for musicians. Prereq-gated lessons, interactive quizzes, photo and video content across FR/EN/DE. Built with Flutter."
cover: harmonie-hero.png
date: 2025
publishDate: 2025
tag: "Mobile · Flutter · Education"
featured: true
order: 3
challengeTitle: Challenge
status: >-
  Commissioned by the Haute École de Musique de Genève and shipped to its
  students — health education taken from research protocol to a released app.
gallery:
  - { src: harmonie-hero.png, alt: HarMoNie Logo }
  - { src: harmonie-activities.png, alt: HarMoNie Activities }
blocks:
  - title: Partners
    body: |
      Haute École de Santé de Genève
      Haute École de Musique de Genève
  - title: Objectives
    body: |
      Mobile app for the Haute École de Musique de Genève — multilingual health education for musicians. Prereq-gated lessons, interactive quizzes, photo and video content across FR/EN/DE. Built with Flutter.

      Musicians face specific occupational health risks — hearing damage, repetitive strain, performance anxiety — that general health resources don't address. HarMoNie gives students a structured, self-paced path through that content, commissioned directly by the HEM faculty.
  - title: Tools & Technologies
    body: |
      Flutter, Dart, Markdown, Figma, GitHub
---

The content architecture was the first challenge. Health education for musicians spans multiple topics, each with prerequisites — you don't explain hearing protection before you've established how sound damages tissue. I built a prerequisite graph over the lesson structure so students are only unlocked the content they're ready for, in the right sequence, regardless of language.

Localising across French, English, and German meant every piece of content — text, images, embedded video — had to be managed in parallel. I designed a Markdown-based content system that keeps translations co-located and makes it straightforward for non-developers at HEM to update material without touching code.

The second challenge was engagement. Musicians aren't patients — they don't respond to clinical tone or passive reading. I built game-like features into the learning flow: "spot the 7 errors" exercises and quiz modules that give immediate feedback. The goal was to make the health content feel like part of their craft education, not a compliance requirement.
