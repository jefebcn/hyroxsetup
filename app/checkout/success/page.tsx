"use client";

import { useEffect } from "react";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { useCart, STORAGE_KEY } from "@/lib/cart-context";
import { products } from "@/lib/products";
import { SITE } from "@/lib/site";
import { trackTikTok, toMajor } from "@/lib/tiktok";

export default function CheckoutSuccessPage() {
  const { clear } = useCart();

  // Payment completed. Read the cart straight from storage (the context may
  // not have rehydrated yet after the Stripe redirect), report the purchase
  // to TikTok, then empty the cart.
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const items = raw ? (JSON.parse(raw) as { slug: string; qty: number }[]) : [];
      if (Array.isArray(items) && items.length) {
        const lines = items.flatMap((i) => {
          const product = products.find((p) => p.slug === i.slug);
          return product ? [{ slug: i.slug, qty: i.qty, product }] : [];
        });
        if (lines.length) {
          const value = lines.reduce((s, l) => s + l.product.priceCents * l.qty, 0);
          trackTikTok("CompletePayment", {
            contents: lines.map((l) => ({
              content_id: l.slug,
              content_name: l.product.name,
              content_type: "product",
              quantity: l.qty,
              price: toMajor(l.product.priceCents),
            })),
            value: toMajor(value),
            currency: SITE.currency,
          });
        }
      }
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* ignore */
    }
    clear();
  }, [clear]);

  return (
    <div className="mx-auto flex max-w-xl flex-col items-center px-4 py-24 text-center">
      <CheckCircle2 className="h-14 w-14 text-blood-bright" />
      <h1 className="display mt-6 text-4xl">Loadout secured</h1>
      <p className="mt-3 text-ash">
        Thanks for buying off the wall. A confirmation email is on its way — we&rsquo;ll
        let you know the moment your neon ships.
      </p>
      <p className="mt-2 text-sm text-ash">
        Questions about your order? Email {SITE.supportEmail}.
      </p>
      <div className="mt-8 flex gap-3">
        <Link
          href="/shop"
          className="rounded-md bg-blood px-6 py-3 text-sm font-bold uppercase tracking-widest text-white hover:bg-blood-bright"
        >
          Keep shopping
        </Link>
        <Link
          href="/"
          className="rounded-md border border-line px-6 py-3 text-sm font-bold uppercase tracking-widest text-bone hover:border-blood/60"
        >
          Home
        </Link>
      </div>
    </div>
  );
}
