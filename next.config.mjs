// Run Velite as part of `next dev` / `next build` (works with Turbopack, which
// does not run webpack plugins). Guarded so it only starts once per process.
// This file is .mjs rather than .ts because Next loads .ts config via require(),
// which cannot handle the top-level await used below.
const isDev = process.argv.includes("dev");
const isBuild = process.argv.includes("build");
if (!process.env.VELITE_STARTED && (isDev || isBuild)) {
  process.env.VELITE_STARTED = "1";
  const { build } = await import("velite");
  await build({ watch: isDev, clean: !isDev });
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [{ protocol: "https", hostname: "res.cloudinary.com" }],
  },
};

export default nextConfig;
