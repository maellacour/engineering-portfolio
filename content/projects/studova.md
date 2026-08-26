---
title: Studova
description: "A SaaS platform I built from scratch for research teams to design, deploy, and analyse cognitive and behavioural studies. Visual flow editor, dynamic data schemas, multi-tenant architecture."
cover: Studova-hero_p7swln.png
date: 2024
publishDate: 2025
tag: "SaaS · Full-Stack · Research Tooling"
featured: true
order: 1
challengeTitle: Challenge
status: >-
  An early-stage SaaS I'm building for research-study management.
gallery:
  - { src: 01-landing.png, alt: Tasks Overview }
  - { src: 02-login.png, alt: Flow Designer }
  - { src: 03-team-settings.png, alt: Participants Overview }
  - { src: 04-flow-editor.png, alt: Progressions Overview }
  - { src: 05-participants.png, alt: Results Overview }
  - { src: 06-results.png, alt: Participant Dashboard }
  - { src: 07-tasks.png, alt: Tasks Overview }
  - {
      src: 08-participant-dashboard-settings.png,
      alt: Participant Dashboard Settings,
    }
  - { src: 09-progressions.png, alt: Progressions Overview }
blocks:
  - title: Project Type
    body: |
      Personal SaaS Platform
      Research & Development
  - title: Try it out
    body: |
      [Launch Demo](https://studova.vercel.app) 🚀
  - title: Objectives
    body: |
      A SaaS platform I built from scratch for research teams to design, deploy, and analyse cognitive and behavioural studies. Visual flow editor, dynamic data schemas, multi-tenant architecture.

      It fills the gap between generic survey tools and bespoke lab software — a structured, collaborative environment researchers can configure without writing code.
  - title: Tools & Technologies
    body: |
      **Frontend:** Next.js, React, TypeScript, Tailwind CSS, DaisyUI
      **Backend:** Next.js API Routes, Prisma ORM, PostgreSQL
      **Infrastructure:** Neon, Vercel, Docker
  - title: Project Metrics
    body: |
      - **Lines of Code**: ~15,000+ TypeScript/React
      - **Components**: 100+ reusable UI components
      - **API Endpoints**: 40+ RESTful endpoints
      - **Database Models**: 20+ Prisma models with relationships
      - **Translation Keys**: 200+ across 8 namespaces
      - **Documentation**: 15+ technical guides (10,000+ words)
      - **Performance**: < 500ms average API response time
---

The core problem: research studies have wildly different shapes. A cognitive test, a survey battery, and a longitudinal tracking protocol share almost no structure. The platform had to enforce reproducibility without constraining what a researcher could design.

Three decisions defined the architecture.

**Graph-based flow engine.** Study workflows aren't linear — they branch, randomise, and loop. I implemented a directed graph using FlowElements and FlowLinks, with a traversal algorithm that validates path integrity from START to END before a study can launch. Any broken flow is caught at design time, not mid-session.

**Dynamic schema validation.** Each task type collects different data. A rigid relational model would require a migration for every new task. Instead, I combined typed ResultVariable models with PostgreSQL JSON columns and GIN indexing — type safety and query performance without the migration overhead. Zod schemas are generated at runtime from the stored metadata.

**Results visualisation with accessibility.** Displaying participant progress across arbitrary task sequences required ordering columns by flow position, not insertion order. I built a colour-coded and pattern system (colour for completed, hatched for pending) so the view works for colour-blind researchers. Small detail — high stakes in a clinical context.

It proved that a solo engineer can ship a production-grade research tool, if the architecture decisions are right from day one.
