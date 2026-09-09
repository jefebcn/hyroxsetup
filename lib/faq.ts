/** Shared FAQ content — used by the on-page accordion and the FAQ JSON-LD. */
export interface FaqItem {
  q: string;
  a: string;
}

export const FAQ_ITEMS: FaqItem[] = [
  {
    q: "What exactly am I buying?",
    a: "A hand-built LED neon sign: flexible neon-flex shaped into the weapon silhouette on a matte-black acrylic panel. It arrives ready to hang, with a remote dimmer and power adapter in the box.",
  },
  {
    q: "How does it power on?",
    a: "Plug the included adapter into any wall socket (or USB, depending on the model). Use the remote to switch on/off and dim the brightness to match your setup.",
  },
  {
    q: "Do you ship worldwide?",
    a: "Yes. Standard shipping is a flat rate and free over €150. Most orders arrive within 3–10 business days with tracking.",
  },
  {
    q: "Can I request a weapon that isn't listed?",
    a: "Absolutely — that's the whole point. Drop the weapon you want in our TikTok comments or email us, and it might be the next drop on the wall.",
  },
  {
    q: "What if it arrives damaged?",
    a: "Neon is fragile, so we pack it heavily. If anything arrives damaged, send a photo within 48 hours and we'll replace it free of charge.",
  },
];
