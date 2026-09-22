"use client";

import { useState } from "react";
import { Check, Send } from "lucide-react";
import { Button } from "@/components/ui/button";

type Status = "idle" | "submitting" | "success" | "error";

const fieldClass =
  "w-full rounded-lg border border-border/60 bg-background/40 px-3.5 py-2.5 text-sm outline-none transition-colors placeholder:text-muted-foreground/70 focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/30";

// Optional, low-friction capture for the few warm contacts who'd rather I reach
// out. Reuses the existing /api/contact (Resend) endpoint, which needs a
// message, so we synthesise one. LinkedIn stays the primary recontact channel.
export function CardCapture() {
  const [status, setStatus] = useState<Status>("idle");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const { name, email } = Object.fromEntries(new FormData(form));
    setStatus("submitting");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          message: "Shared their details from the digital card.",
        }),
      });
      if (!res.ok) throw new Error();
      setStatus("success");
      form.reset();
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="border-primary/30 bg-primary/5 text-muted-foreground flex items-center justify-center gap-2 rounded-2xl border p-4 text-sm">
        <Check className="text-primary size-4" />
        Got it, I&apos;ll be in touch.
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-3">
      <div className="grid gap-3 sm:grid-cols-2">
        <input
          name="name"
          required
          maxLength={100}
          autoComplete="name"
          className={fieldClass}
          placeholder="Your name"
          aria-label="Your name"
        />
        <input
          name="email"
          type="email"
          required
          maxLength={200}
          autoComplete="email"
          className={fieldClass}
          placeholder="you@example.com"
          aria-label="Your email"
        />
      </div>
      <div className="flex items-center gap-3">
        <Button type="submit" size="lg" disabled={status === "submitting"}>
          <Send className="size-4" />
          {status === "submitting" ? "Sending…" : "Send it to me"}
        </Button>
        {status === "error" && (
          <p className="text-destructive text-sm">Try again in a moment.</p>
        )}
      </div>
    </form>
  );
}
