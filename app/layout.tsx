import type { Metadata, Viewport } from "next";
import { Space_Grotesk, Inter } from "next/font/google";
import "./globals.css";

const display = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-space",
  display: "swap",
});
const body = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-inter",
  display: "swap",
});
import { CartProvider } from "@/lib/cart-context";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";
import CookieBanner from "@/components/CookieBanner";
import TikTokPixel from "@/components/TikTokPixel";
import AnnouncementBar from "@/components/AnnouncementBar";
import BackToTop from "@/components/BackToTop";
import ScrollReveal from "@/components/ScrollReveal";
import JsonLd from "@/components/JsonLd";
import { ClerkProvider } from "@clerk/nextjs";
import { isClerkConfigured } from "@/lib/auth";
import { SITE, siteUrl } from "@/lib/site";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl()),
  title: {
    default: `${SITE.name} — ${SITE.tagline}`,
    template: `%s · ${SITE.name}`,
  },
  description: SITE.description,
  applicationName: SITE.name,
  keywords: [
    "Call of Duty",
    "Zombies",
    "neon sign",
    "LED wall art",
    "gaming room decor",
    "Ray Gun",
    "wall buy",
  ],
  openGraph: {
    title: `${SITE.name} — ${SITE.tagline}`,
    description: SITE.description,
    type: "website",
    siteName: SITE.name,
  },
  twitter: { card: "summary_large_image" },
};

export const viewport: Viewport = {
  themeColor: "#0a0a0b",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const base = siteUrl();
  const orgLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE.name,
    url: base,
    logo: `${base}/icons/icon-512.png`,
    image: `${base}/brand/wallbuy-logo.jpg`,
    description: SITE.description,
    email: SITE.supportEmail,
    sameAs: [SITE.socials.tiktok, SITE.socials.instagram],
  };
  const siteLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE.name,
    url: base,
    potentialAction: {
      "@type": "SearchAction",
      target: `${base}/shop?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };

  const tree = (
    <html lang="en" className={`${display.variable} ${body.variable}`}>
      <body className="flex min-h-screen flex-col">
        <JsonLd data={orgLd} />
        <JsonLd data={siteLd} />
        <TikTokPixel />
        <a
          href="#main"
          className="sr-only rounded-md bg-blood px-4 py-2 text-sm font-semibold text-white focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100]"
        >
          Skip to content
        </a>
        <CartProvider>
          <AnnouncementBar />
          <Header />
          <main id="main" className="flex-1">
            {children}
          </main>
          <Footer />
          <CartDrawer />
          <CookieBanner />
          <BackToTop />
          <ScrollReveal />
        </CartProvider>
      </body>
    </html>
  );

  // Only wrap in ClerkProvider when auth is configured, so the site runs
  // without Clerk keys. Dark appearance to match the brand.
  if (!isClerkConfigured) return tree;
  return (
    <ClerkProvider
      appearance={{
        variables: {
          colorPrimary: "#b8121f",
          colorBackground: "#101014",
          borderRadius: "0.6rem",
        },
      }}
    >
      {tree}
    </ClerkProvider>
  );
}
