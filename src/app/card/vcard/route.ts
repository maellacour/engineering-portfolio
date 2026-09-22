import { site } from "@velite";

// Serves a downloadable vCard (.vcf) built from content/site.yml, so contact
// details stay editable without touching code. Static: it depends only on
// build-time content, never on the request.
export const dynamic = "force-static";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.maellacour.com";

// Escape a text value for vCard 3.0 (RFC 2426): backslash first, then the
// structural characters and newlines. Content in site.yml is free-form, so a
// comma or semicolon must not be read as vCard syntax.
function esc(value: string) {
  return value
    .replace(/\\/g, "\\\\")
    .replace(/\n/g, "\\n")
    .replace(/,/g, "\\,")
    .replace(/;/g, "\\;");
}

function findSocial(icon: "linkedin" | "github") {
  return site.socials.find((s) => s.icon === icon)?.href;
}

export function GET() {
  const { card, email } = site;

  // Best-effort structured name: last token is the family name, the rest is the
  // given name. FN below always carries the exact display name regardless.
  const nameParts = card.name.trim().split(/\s+/);
  const family = nameParts.length > 1 ? nameParts.at(-1)! : "";
  const given =
    nameParts.length > 1 ? nameParts.slice(0, -1).join(" ") : card.name;

  // Location as "Locality, [Region, ...,] Country"; any middle parts fold into
  // the region slot so a third component isn't dropped.
  const loc = card.location.split(",").map((s) => s.trim());
  const locality = loc[0] ?? "";
  const country = loc.length > 1 ? loc.at(-1)! : "";
  const region = loc.length > 2 ? loc.slice(1, -1).join(", ") : "";

  const linkedin = findSocial("linkedin");
  const github = findSocial("github");

  // vCard 3.0: the widest-supported version across iOS and Android. Labelled
  // URLs use the Apple item-grouping convention so LinkedIn/GitHub show named.
  const lines = [
    "BEGIN:VCARD",
    "VERSION:3.0",
    `N:${esc(family)};${esc(given)};;;`,
    `FN:${esc(card.name)}`,
    `ORG:${esc(card.org)}`,
    `TITLE:${esc(card.role)}`,
    `EMAIL;TYPE=INTERNET,WORK:${esc(email)}`,
    `ADR;TYPE=WORK:;;;${esc(locality)};${esc(region)};;${esc(country)}`,
    `URL:${SITE_URL}`,
  ];

  let item = 0;
  if (linkedin) {
    item += 1;
    lines.push(`item${item}.URL:${linkedin}`, `item${item}.X-ABLabel:LinkedIn`);
  }
  if (github) {
    item += 1;
    lines.push(`item${item}.URL:${github}`, `item${item}.X-ABLabel:GitHub`);
  }
  lines.push("END:VCARD");

  const body = lines.join("\r\n");

  // Filename tracks the name, ASCII-folded (drop the combining marks NFKD
  // splits off, then any non-alphanumeric) so the header stays plain ASCII.
  const filename =
    Array.from(card.name.normalize("NFKD"))
      .filter((c) => c.charCodeAt(0) < 128)
      .join("")
      .replace(/[^a-zA-Z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") || "contact";

  return new Response(body, {
    headers: {
      "Content-Type": "text/vcard; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}.vcf"`,
    },
  });
}
