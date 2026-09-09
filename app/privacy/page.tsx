import type { Metadata } from "next";
import Prose from "@/components/Prose";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How WALL BUY collects and uses your data.",
};

export default function PrivacyPage() {
  return (
    <Prose title="Privacy Policy" updated="September 2026">
      <p>
        This Privacy Policy explains how {SITE.company.legalName} (&ldquo;WALL
        BUY&rdquo;, &ldquo;we&rdquo;) collects, uses and protects your personal
        data when you use {SITE.url}. We act as the data controller.
      </p>

      <h2>Data we collect</h2>
      <ul>
        <li>
          <strong>Order data:</strong> name, email, phone, shipping and billing
          address — needed to fulfil your order.
        </li>
        <li>
          <strong>Payment data:</strong> processed directly by our payment
          provider (Stripe). We never see or store your full card details.
        </li>
        <li>
          <strong>Technical data:</strong> device, browser and usage data via
          cookies (see our Cookie Policy).
        </li>
      </ul>

      <h2>How we use it</h2>
      <ul>
        <li>To process, ship and support your orders.</li>
        <li>To send order and shipping notifications.</li>
        <li>With your consent, to send marketing and improve the store.</li>
        <li>To comply with legal and accounting obligations.</li>
      </ul>

      <h2>Legal bases (GDPR)</h2>
      <p>
        We process data to perform our contract with you (orders), to comply with
        legal obligations (accounting), and on the basis of your consent
        (marketing, non-essential cookies) or our legitimate interests (fraud
        prevention, service improvement).
      </p>

      <h2>Sharing</h2>
      <p>
        We share data only with providers that help us run the store — currently
        our payment processor (Stripe) and shipping/fulfilment partners — under
        appropriate data-processing terms.
      </p>

      <h2>Retention</h2>
      <p>
        We keep order and invoice data for as long as required by tax law, and
        other data only as long as necessary for the purposes above.
      </p>

      <h2>Your rights</h2>
      <p>
        You may request access, correction, deletion, restriction, portability, or
        object to processing, and withdraw consent at any time. Contact{" "}
        <a href={`mailto:${SITE.supportEmail}`}>{SITE.supportEmail}</a>. You may
        also lodge a complaint with your local data-protection authority.
      </p>

      <p className="text-xs">
        This is a starter template. Have it reviewed by a professional and insert
        your registered company details before launch.
      </p>
    </Prose>
  );
}
