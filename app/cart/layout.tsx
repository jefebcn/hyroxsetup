import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Your Cart",
  description: "Review your WALL BUY loadout and check out securely.",
  robots: { index: false },
};

export default function CartLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
