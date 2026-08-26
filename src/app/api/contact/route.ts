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
