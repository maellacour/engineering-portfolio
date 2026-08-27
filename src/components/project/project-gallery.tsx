"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { CldImage } from "@/components/cld";

type GalleryImage = { src: string; alt: string };

export function ProjectGallery({ images }: { images: GalleryImage[] }) {
  const [index, setIndex] = useState<number | null>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const restoreRef = useRef<HTMLElement | null>(null);

  const close = useCallback(() => setIndex(null), []);
  const step = useCallback(
    (dir: number) =>
      setIndex((i) =>
        i === null ? i : (i + dir + images.length) % images.length,
      ),
    [images.length],
  );

  // While the lightbox is open: keyboard controls, scroll lock, and focus
  // management (move focus in, restore it on close).
  useEffect(() => {
    if (index === null) return;
    restoreRef.current = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      else if (e.key === "ArrowRight") step(1);
      else if (e.key === "ArrowLeft") step(-1);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
      restoreRef.current?.focus?.();
    };
  }, [index, close, step]);

  if (images.length === 0) return null;

  const active = index === null ? null : images[index];

  return (
    <>
      <div className="my-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {images.map((image, i) => (
          <button
            key={image.src}
            type="button"
            onClick={() => setIndex(i)}
            aria-label={`Enlarge image: ${image.alt}`}
            className="group bg-muted focus-visible:ring-ring block cursor-zoom-in overflow-hidden rounded-xl shadow-lg focus-visible:ring-2 focus-visible:outline-none"
          >
            <CldImage
              src={image.src}
              alt={image.alt}
              width={1080}
              height={810}
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="aspect-[4/3] h-full w-full object-cover transition-transform duration-500 group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:scale-100"
            />
          </button>
        ))}
      </div>

      {active && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={active.alt}
          onClick={close}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-sm sm:p-8"
        >
          <button
            ref={closeRef}
            type="button"
            onClick={close}
            aria-label="Close"
            className="focus-visible:ring-ring absolute top-4 right-4 rounded-full bg-white/10 p-2 text-white transition-colors hover:bg-white/20 focus-visible:ring-2 focus-visible:outline-none"
          >
            <X className="size-5" />
          </button>

          {images.length > 1 && (
            <>
              <button
                type="button"
                aria-label="Previous image"
                onClick={(e) => {
                  e.stopPropagation();
                  step(-1);
                }}
                className="focus-visible:ring-ring absolute left-2 rounded-full bg-white/10 p-2 text-white transition-colors hover:bg-white/20 focus-visible:ring-2 focus-visible:outline-none sm:left-4"
              >
                <ChevronLeft className="size-6" />
              </button>
              <button
                type="button"
                aria-label="Next image"
                onClick={(e) => {
                  e.stopPropagation();
                  step(1);
                }}
                className="focus-visible:ring-ring absolute right-2 rounded-full bg-white/10 p-2 text-white transition-colors hover:bg-white/20 focus-visible:ring-2 focus-visible:outline-none sm:right-4"
              >
                <ChevronRight className="size-6" />
              </button>
            </>
          )}

          <figure
            onClick={(e) => e.stopPropagation()}
            className="flex max-h-full max-w-5xl flex-col items-center gap-3"
          >
            <CldImage
              src={active.src}
              alt={active.alt}
              width={1920}
              height={1440}
              sizes="100vw"
              className="max-h-[82vh] w-auto max-w-full rounded-lg object-contain"
            />
            <figcaption className="text-center text-sm text-white/70">
              {active.alt}
            </figcaption>
          </figure>
        </div>
      )}
    </>
  );
}
