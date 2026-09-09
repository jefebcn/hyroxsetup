"use client";

import { useState } from "react";
import { Plus, Minus } from "lucide-react";

const ITEMS = [
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

export default function Faq() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <div className="mx-auto max-w-3xl divide-y divide-line border-y border-line">
      {ITEMS.map((item, i) => {
        const active = open === i;
        return (
          <div key={i}>
            <button
              type="button"
              onClick={() => setOpen(active ? null : i)}
              className="flex w-full items-center justify-between gap-4 py-5 text-left"
              aria-expanded={active}
            >
              <span className="display text-lg uppercase tracking-tight text-bone">
                {item.q}
              </span>
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-line text-blood-bright">
                {active ? <Minus className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
              </span>
            </button>
            {active && (
              <p className="-mt-1 pb-5 pr-10 text-sm leading-relaxed text-ash">
                {item.a}
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
}
