import type { Metadata, Viewport } from "next";
import "./globals.css";
import { SITE_URL } from "@/lib/data";
import SWRegister from "@/components/SWRegister";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "OfiMatch: electricistas, gasfiteros, albañiles y soldadores en Lima",
    template: "%s | OfiMatch",
  },
  description:
    "OfiMatch conecta a clientes con trabajadores de oficios cercanos en Lima: electricistas, gasfiteros, albañiles y soldadores con reputación verificada en dos vías.",
  applicationName: "OfiMatch",
  keywords: ["OfiMatch", "electricista Lima", "gasfitero Lima", "albañil Lima", "soldador Lima", "oficios", "técnicos a domicilio"],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "es_PE",
    siteName: "OfiMatch",
    url: SITE_URL,
    title: "OfiMatch: el técnico de confianza más cerca de ti",
    description: "Pide un electricista, gasfitero, albañil o soldador en Lima. Match por cercanía, urgencia y reputación.",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "OfiMatch" }],
  },
  twitter: { card: "summary_large_image", images: ["/og.png"] },
  icons: {
    icon: [{ url: "/icons/icon.svg", type: "image/svg+xml" }, { url: "/icons/icon-192.png", sizes: "192x192" }],
    apple: "/icons/apple-touch-icon.png",
  },
  appleWebApp: { capable: true, title: "OfiMatch", statusBarStyle: "default" },
  verification: process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION ? { google: process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION } : undefined,
};

export const viewport: Viewport = {
  themeColor: "#13295a",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es-PE">
      <body>
        {children}
        <SWRegister />
      </body>
    </html>
  );
}
