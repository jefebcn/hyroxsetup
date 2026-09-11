"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CheckCircle2, Loader2, XCircle } from "lucide-react";
import { useCart, STORAGE_KEY } from "@/lib/cart-context";
import { products } from "@/lib/products";
import { SITE } from "@/lib/site";
import { trackTikTok, toMajor } from "@/lib/tiktok";
import {
  PENDING_ORDER_KEY,
  SUMUP_CHECKOUT_KEY,
} from "@/app/checkout/CheckoutClient";

type Status = "verifying" | "paid" | "failed";

export default function CheckoutSuccessPage() {
  const { clear } = useCart();
  const [status, setStatus] = useState<Status>("verifying");

  useEffect(() => {
    // Fire the TikTok purchase event from the stored cart, then empty it.
    const finalizeSuccess = () => {
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        const items = raw
          ? (JSON.parse(raw) as { slug: string; qty: number }[])
          : [];
        if (Array.isArray(items) && items.length) {
          const lines = items.flatMap((i) => {
            const product = products.find((p) => p.slug === i.slug);
            return product ? [{ slug: i.slug, qty: i.qty, product }] : [];
          });
          if (lines.length) {
            const value = lines.reduce(
              (s, l) => s + l.product.priceCents * l.qty,
              0,
            );
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
      setStatus("paid");
    };

    const clearPending = () => {
      try {
        localStorage.removeItem(SUMUP_CHECKOUT_KEY);
        localStorage.removeItem(PENDING_ORDER_KEY);
      } catch {
        /* ignore */
      }
    };

    let sumupId: string | null = null;
    try {
      sumupId = localStorage.getItem(SUMUP_CHECKOUT_KEY);
    } catch {
      /* ignore */
    }

    // No SumUp checkout in flight → this is a flow that already verified payment
    // before redirecting here (e.g. PayPal). Treat as success.
    if (!sumupId) {
      finalizeSuccess();
      return;
    }

    // SumUp: confirm the payment was actually captured before celebrating.
    let order: { shipping?: unknown; items?: unknown } = {};
    try {
      const raw = localStorage.getItem(PENDING_ORDER_KEY);
      if (raw) order = JSON.parse(raw);
    } catch {
      /* ignore */
    }

    fetch("/api/sumup/finalize", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: sumupId, ...order }),
    })
      .then((r) => r.json())
      .then((data) => {
        if (data?.paid) {
          finalizeSuccess();
        } else {
          setStatus("failed");
        }
      })
      .catch(() => setStatus("failed"))
      .finally(clearPending);
  }, [clear]);

  if (status === "verifying") {
    return (
      <div className="mx-auto flex max-w-xl flex-col items-center px-4 py-28 text-center">
        <Loader2 className="h-10 w-10 animate-spin text-ash" />
        <h1 className="display mt-6 text-3xl">Confirming your payment…</h1>
        <p className="mt-3 text-ash">Hang tight, this only takes a second.</p>
      </div>
    );
  }

  if (status === "failed") {
    return (
      <div className="mx-auto flex max-w-xl flex-col items-center px-4 py-24 text-center">
        <XCircle className="h-14 w-14 text-blood-bright" />
        <h1 className="display mt-6 text-4xl">Payment not confirmed</h1>
        <p className="mt-3 text-ash">
          We couldn&rsquo;t confirm your payment. If you were charged, don&rsquo;t worry —
          nothing is lost. Email {SITE.supportEmail} and we&rsquo;ll sort it out, or try
          again from your cart.
        </p>
        <div className="mt-8 flex gap-3">
          <Link
            href="/checkout"
            className="rounded-md bg-blood px-6 py-3 text-sm font-bold uppercase tracking-widest text-white hover:bg-blood-bright"
          >
            Try again
          </Link>
          <Link
            href="/cart"
            className="rounded-md border border-line px-6 py-3 text-sm font-bold uppercase tracking-widest text-bone hover:border-blood/60"
          >
            Back to cart
          </Link>
        </div>
      </div>
    );
  }

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
