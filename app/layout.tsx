import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "HYROX San Marino — 3D Event Map",
  description:
    "Interactive 3D map viewer for the HYROX competition at Multieventi Sport Domus, Republic of San Marino. Visualize the running loop, indoor arena, and outdoor power village.",
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
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
