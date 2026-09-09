"use client";

import { useState } from "react";
import { Plus, Minus } from "lucide-react";
import { FAQ_ITEMS } from "@/lib/faq";

export default function Faq() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <div className="mx-auto max-w-3xl divide-y divide-line border-y border-line">
      {FAQ_ITEMS.map((item, i) => {
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
