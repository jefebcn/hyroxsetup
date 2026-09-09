import type { Metadata } from "next";
import Prose from "@/components/Prose";

export const metadata: Metadata = {
  title: "Cookie Policy",
  description: "How WALL BUY uses cookies and similar technologies.",
};

export default function CookiePolicyPage() {
  return (
    <Prose title="Cookie Policy" updated="September 2026">
      <p>
        Cookies are small files stored on your device. We use them to run the
        store and, with your consent, to understand how it&rsquo;s used.
      </p>

      <h2>Essential cookies &amp; storage</h2>
      <p>
        These are always active because the store can&rsquo;t work without them —
        for example, keeping the items in your cart (stored locally in your
        browser) and remembering your cookie choice. They don&rsquo;t track you
        across other sites.
      </p>

      <h2>Analytics cookies (optional)</h2>
      <p>
        With your consent we may use analytics to measure traffic and improve the
        store. These are only set after you choose &ldquo;Accept all&rdquo; in the
        cookie banner.
      </p>

      <h2>Payment</h2>
      <p>
        Our payment provider (Stripe) may set cookies necessary for secure payment
        processing and fraud prevention when you check out.
      </p>

      <h2>Managing cookies</h2>
      <p>
        You can change your choice at any time by clearing this site&rsquo;s data
        in your browser, which will bring back the consent banner. You can also
        block cookies in your browser settings, though essential features may stop
        working.
      </p>
    </Prose>
  );
}
