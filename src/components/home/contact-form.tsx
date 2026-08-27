"use client";

import { useState } from "react";
import Script from "next/script";
import { Send, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

type Status = "idle" | "submitting" | "success" | "error";

const turnstileSiteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

const fieldClass =
  "w-full rounded-lg border border-border/60 bg-background/40 px-3.5 py-2.5 text-sm outline-none transition-colors placeholder:text-muted-foreground/70 focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/30";

export function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form));
    if (data.company) return; // honeypot tripped, silently drop
    setStatus("submitting");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
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
      <div className="border-primary/30 bg-primary/5 flex flex-col items-center justify-center rounded-2xl border p-8 text-center">
        <span className="bg-primary/15 text-primary flex size-12 items-center justify-center rounded-full">
          <Check className="size-6" />
        </span>
        <p className="mt-4 font-medium">Thanks, message sent.</p>
        <p className="text-muted-foreground mt-1 text-sm">
          I&apos;ll get back to you soon.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      {/* honeypot */}
      <input
        type="text"
        name="company"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden
        className="hidden"
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className="mb-1.5 block text-sm font-medium">
            Name
          </label>
          <input
            id="name"
            name="name"
            required
            maxLength={100}
            autoComplete="name"
            className={fieldClass}
            placeholder="Your name"
          />
        </div>
        <div>
          <label htmlFor="email" className="mb-1.5 block text-sm font-medium">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            maxLength={200}
            autoComplete="email"
            className={fieldClass}
            placeholder="you@example.com"
          />
        </div>
      </div>

      <div>
        <label htmlFor="message" className="mb-1.5 block text-sm font-medium">
          Message
        </label>
        <textarea
          id="message"
          name="message"
          required
          maxLength={5000}
          rows={5}
          className={`${fieldClass} resize-y`}
          placeholder="What would you like to talk about?"
        />
      </div>

      {turnstileSiteKey && (
        <>
          <Script
            src="https://challenges.cloudflare.com/turnstile/v0/api.js"
            async
            defer
          />
          <div
            className="cf-turnstile"
            data-sitekey={turnstileSiteKey}
            data-theme="auto"
          />
        </>
      )}

      <div className="flex items-center gap-4">
        <Button type="submit" size="lg" disabled={status === "submitting"}>
          <Send className="size-4" />
          {status === "submitting" ? "Sending…" : "Send message"}
        </Button>
        {status === "error" && (
          <p className="text-destructive text-sm">
            Something went wrong. Try again, or email me directly.
          </p>
        )}
      </div>
    </form>
  );
}
