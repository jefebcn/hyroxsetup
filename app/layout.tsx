import type { Metadata, Viewport } from "next";
import "./globals.css";

const title = "HYROX San Marino — 3D Event Map";
const description =
  "Interactive 3D map viewer for the HYROX competition at Multieventi Sport Domus, Republic of San Marino. Running loop, indoor arena, power village, station flow, weights and logistics.";

export const metadata: Metadata = {
  title,
  description,
  applicationName: "HYROX San Marino",
  keywords: [
    "HYROX",
    "San Marino",
    "Multieventi Sport Domus",
    "3D map",
    "Mapbox",
    "fitness race",
  ],
  openGraph: {
    title,
    description,
    type: "website",
    siteName: "HYROX San Marino",
    locale: "it_IT",
    alternateLocale: ["en_US"],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#0a0a0a",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="it">
      <body>{children}</body>
    </html>
  );
}
