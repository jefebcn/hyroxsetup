import type { Metadata } from "next";
import Prose from "@/components/Prose";
import { SITE } from "@/lib/site";
import { formatPrice } from "@/lib/format";

export const metadata: Metadata = {
  title: "Shipping & Returns",
  description: "How WALL BUY ships, and our returns & refund policy.",
};

export default function ShippingReturnsPage() {
  return (
    <Prose title="Shipping & Returns" updated="September 2026">
      <h2>Processing time</h2>
      <p>
        Each piece is made to order. Orders are typically produced and dispatched
        within 2–5 business days.
      </p>

      <h2>Shipping & delivery</h2>
      <p>
        We ship worldwide from {SITE.shipsFrom}. Standard shipping is{" "}
        {formatPrice(SITE.flatShippingCents)}, and{" "}
        <strong>free on orders over {formatPrice(SITE.freeShippingOverCents)}</strong>.
        Estimated delivery is 3–10 business days depending on destination. A
        tracking link is emailed as soon as your order ships. Because orders ship
        from the UAE, any customs duties or import taxes charged by the
        destination country are the customer&rsquo;s responsibility and are not
        included in the price or shipping.
      </p>

      <h2>Right of withdrawal (EU)</h2>
      <p>
        If you are a consumer in the EU, you have the right to withdraw from your
        purchase within <strong>14 days</strong> of receiving your order, without
        giving any reason. To exercise it, email us at{" "}
        <a href={`mailto:${SITE.supportEmail}`}>{SITE.supportEmail}</a> before the
        14-day period expires.
      </p>

      <h2>Returns</h2>
      <p>
        Items must be returned unused and in their original packaging. Return
        shipping costs are the customer&rsquo;s responsibility unless the item
        arrived damaged or faulty. Once we receive and inspect the return, we
        refund the original payment method within 14 days.
      </p>

      <h2>Damaged or faulty items</h2>
      <p>
        Neon is fragile — we pack carefully, but if your piece arrives damaged or
        develops a fault, contact us within 48 hours of delivery with photos and
        we&rsquo;ll arrange a free replacement or full refund.
      </p>

    </Prose>
  );
}
