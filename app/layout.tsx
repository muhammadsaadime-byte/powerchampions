import type { Metadata, Viewport } from "next";
import { Exo } from "next/font/google";
import { Suspense } from "react";
import { Providers } from "@/components/providers";
import { Analytics } from "@/components/site/analytics";
import { OrgJsonLd } from "@/components/site/org-json-ld";
import { ThemeScript } from "@/components/site/theme-script";
import { SiteFooter } from "@/components/site/site-footer";
import { SiteHeader } from "@/components/site/site-header";
import "./globals.css";

// Exo is a variable font: one file covers the 400/500/700 weights the brand uses.
const exo = Exo({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-exo",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.power-champions.com"),
  title: {
    default: "Generator Service Providers | PowerChampions",
    template: "%s | PowerChampions",
  },
  description:
    "PowerChampions is redefining industrial critical power through servant leadership, integrity, and a trusted national network of partners.",
  openGraph: { type: "website", siteName: "PowerChampions", locale: "en_US" },
  twitter: { card: "summary_large_image" },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#101010" },
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
  ],
  colorScheme: "dark light",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    // suppressHydrationWarning: <ThemeScript> may set data-theme on <html> before React hydrates.
    <html lang="en" className={exo.variable} suppressHydrationWarning>
      <body className="min-h-dvh antialiased">
        <ThemeScript />
        <OrgJsonLd />
        <Providers>
          <Suspense fallback={null}>
            <SiteHeader />
          </Suspense>
          {children}
          {/* Own Suspense boundary: hydrates separately from the page (see app/page.tsx). */}
          <Suspense fallback={null}>
            <SiteFooter />
          </Suspense>
        </Providers>
        <Analytics />
      </body>
    </html>
  );
}
