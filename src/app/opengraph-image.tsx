import { ImageResponse } from "next/og";
import { home } from "@velite";

export const alt = "Maël Lacour";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
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
      <div style={{ display: "flex", fontSize: 34, opacity: 0.8 }}>
        Maël Lacour
      </div>
      <div
        style={{
          display: "flex",
          fontSize: 68,
          fontWeight: 700,
          lineHeight: 1.1,
          maxWidth: "900px",
        }}
      >
        {home.title}
      </div>
      <div
        style={{
          display: "flex",
          fontSize: 30,
          opacity: 0.75,
          maxWidth: "900px",
        }}
      >
        {home.description}
      </div>
    </div>,
    size,
  );
}
