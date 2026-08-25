import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";

export default function NotFound() {
  return (
    <section className="flex flex-col items-center justify-center py-32 text-center">
      <p className="text-primary text-sm font-semibold">404</p>
      <h1 className="font-display mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
        Page not found
      </h1>
      <p className="text-muted-foreground mt-3">
        This page doesn&apos;t exist or has moved.
      </p>
      <Link href="/" className={`${buttonVariants()} mt-8`}>
        Back home
      </Link>
    </section>
  );
}
