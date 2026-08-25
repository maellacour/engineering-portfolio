"use client";

// next-cloudinary ships no "use client" directive but its components use React
// hooks, so they must sit behind a client boundary. Re-export them here and
// import from this module everywhere instead of from "next-cloudinary" directly.
export { CldImage, CldVideoPlayer } from "next-cloudinary";
