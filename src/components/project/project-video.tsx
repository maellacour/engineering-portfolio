import { getCldImageUrl, getCldVideoUrl } from "next-cloudinary";

export function ProjectVideo({
  src,
  poster,
}: {
  src: string;
  poster?: string;
}) {
  // Cloudinary public IDs are stored without their container extension; strip
  // it so f_auto delivers a browser-friendly format (mp4/webm) rather than the
  // source container (e.g. .mov, which not every browser can play).
  const publicId = src.replace(/\.(mp4|mov|webm|m4v)$/i, "");

  return (
    <div className="my-12">
      <h2 className="font-display mb-6 text-2xl font-bold tracking-tight">
        Watch the video
      </h2>
      <video
        controls
        playsInline
        preload="metadata"
        poster={poster ? getCldImageUrl({ src: poster }) : undefined}
        src={getCldVideoUrl({ src: publicId })}
        className="aspect-video w-full rounded-xl bg-black"
      >
        Your browser does not support embedded video.
      </video>
    </div>
  );
}
