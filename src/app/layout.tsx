import type { Metadata } from "next";
import { DM_Sans, Space_Grotesk, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { defaultLocale } from "@/lib/i18n";
import { ThemeProvider } from "@/components/theme-provider";
import { BackgroundMesh } from "@/components/background-mesh";
import { ConsoleEgg } from "@/components/console-egg";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";

const dmSans = DM_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-display",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
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
        className={`${dmSans.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable} antialiased`}
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
