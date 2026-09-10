/**
 * Central site configuration. Values marked TODO are placeholders — see the
 * README / the "data needed" list and replace them with your real details.
 */
export const SITE = {
  name: "WALL BUY",
  // Zombies "mystery box / wall weapon" energy.
  tagline: "Buy it off the wall.",
  description:
    "Neon LED wall art inspired by the wall-weapons of Call of Duty Zombies. Mount your loadout and light up the room.",
  // Used for absolute URLs (Open Graph, Stripe redirects). Override with
  // NEXT_PUBLIC_SITE_URL in production.
  url: "https://wallbuyshop.com",
  supportEmail: "support@wallbuyshop.com",
  currency: "EUR",
  locale: "en-IE",
  socials: {
    tiktok: "https://www.tiktok.com/@wallbuy_official",
    instagram: "https://www.instagram.com/wallbuy_official",
  },
  // Legal entity shown in the footer / legal pages.
  company: {
    legalName: "Wall Buy FZ-LLC",
    vat: "TRN 100482910400003",
    registration: "DMCC Licence DMCC-849201",
    address: "Marina Plaza, Floor 19, Dubai Marina, Dubai",
    country: "United Arab Emirates",
  },
  // Ships from a UAE free zone (0% VAT). Import duties/taxes in the
  // destination country are the customer's responsibility.
  shipsFrom: "United Arab Emirates",
  // Free-shipping threshold (in cents) and flat shipping rate (in cents).
  freeShippingOverCents: 15000,
  flatShippingCents: 990,
  // Automatic bundle discount: buy `minItems`+ pieces, get `percent`% off the
  // product subtotal (shipping is charged separately, on top, and is never
  // discounted).
  bundle: { minItems: 2, percent: 10 },
} as const;

/** Resolve the public base URL at runtime (Vercel / env aware). */
export function siteUrl(): string {
  return (
    process.env.NEXT_PUBLIC_SITE_URL ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : SITE.url)
  );
}
