/** Shared FAQ content — used by the on-page accordion and the FAQ JSON-LD. */
export type FaqCategory = "Product" | "Shipping" | "Orders" | "Payments";

export interface FaqItem {
  q: string;
  a: string;
  category: FaqCategory;
}

export const FAQ_CATEGORIES: FaqCategory[] = [
  "Product",
  "Shipping",
  "Payments",
  "Orders",
];

export const FAQ_ITEMS: FaqItem[] = [
  {
    category: "Product",
    q: "What exactly am I buying?",
    a: "A hand-built LED neon sign: flexible neon-flex shaped into the weapon silhouette on a matte-black acrylic panel. It arrives ready to hang, with a remote dimmer and power adapter in the box.",
  },
  {
    category: "Product",
    q: "How does it power on?",
    a: "Plug the included adapter into any wall socket (or USB, depending on the model). Use the remote to switch on/off and dim the brightness to match your setup.",
  },
  {
    category: "Product",
    q: "What size are the signs?",
    a: "Most pieces are around 40–50 cm wide on a slim matte-black acrylic panel. Exact dimensions are listed on each product page under Specifications.",
  },
  {
    category: "Product",
    q: "Can I request a weapon that isn't listed?",
    a: "Absolutely — that's the whole point. Drop the weapon you want in our TikTok comments or email us, and it might be the next drop on the wall.",
  },
  {
    category: "Shipping",
    q: "Do you ship worldwide?",
    a: "Yes. Standard shipping is a flat rate and free over €150. Most orders arrive within 3–10 business days with tracking.",
  },
  {
    category: "Shipping",
    q: "How long until it arrives?",
    a: "Each sign is built to order, then ships with tracking — typically 3–10 business days depending on your country. You'll get a confirmation email the moment it's on its way.",
  },
  {
    category: "Payments",
    q: "What payment methods do you accept?",
    a: "Secure checkout by Stripe: major cards, Apple Pay and Google Pay. Buy 2 or more pieces and 10% comes off automatically at checkout.",
  },
  {
    category: "Orders",
    q: "What if it arrives damaged?",
    a: "Neon is fragile, so we pack it heavily. If anything arrives damaged, send a photo within 48 hours and we'll replace it free of charge.",
  },
  {
    category: "Orders",
    q: "What's your returns policy?",
    a: "You have 14 days. Not stoked? Send it back for a refund — see our Shipping & Returns page for the details.",
  },
];
