import { site } from "@velite";

// Serves a downloadable vCard (.vcf) built from content/site.yml, so contact
// details stay editable without touching code. Static: it depends only on
// build-time content, never on the request.
export const dynamic = "force-static";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.maellacour.com";

function findSocial(icon: "linkedin" | "github") {
  return site.socials.find((s) => s.icon === icon)?.href;
}

export function GET() {
  const { card, email } = site;
  const [given, ...rest] = card.name.split(" ");
  const family = rest.join(" ");
  const [city, country] = card.location.split(",").map((s) => s.trim());
  const linkedin = findSocial("linkedin");
  const github = findSocial("github");

  // vCard 3.0: the widest-supported version across iOS and Android. Labelled
  // URLs use the Apple item-grouping convention so LinkedIn/GitHub show named.
  const lines = [
    "BEGIN:VCARD",
    "VERSION:3.0",
    `N:${family};${given};;;`,
    `FN:${card.name}`,
    `ORG:${card.org}`,
    `TITLE:${card.role}`,
    `EMAIL;TYPE=INTERNET,WORK:${email}`,
    `ADR;TYPE=WORK:;;;${city ?? ""};;;${country ?? ""}`,
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

  return new Response(body, {
    headers: {
      "Content-Type": "text/vcard; charset=utf-8",
      "Content-Disposition": 'attachment; filename="Mael-Lacour.vcf"',
    },
  });
}
