import { NextResponse } from "next/server";

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

  // TODO: wire an email provider (Resend, or a form service). For now the
  // submission is logged to the server so it appears in the Vercel function
  // logs — it is not yet delivered by email.
  console.log("[contact]", { name, email, message });

  return NextResponse.json({ ok: true });
}
