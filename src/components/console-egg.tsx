"use client";

import { useEffect } from "react";
import { site } from "@velite";

// Prints once per page load (guarded against React's double-invoke in dev).
let printed = false;

const BRAIN = String.raw`
     _______
    /       \
   / /~\ /~\ \
  |  \_/ \_/  |
   \  ~~~~~  /
    \_______/
`;

export function ConsoleEgg() {
  useEffect(() => {
    if (printed) return;
    printed = true;

    const github = site.socials.find((s) => s.icon === "github")?.href;
    const violet = "color:#c49bff";

    console.log(`%c${BRAIN}`, `${violet};font-family:monospace`);
    console.log(
      "%cYou opened the console. That's the kind of curiosity I build for.",
      `${violet};font-size:13px;font-weight:600`,
    );
    console.log(
      `%c→ say hi: ${site.email}${github ? `   •   code: ${github}` : ""}`,
      "color:#9a9aa6;font-size:12px",
    );
  }, []);

  return null;
}
