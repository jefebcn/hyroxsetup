"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { X, Minus, Plus, Trash2, Loader2 } from "lucide-react";
import { useCart } from "@/lib/cart-context";
import { formatPrice } from "@/lib/format";
import { SITE } from "@/lib/site";
import FreeShippingMeter from "./FreeShippingMeter";

export default function CartDrawer() {
  const { open, setOpen, lines, subtotalCents, shippingCents, totalCents, setQty, remove } =
    useCart();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function checkout() {
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: lines.map((l) => ({ slug: l.slug, qty: l.qty })),
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.url) {
        setError(data.error || "Checkout is not available right now.");
        setLoading(false);
        return;
      }
      window.location.href = data.url;
    } catch {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  }

  return (
    <div
      className={`fixed inset-0 z-50 ${open ? "" : "pointer-events-none"}`}
      aria-hidden={!open}
    >
      {/* overlay */}
      <div
        onClick={() => setOpen(false)}
        className={`absolute inset-0 bg-black/60 transition-opacity ${
          open ? "opacity-100" : "opacity-0"
        }`}
      />
      {/* panel */}
      <aside
        className={`absolute right-0 top-0 flex h-full w-full max-w-md flex-col border-l border-line bg-panel transition-transform duration-300 ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-line px-5 py-4">
          <h2 className="display text-xl">Your loadout</h2>
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Close cart"
            className="rounded-md p-1.5 text-ash hover:bg-elevated hover:text-bone"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {lines.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 p-8 text-center">
            <p className="text-ash">Your loadout is empty.</p>
            <Link
              href="/shop"
              onClick={() => setOpen(false)}
              className="rounded-md bg-blood px-5 py-3 text-sm font-bold uppercase tracking-widest text-white hover:bg-blood-bright"
            >
              Hit the wall
            </Link>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto px-5 py-4">
              <ul className="space-y-4">
                {lines.map((l) => (
                  <li key={l.slug} className="flex gap-3">
                    <div className="relative h-20 w-24 shrink-0 overflow-hidden rounded-md border border-line bg-black">
                      <Image
                        src={l.product.image}
                        alt={l.product.name}
                        fill
                        sizes="96px"
                        className="object-cover"
                      />
                    </div>
                    <div className="flex flex-1 flex-col">
                      <div className="flex items-start justify-between gap-2">
                        <span className="font-semibold text-bone">{l.product.name}</span>
                        <button
                          type="button"
                          onClick={() => remove(l.slug)}
                          aria-label={`Remove ${l.product.name}`}
                          className="text-ash hover:text-blood-bright"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                      <span className="text-sm text-ash">
                        {formatPrice(l.product.priceCents)}
                      </span>
                      <div className="mt-auto flex items-center gap-2">
                        <div className="flex items-center rounded-md border border-line">
                          <button
                            type="button"
                            onClick={() => setQty(l.slug, l.qty - 1)}
                            aria-label="Decrease quantity"
                            className="px-2 py-1 text-ash hover:text-bone"
                          >
                            <Minus className="h-3.5 w-3.5" />
                          </button>
                          <span className="min-w-6 text-center text-sm">{l.qty}</span>
                          <button
                            type="button"
                            onClick={() => setQty(l.slug, l.qty + 1)}
                            aria-label="Increase quantity"
                            className="px-2 py-1 text-ash hover:text-bone"
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
            </div>

            <div className="border-t border-line px-5 py-4">
              <div className="mb-4">
                <FreeShippingMeter subtotalCents={subtotalCents} />
              </div>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between text-ash">
                  <span>Subtotal</span>
                  <span className="text-bone">{formatPrice(subtotalCents)}</span>
                </div>
                <div className="flex justify-between text-ash">
                  <span>Shipping</span>
                  <span className="text-bone">
                    {shippingCents === 0 ? "Free" : formatPrice(shippingCents)}
                  </span>
                </div>
                <div className="mt-2 flex justify-between border-t border-line pt-2 text-base font-bold">
                  <span>Total</span>
                  <span className="text-blood-bright">{formatPrice(totalCents)}</span>
                </div>
              </div>

              {error && (
                <p className="mt-3 rounded-md border border-blood/40 bg-blood/10 px-3 py-2 text-xs text-blood-bright">
                  {error}
                </p>
              )}

              <button
                type="button"
                onClick={checkout}
                disabled={loading}
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-md bg-blood px-5 py-4 text-sm font-bold uppercase tracking-widest text-white transition-colors hover:bg-blood-bright disabled:opacity-60"
              >
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                {loading ? "Redirecting…" : "Checkout"}
              </button>
              <p className="mt-2 text-center text-[11px] text-ash">
                Secure payment · Cards, Apple Pay &amp; Google Pay via Stripe
              </p>
              <p className="mt-1 text-center text-[11px] text-ash">
                Questions? {SITE.supportEmail}
              </p>
            </div>
          </>
        )}
      </aside>
    </div>
  );
}
