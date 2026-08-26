import { NextResponse } from "next/server";
import { Resend } from "resend";
import { site } from "@velite";

export async function POST(req: Request) {
  let data: Record<string, unknown>;
  try {
    data = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  const { name, email, message, company } = data;
  if (company) return NextResponse.json({ ok: true }); // honeypot tripped

  if (
    typeof name !== "string" ||
    typeof email !== "string" ||
    typeof message !== "string" ||
    !name.trim() ||
    !message.trim() ||
    !email.includes("@")
  ) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  // Bound the payload so it can't be used to send huge emails.
  if (name.length > 100 || email.length > 200 || message.length > 5000) {
    return NextResponse.json({ error: "Too long" }, { status: 400 });
  }

  // Crude link-spam heuristic: silently drop messages stuffed with links.
  if ((message.match(/https?:\/\//gi) ?? []).length > 4) {
    console.warn("[contact] dropped likely spam", { email });
    return NextResponse.json({ ok: true });
  }

  // Cloudflare Turnstile — verify the token when a secret is configured.
  const turnstileSecret = process.env.TURNSTILE_SECRET_KEY;
  if (turnstileSecret) {
    const token = data["cf-turnstile-response"];
    if (typeof token !== "string" || !token) {
      return NextResponse.json({ error: "Captcha required" }, { status: 400 });
    }
    const verify = await fetch(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({ secret: turnstileSecret, response: token }),
      },
    );
    const outcome = (await verify.json()) as { success?: boolean };
    if (!outcome.success) {
      return NextResponse.json({ error: "Captcha failed" }, { status: 400 });
    }
  }

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO ?? site.email;
  // Resend's shared test sender works before you verify a domain (it only
  // delivers to your Resend account address). Set CONTACT_FROM to a verified
  // address to send anywhere / from your own domain.
  const from = process.env.CONTACT_FROM ?? "Portfolio <onboarding@resend.dev>";

  if (!apiKey) {
    // Not configured yet — log so it's visible in the server logs, don't 500.
    console.warn("[contact] RESEND_API_KEY not set; submission not emailed", {
      name,
      email,
    });
    return NextResponse.json({ ok: true });
  }

  const resend = new Resend(apiKey);
  const { error } = await resend.emails.send({
    from,
    to,
    replyTo: email,
    subject: `Portfolio contact from ${name}`,
    text: `From: ${name} <${email}>\n\n${message}`,
  });

  if (error) {
    console.error("[contact] Resend error", error);
    return NextResponse.json({ error: "Send failed" }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
