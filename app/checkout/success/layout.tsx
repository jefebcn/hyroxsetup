import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Order Confirmed",
  description: "Your WALL BUY order is confirmed.",
  robots: { index: false },
};

export default function SuccessLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
