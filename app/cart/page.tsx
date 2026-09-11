"use client";

import Link from "next/link";
import Image from "next/image";
import { Minus, Plus, Trash2 } from "lucide-react";
import { useCart } from "@/lib/cart-context";
import { formatPrice } from "@/lib/format";
import { SITE } from "@/lib/site";
import FreeShippingMeter from "@/components/FreeShippingMeter";
import PayPalCheckout from "@/components/PayPalCheckout";

export default function CartPage() {
  const {
    lines,
    count,
    subtotalCents,
    discountCents,
    bundleApplied,
    shippingCents,
    totalCents,
    setQty,
    remove,
  } = useCart();

  return (
    <div className="mx-auto max-w-4xl px-4 py-14">
      <h1 className="display mb-8 text-5xl">Your loadout</h1>

      {lines.length === 0 ? (
        <div className="rounded-xl border border-line bg-panel px-6 py-16 text-center">
          <p className="text-ash">Nothing on the wall yet.</p>
          <Link
            href="/shop"
            className="mt-5 inline-block rounded-md bg-blood px-6 py-3 text-sm font-bold uppercase tracking-widest text-white hover:bg-blood-bright"
          >
            Shop the wall
          </Link>
        </div>
      ) : (
        <div className="grid gap-8 lg:grid-cols-3">
          <ul className="space-y-4 lg:col-span-2">
            {lines.map((l) => (
              <li
                key={l.slug}
                className="flex gap-4 rounded-xl border border-line bg-panel p-4"
              >
                <Link
                  href={`/product/${l.slug}`}
                  className="relative h-24 w-32 shrink-0 overflow-hidden rounded-md border border-line bg-black"
                >
                  <Image
                    src={l.product.image}
                    alt={l.product.name}
                    fill
                    sizes="128px"
                    className="object-cover"
                  />
                </Link>
                <div className="flex flex-1 flex-col">
                  <div className="flex items-start justify-between">
                    <Link href={`/product/${l.slug}`} className="font-semibold text-bone">
                      {l.product.name}
                    </Link>
                    <button
                      type="button"
                      onClick={() => remove(l.slug)}
                      aria-label={`Remove ${l.product.name}`}
                      className="text-ash hover:text-blood-bright"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  <span className="text-sm text-ash">{formatPrice(l.product.priceCents)}</span>
                  <div className="mt-auto flex items-center gap-3">
                    <div className="flex items-center rounded-md border border-line">
                      <button
                        type="button"
                        onClick={() => setQty(l.slug, l.qty - 1)}
                        aria-label="Decrease quantity"
                        className="px-2.5 py-1.5 text-ash hover:text-bone"
                      >
                        <Minus className="h-3.5 w-3.5" />
                      </button>
                      <span className="min-w-7 text-center text-sm">{l.qty}</span>
                      <button
                        type="button"
                        onClick={() => setQty(l.slug, l.qty + 1)}
                        aria-label="Increase quantity"
                        className="px-2.5 py-1.5 text-ash hover:text-bone"
                      >
                        <Plus className="h-3.5 w-3.5" />
                      </button>
                    </div>
                    <span className="ml-auto font-semibold text-bone">
                      {formatPrice(l.lineTotalCents)}
                    </span>
                  </div>
                </div>
              </li>
            ))}
          </ul>

          <aside className="h-fit rounded-xl border border-line bg-panel p-5">
            <h2 className="display text-2xl">Summary</h2>
            <div className="mt-4 space-y-2">
              <FreeShippingMeter subtotalCents={subtotalCents} />
              {!bundleApplied && count === 1 && (
                <p className="rounded-lg border border-gold/40 bg-gold/10 px-3 py-2 text-xs text-gold">
                  Add one more piece and save {SITE.bundle.percent}% on both.
                </p>
              )}
            </div>
            <div className="mt-4 space-y-1.5 text-sm">
              <div className="flex justify-between text-ash">
                <span>Subtotal</span>
                <span className="text-bone">{formatPrice(subtotalCents)}</span>
              </div>
              {discountCents > 0 && (
                <div className="flex justify-between text-blood-bright">
                  <span>Bundle −{SITE.bundle.percent}% ({count} pieces)</span>
                  <span>−{formatPrice(discountCents)}</span>
                </div>
              )}
              <div className="flex justify-between text-ash">
                <span>Shipping</span>
                <span className="text-bone">
                  {shippingCents === 0 ? "Free" : formatPrice(shippingCents)}
                </span>
              </div>
              {shippingCents > 0 && (
                <p className="text-xs text-ash">
                  Free shipping over {formatPrice(SITE.freeShippingOverCents)}.
                </p>
              )}
              <div className="mt-2 flex justify-between border-t border-line pt-2 text-lg font-bold">
                <span>Total</span>
                <span className="text-blood-bright">{formatPrice(totalCents)}</span>
              </div>
            </div>

            <PayPalCheckout />
          </aside>
        </div>
      )}
    </div>
  );
}
