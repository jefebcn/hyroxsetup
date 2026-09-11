"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useCart } from "@/lib/cart-context";
import { SITE } from "@/lib/site";
import { trackTikTok, toMajor } from "@/lib/tiktok";

const CLIENT_ID = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;

type PayPalButtonsInstance = {
  render: (el: HTMLElement) => Promise<void>;
  close?: () => void;
};
type PayPalNamespace = {
  Buttons: (opts: Record<string, unknown>) => PayPalButtonsInstance;
};
declare global {
  interface Window {
    paypal?: PayPalNamespace;
  }
}

let sdkPromise: Promise<void> | null = null;
function loadPayPalSdk(): Promise<void> {
  if (typeof window === "undefined") return Promise.reject(new Error("no window"));
  if (window.paypal) return Promise.resolve();
  if (sdkPromise) return sdkPromise;
  sdkPromise = new Promise<void>((resolve, reject) => {
    const params = new URLSearchParams({
      "client-id": CLIENT_ID as string,
      currency: SITE.currency,
      intent: "capture",
      components: "buttons",
      "enable-funding": "card",
    });
    const script = document.createElement("script");
    script.src = `https://www.paypal.com/sdk/js?${params.toString()}`;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => {
      sdkPromise = null;
      reject(new Error("PayPal SDK failed to load"));
    };
    document.head.appendChild(script);
  });
  return sdkPromise;
}

/**
 * PayPal checkout button. Renders the PayPal + card buttons, creates and
 * captures the order via our server routes (prices verified server-side), then
 * sends the shopper to the success page. Degrades to a note when PayPal isn't
 * configured yet.
 */
export default function PayPalCheckout() {
  const router = useRouter();
  const { lines, totalCents } = useCart();
  const containerRef = useRef<HTMLDivElement>(null);
  const linesRef = useRef(lines);
  const totalRef = useRef(totalCents);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Keep the latest cart available to the PayPal callbacks (which are created
  // once, but must read the cart as it is at click time).
  useEffect(() => {
    linesRef.current = lines;
    totalRef.current = totalCents;
  });

  useEffect(() => {
    if (!CLIENT_ID) return;
    let buttons: PayPalButtonsInstance | undefined;
    let cancelled = false;

    loadPayPalSdk()
      .then(() => {
        if (cancelled || !containerRef.current || !window.paypal) return;
        setReady(true);
        buttons = window.paypal.Buttons({
          style: { layout: "vertical", color: "gold", shape: "rect", label: "paypal" },
          createOrder: async () => {
            setError(null);
            trackTikTok("InitiateCheckout", {
              contents: linesRef.current.map((l) => ({
                content_id: l.slug,
                content_name: l.product.name,
                content_type: "product",
                quantity: l.qty,
                price: toMajor(l.product.priceCents),
              })),
              value: toMajor(totalRef.current),
              currency: SITE.currency,
            });
            const res = await fetch("/api/paypal/create-order", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                items: linesRef.current.map((l) => ({ slug: l.slug, qty: l.qty })),
              }),
            });
            const data = await res.json();
            if (!res.ok || !data.id) {
              throw new Error(data.error || "Could not start checkout.");
            }
            return data.id as string;
          },
          onApprove: async (data: { orderID: string }) => {
            const res = await fetch("/api/paypal/capture-order", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ orderID: data.orderID }),
            });
            const result = await res.json();
            if (!res.ok || result.status !== "COMPLETED") {
              setError("Payment couldn't be completed. No charge was made — please try again.");
              return;
            }
            router.push("/checkout/success");
          },
          onError: () => {
            setError("Something went wrong with PayPal. Please try again.");
          },
        });
        buttons.render(containerRef.current).catch(() => {
          setError("PayPal is temporarily unavailable. Please try again later.");
        });
      })
      .catch(() => {
        setError("PayPal is temporarily unavailable. Please try again later.");
      });

    return () => {
      cancelled = true;
      try {
        buttons?.close?.();
      } catch {
        /* ignore */
      }
    };
    // Buttons are created once; callbacks read the cart via refs.
  }, [router]);

  if (!CLIENT_ID) {
    return (
      <p className="mt-4 rounded-md border border-line bg-elevated px-3 py-3 text-center text-xs text-ash">
        Secure checkout is being set up. Email{" "}
        <a href={`mailto:${SITE.supportEmail}`} className="text-bone underline">
          {SITE.supportEmail}
        </a>{" "}
        to place an order in the meantime.
      </p>
    );
  }

  return (
    <div className="mt-4">
      <div ref={containerRef} className="min-h-[3rem] [color-scheme:light]" />
      {!ready && !error && (
        <div className="flex items-center justify-center gap-2 py-3 text-xs text-ash">
          <Loader2 className="h-4 w-4 animate-spin" /> Loading secure checkout…
        </div>
      )}
      {error && (
        <p className="mt-2 rounded-md border border-blood/40 bg-blood/10 px-3 py-2 text-xs text-blood-bright">
          {error}
        </p>
      )}
      <p className="mt-2 text-center text-[11px] text-ash">
        Secure payment via PayPal · cards accepted, no account needed
      </p>
    </div>
  );
}
