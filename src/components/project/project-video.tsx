"use client";

import { CldVideoPlayer } from "@/components/cld";

export function ProjectVideo({ src }: { src: string }) {
  return (
    <div className="my-12">
      <h2 className="font-display mb-6 text-2xl font-bold tracking-tight">
        Watch the video
      </h2>
      <div className="overflow-hidden rounded-xl">
        <CldVideoPlayer src={src} width={1920} height={1080} />
      </div>
    </div>
  );
}
