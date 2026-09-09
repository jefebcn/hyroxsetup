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
  url: "https://wallbuy.store", // TODO: real domain
  supportEmail: "support@wallbuy.store", // TODO
  currency: "EUR",
  locale: "en-IE",
  socials: {
    tiktok: "https://www.tiktok.com/@wallbuy", // TODO
    instagram: "https://www.instagram.com/wallbuy", // TODO
  },
  // Legal entity shown in the footer / legal pages.
  company: {
    legalName: "WALL BUY", // TODO: registered business name
    vat: "TODO — VAT / P.IVA",
    address: "TODO — registered address",
    country: "TODO — country",
  },
  // Free-shipping threshold (in cents) and flat shipping rate (in cents).
  freeShippingOverCents: 15000,
  flatShippingCents: 690,
} as const;

/** Resolve the public base URL at runtime (Vercel / env aware). */
export function siteUrl(): string {
  return (
    process.env.NEXT_PUBLIC_SITE_URL ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : SITE.url)
  );
}
