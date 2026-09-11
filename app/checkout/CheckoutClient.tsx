"use client";

import { useState } from "react";
import Link from "next/link";
import { Loader2, Lock, ShieldCheck } from "lucide-react";
import { useCart } from "@/lib/cart-context";
import { formatPrice } from "@/lib/format";
import { SITE } from "@/lib/site";
import { trackTikTok, toMajor } from "@/lib/tiktok";
import {
  EMPTY_SHIPPING,
  isCompleteShipping,
  SHIPPING_COUNTRIES,
  type ShippingDetails,
} from "@/lib/order";
import PayPalCheckout from "@/components/PayPalCheckout";

export const PENDING_ORDER_KEY = "wallbuy.pendingOrder";
export const SUMUP_CHECKOUT_KEY = "wallbuy.sumup.checkout";

export default function CheckoutClient({
  sumupEnabled,
  paypalEnabled,
}: {
  sumupEnabled: boolean;
  paypalEnabled: boolean;
}) {
  const {
    lines,
    count,
    subtotalCents,
    discountCents,
    shippingCents,
    totalCents,
  } = useCart();
  const [shipping, setShipping] = useState<ShippingDetails>(EMPTY_SHIPPING);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function set<K extends keyof ShippingDetails>(key: K, value: string) {
    setShipping((s) => ({ ...s, [key]: value }));
  }

  async function payByCard() {
    if (!isCompleteShipping(shipping)) {
      setError("Please fill in all the shipping fields so we can deliver your order.");
      return;
    }
    setError(null);
    setLoading(true);
    const items = lines.map((l) => ({ slug: l.slug, qty: l.qty }));
    try {
      localStorage.setItem(PENDING_ORDER_KEY, JSON.stringify({ shipping, items }));
    } catch {
      /* ignore storage errors */
    }
    try {
      trackTikTok("InitiateCheckout", {
        contents: lines.map((l) => ({
          content_id: l.slug,
          content_name: l.product.name,
          content_type: "product",
          quantity: l.qty,
          price: toMajor(l.product.priceCents),
        })),
        value: toMajor(totalCents),
        currency: SITE.currency,
      });
      const res = await fetch("/api/sumup/create-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items, shipping }),
      });
      const data = await res.json();
      if (!res.ok || !data.hosted_checkout_url) {
        setError(data.error || "Checkout is not available right now.");
        setLoading(false);
        return;
      }
      try {
        localStorage.setItem(SUMUP_CHECKOUT_KEY, data.id);
      } catch {
        /* ignore */
      }
      // External SumUp-hosted payment page.
      window.location.href = data.hosted_checkout_url;
    } catch {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  }

  if (lines.length === 0) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-20 text-center">
        <h1 className="display text-4xl">Checkout</h1>
        <p className="mt-4 text-ash">Your cart is empty.</p>
        <Link
          href="/shop"
          className="mt-6 inline-block rounded-md bg-blood px-6 py-3 text-sm font-bold uppercase tracking-widest text-white hover:bg-blood-bright"
        >
          Shop the wall
        </Link>
      </div>
    );
  }

  const field =
    "w-full rounded-md border border-line bg-elevated px-3 py-2.5 text-sm text-bone placeholder:text-ash/60 focus:border-blood/60 focus:outline-none";

  return (
    <div className="mx-auto max-w-5xl px-4 py-14">
      <h1 className="display mb-8 text-5xl">Checkout</h1>

      <div className="grid gap-8 lg:grid-cols-5">
        {/* Shipping + payment */}
        <div className="lg:col-span-3">
          <section className="rounded-xl border border-line bg-panel p-5">
            <h2 className="display text-2xl">Shipping details</h2>
            <p className="mt-1 text-sm text-ash">
              Where should we send your neon? No customs fees — duties are prepaid.
            </p>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <input
                className={`${field} sm:col-span-2`}
                placeholder="Full name"
                autoComplete="name"
                value={shipping.name}
                onChange={(e) => set("name", e.target.value)}
              />
              <input
                className={field}
                type="email"
                placeholder="Email"
                autoComplete="email"
                value={shipping.email}
                onChange={(e) => set("email", e.target.value)}
              />
              <input
                className={field}
                placeholder="Phone"
                autoComplete="tel"
                value={shipping.phone}
                onChange={(e) => set("phone", e.target.value)}
              />
              <input
                className={`${field} sm:col-span-2`}
                placeholder="Address"
                autoComplete="address-line1"
                value={shipping.address1}
                onChange={(e) => set("address1", e.target.value)}
              />
              <input
                className={`${field} sm:col-span-2`}
                placeholder="Apartment, suite, etc. (optional)"
                autoComplete="address-line2"
                value={shipping.address2}
                onChange={(e) => set("address2", e.target.value)}
              />
              <input
                className={field}
                placeholder="City"
                autoComplete="address-level2"
                value={shipping.city}
                onChange={(e) => set("city", e.target.value)}
              />
              <input
                className={field}
                placeholder="Postal code"
                autoComplete="postal-code"
                value={shipping.postal}
                onChange={(e) => set("postal", e.target.value)}
              />
              <select
                className={`${field} sm:col-span-2`}
                autoComplete="country"
                value={shipping.country}
                onChange={(e) => set("country", e.target.value)}
              >
                <option value="">Select country…</option>
                {SHIPPING_COUNTRIES.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>
          </section>

          <section className="mt-6 rounded-xl border border-line bg-panel p-5">
            <h2 className="display text-2xl">Payment</h2>

            {error && (
              <p className="mt-3 rounded-md border border-blood/40 bg-blood/10 px-3 py-2 text-xs text-blood-bright">
                {error}
              </p>
            )}

            {sumupEnabled ? (
              <>
                <button
                  type="button"
                  onClick={payByCard}
                  disabled={loading}
                  className="mt-4 flex w-full items-center justify-center gap-2 rounded-md bg-blood px-5 py-4 text-sm font-bold uppercase tracking-widest text-white transition-colors hover:bg-blood-bright disabled:opacity-60"
                >
                  {loading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Lock className="h-4 w-4" />
                  )}
                  {loading ? "Redirecting…" : `Pay ${formatPrice(totalCents)} by card`}
                </button>
                <p className="mt-2 flex items-center justify-center gap-1.5 text-center text-[11px] text-ash">
                  <ShieldCheck className="h-3.5 w-3.5" /> Secure payment via SumUp ·
                  Visa, Mastercard, Amex
                </p>
              </>
            ) : paypalEnabled ? (
              <PayPalCheckout />
            ) : (
              <p className="mt-4 rounded-md border border-line bg-elevated px-3 py-3 text-center text-xs text-ash">
                Secure checkout is being set up. Email{" "}
                <a href={`mailto:${SITE.supportEmail}`} className="text-bone underline">
                  {SITE.supportEmail}
                </a>{" "}
                to place an order in the meantime.
              </p>
            )}
          </section>
        </div>

        {/* Order summary */}
        <aside className="lg:col-span-2">
          <div className="h-fit rounded-xl border border-line bg-panel p-5">
            <h2 className="display text-2xl">Order summary</h2>
            <ul className="mt-4 space-y-3">
              {lines.map((l) => (
                <li key={l.slug} className="flex justify-between gap-3 text-sm">
                  <span className="text-ash">
                    {l.qty}× {l.product.name}
                  </span>
                  <span className="text-bone">{formatPrice(l.lineTotalCents)}</span>
                </li>
              ))}
            </ul>
            <div className="mt-4 space-y-1.5 border-t border-line pt-4 text-sm">
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
              <div className="mt-2 flex justify-between border-t border-line pt-2 text-lg font-bold">
                <span>Total</span>
                <span className="text-blood-bright">{formatPrice(totalCents)}</span>
              </div>
            </div>
            <Link
              href="/cart"
              className="mt-4 block text-center text-xs text-ash underline hover:text-bone"
            >
              Edit cart
            </Link>
          </div>
        </aside>
      </div>
    </div>
  );
}
