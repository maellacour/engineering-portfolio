import type { Metadata } from "next";
import {
  Space_Grotesk,
  Bricolage_Grotesque,
  Space_Mono,
} from "next/font/google";
import "./globals.css";
import { defaultLocale } from "@/lib/i18n";
import { ThemeProvider } from "@/components/theme-provider";
import { BackgroundMesh } from "@/components/background-mesh";
import { ConsoleEgg } from "@/components/console-egg";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";

const bricolageGrotesque = Bricolage_Grotesque({
  variable: "--font-sans",
  subsets: ["latin"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-display",
  subsets: ["latin"],
});

const spaceMono = Space_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  ),
  title: { default: "Maël Lacour", template: "%s · Maël Lacour" },
  openGraph: { type: "website", siteName: "Maël Lacour", locale: "en" },
  twitter: { card: "summary_large_image" },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang={defaultLocale} suppressHydrationWarning>
      <body
        className={`${bricolageGrotesque.variable} ${spaceGrotesk.variable} ${spaceMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <BackgroundMesh />
          <ConsoleEgg />
          <div className="relative z-10 mx-auto flex min-h-dvh max-w-6xl flex-col px-5 sm:px-8">
            <SiteHeader />
            <main className="flex-1 pt-24">{children}</main>
            <SiteFooter />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
