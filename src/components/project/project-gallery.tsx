import { CldImage } from "@/components/cld";

type GalleryImage = { src: string; alt: string };

export function ProjectGallery({ images }: { images: GalleryImage[] }) {
  if (images.length === 0) return null;
  return (
    <div className="my-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {images.map((image) => (
        <div
          key={image.src}
          className="bg-muted overflow-hidden rounded-xl shadow-lg"
        >
          <CldImage
            src={image.src}
            alt={image.alt}
            width={1080}
            height={608}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="h-full w-full object-cover"
          />
        </div>
      ))}
    </div>
  );
}
