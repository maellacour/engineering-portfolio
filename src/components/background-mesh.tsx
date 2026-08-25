"use client";

import { useEffect, useRef } from "react";

// The signature element: an accent-hued mesh glow that tracks the cursor on desktop.
// On touch devices and under prefers-reduced-motion it stays in its resting
// position (a soft glow behind the hero), so it never depends on a pointer.
export function BackgroundMesh() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const fine = window.matchMedia("(pointer: fine)").matches;
    if (reduce || !fine) return;

    let frame = 0;
    const onMove = (e: PointerEvent) => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        el.style.setProperty(
          "--mx",
          `${(e.clientX / window.innerWidth) * 100}%`,
        );
        el.style.setProperty(
          "--my",
          `${(e.clientY / window.innerHeight) * 100}%`,
        );
      });
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", onMove);
    };
  }, []);

  return <div ref={ref} aria-hidden className="bg-mesh" />;
}
