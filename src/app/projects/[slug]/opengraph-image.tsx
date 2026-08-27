import { ImageResponse } from "next/og";
import { projects } from "@velite";

export const alt = "Project · Maël Lacour";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);

  return new ImageResponse(
    <div
      style={{
        height: "100%",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "80px",
        background: "linear-gradient(135deg, #111827 0%, #312e81 100%)",
        color: "white",
        fontFamily: "sans-serif",
      }}
    >
      <div style={{ display: "flex", fontSize: 30, opacity: 0.8 }}>
        {project?.tag ?? "Maël Lacour"}
      </div>
      <div
        style={{
          display: "flex",
          fontSize: 76,
          fontWeight: 700,
          lineHeight: 1.1,
        }}
      >
        {project?.title ?? "Maël Lacour"}
      </div>
      <div
        style={{
          display: "flex",
          fontSize: 28,
          opacity: 0.75,
          maxWidth: "1000px",
        }}
      >
        {project?.description ?? ""}
      </div>
    </div>,
    size,
  );
}
