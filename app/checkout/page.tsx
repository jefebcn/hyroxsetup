import type { Metadata } from "next";
import { isSumUpConfigured } from "@/lib/sumup";
import { isPayPalConfigured } from "@/lib/paypal";
import CheckoutClient from "./CheckoutClient";

export const metadata: Metadata = {
  title: "Checkout",
  robots: { index: false },
};

export default function CheckoutPage() {
  return (
    <CheckoutClient
      sumupEnabled={isSumUpConfigured}
      paypalEnabled={isPayPalConfigured}
    />
  );
}
