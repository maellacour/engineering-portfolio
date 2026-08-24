---
title: NeuroTrainer
description: "VR tool for neurosurgeons and radiologists at HUG to explore MRI and CT volumes in real time. Custom HLSL shader for 3D texture rendering; streaming architecture to handle 100 GB+ datasets without VR latency."
cover: neurotrainer.1_ozaifn.png
date: 2022
publishDate: 2022
tag: "VR · Unity · Medical Imaging"
featured: true
order: 2
challengeTitle: Challenge
gallery:
  - { src: neurotrainer.1_ozaifn.png, alt: NeuroTrainer 1 }
  - { src: neurotrainer.2_csyefm.png, alt: NeuroTrainer 2 }
  - { src: neurotrainer.3_rlyxbc.png, alt: NeuroTrainer 3 }
video:
  type: video
  src: NeuroTrainer-resized_ui8ak9.mp4
blocks:
  - title: Clinical partner
    body: |
      Researcher: Daniel Kiss
      Affiliation: HUG — Hôpitaux Universitaires de Genève
  - title: Objectives
    body: |
      VR tool for neurosurgeons and radiologists at HUG to explore MRI and CT volumes in real time. Custom HLSL shader for 3D texture rendering; streaming architecture to handle 100 GB+ datasets without VR latency.

      The clinical workflow before this tool required radiologists to interpret flat 2D slices on standard monitors. In VR, the same data becomes navigable in three dimensions — changing both how anatomy is taught and how surgical approaches are planned.
  - title: Tools & Technologies
    body: |
      Unity, C#, Shaders, HLSL
---

Two problems defined this project.

**Rendering MRI volumes in VR.** MRI and CT data isn't a stack of images — it's a 3D texture that needs to be sampled along arbitrary ray paths in real time. No standard Unity shader handles this. I wrote a custom HLSL shader that performs direct volume rendering: ray-casting through the 3D texture, compositing density values into colour, and mapping transfer functions for contrast. Getting it to run at 90 fps in VR, on hardware a hospital could actually buy, required careful optimisation of the sampling step and early-exit conditions.

**Streaming datasets without lag.** A single MRI scan can exceed 100 GB. Loading it into memory isn't an option in VR — a frame drop at the wrong moment causes immediate nausea. I built a streaming architecture that loads volumetric slabs on demand, pre-fetching the next region by spatial proximity before it's needed. The result: continuous navigation through the full dataset with no perceptible load stutter.

Building for VR in a clinical context taught me something about constraints: the hardware ceiling is low, the tolerance for error is zero, and the people using it have no patience for UX that gets in the way of their work.
