import type { Metadata } from "next";
import Prose from "@/components/Prose";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "The terms that apply when you shop at WALL BUY.",
};

export default function TermsPage() {
  return (
    <Prose title="Terms of Service" updated="September 2026">
      <p>
        These Terms govern your use of {SITE.url} and your purchases from{" "}
        {SITE.company.legalName} (&ldquo;WALL BUY&rdquo;). By placing an order you
        agree to them.
      </p>

      <h2>Products</h2>
      <p>
        Our products are original, hand-made neon art. Because each piece is made
        by hand, small variations in shape and glow are normal and not defects.
        Colours may vary slightly from screen to screen.
      </p>

      <h2>Orders & pricing</h2>
      <p>
        All prices are in {SITE.currency} and include applicable VAT unless stated
        otherwise. We may correct obvious pricing errors and cancel affected
        orders with a full refund. An order is accepted once payment is confirmed.
      </p>

      <h2>Payment</h2>
      <p>
        Payments are processed securely by Stripe. We do not store your card
        details.
      </p>

      <h2>Shipping & returns</h2>
      <p>
        See our <a href="/shipping-returns">Shipping &amp; Returns</a> policy,
        which forms part of these Terms.
      </p>

      <h2>Intellectual property & trademarks</h2>
      <p>
        WALL BUY is an independent brand and is not affiliated with, endorsed by,
        or sponsored by Activision Publishing, Inc. &ldquo;Call of Duty&rdquo; and
        &ldquo;Zombies&rdquo; are trademarks of their respective owners. Our
        designs are original neon interpretations sold as fan-inspired art. Our
        own branding, images and content may not be reused without permission.
      </p>

      <h2>Liability</h2>
      <p>
        Our products are decorative. Install and power them according to the
        included instructions. To the extent permitted by law, our liability is
        limited to the amount you paid for the affected product. Nothing in these
        Terms limits your statutory consumer rights.
      </p>

      <h2>Governing law</h2>
      <p>
        These Terms are governed by the laws of {SITE.company.country}. Mandatory
        consumer-protection rules of your country of residence still apply.
      </p>

      <p className="text-xs">
        Template only — review with a professional and complete the company
        details before launch.
      </p>
    </Prose>
  );
}
