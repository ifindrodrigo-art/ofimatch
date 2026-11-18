import type { Metadata, Viewport } from "next";
import "./globals.css";
import { SITE_URL } from "@/lib/data";
import SWRegister from "@/components/SWRegister";
import { IconSprite } from "@/components/site/Icons";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "OfiMatch: técnicos de oficio cerca de ti en Lima",
    template: "%s | OfiMatch",
  },
  description:
    "Pide electricistas, gasfiteros, albañiles, soldadores, pintores, carpinteros, cerrajeros, técnicos de aire acondicionado y drywall cerca de ti en Lima, con precio desde, fotos de trabajos y reputación en dos vías.",
  applicationName: "OfiMatch",
  keywords: ["OfiMatch", "electricista Lima", "gasfitero Lima", "albañil Lima", "soldador Lima", "pintor Lima", "cerrajero Lima", "técnicos a domicilio"],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "es_PE",
    siteName: "OfiMatch",
    url: SITE_URL,
    title: "OfiMatch: el técnico de confianza más cerca de ti",
    description: "Técnicos de 9 oficios cerca de ti en Lima, ordenados por cercanía, urgencia y reputación.",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "OfiMatch" }],
  },
  twitter: { card: "summary_large_image", images: ["/og.png"] },
  icons: {
    icon: [{ url: "/icons/icon.svg", type: "image/svg+xml" }, { url: "/icons/icon-192.png", sizes: "192x192" }],
    apple: "/icons/apple-touch-icon.png",
  },
  appleWebApp: { capable: true, title: "OfiMatch", statusBarStyle: "default" },
  verification: { google: process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION || "JI0NC3XPPuGPMPFjiAJ6tv9TiZgnjUzIRBBUZY_17u4" },
};

export const viewport: Viewport = {
  themeColor: "#07122b",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es-PE">
      <body>
        <IconSprite />
        {children}
        <SWRegister />
      </body>
    </html>
  );
}
