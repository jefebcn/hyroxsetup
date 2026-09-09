"use client";

import { useCallback, useRef, useState } from "react";
import { Check } from "lucide-react";
import { useCart } from "@/lib/cart-context";
import { formatPrice } from "@/lib/format";

const HOLD_MS = 650;

interface AddToCartProps {
  slug: string;
  priceCents: number;
  points: number;
  size?: "sm" | "lg";
  openOnAdd?: boolean;
}

/**
 * The signature "Press & hold to buy" wall-buy interaction: hold the button
 * and a bar fills; complete the hold and the item drops into the cart.
 */
export default function AddToCart({
  slug,
  priceCents,
  points,
  size = "lg",
  openOnAdd = true,
}: AddToCartProps) {
  const { add, setOpen } = useCart();
  const [holding, setHolding] = useState(false);
  const [done, setDone] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const doneTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const complete = useCallback(() => {
    setHolding(false);
    setDone(true);
    add(slug);
    if (openOnAdd) setOpen(true);
    if (doneTimer.current) clearTimeout(doneTimer.current);
    doneTimer.current = setTimeout(() => setDone(false), 1400);
  }, [add, slug, openOnAdd, setOpen]);

  const start = useCallback(
    (e: React.PointerEvent) => {
      e.preventDefault();
      if (holding || done) return;
      setHolding(true);
      timer.current = setTimeout(complete, HOLD_MS);
    },
    [holding, done, complete],
  );

  const cancel = useCallback(() => {
    if (timer.current) clearTimeout(timer.current);
    setHolding(false);
  }, []);

  const pad = size === "lg" ? "px-5 py-4 text-sm" : "px-4 py-3.5 text-xs";

  return (
    <div className="w-full select-none">
      <button
        type="button"
        onPointerDown={start}
        onPointerUp={cancel}
        onPointerLeave={cancel}
        onPointerCancel={cancel}
        aria-label={`Press and hold to buy — ${formatPrice(priceCents)}`}
        style={{ fontFamily: "var(--font-display)" }}
        className={`relative w-full touch-none overflow-hidden rounded-lg border font-semibold uppercase tracking-[0.14em]
                    text-bone transition-all duration-200
                    ${done ? "border-blood bg-blood/15" : "border-line bg-elevated hover:border-blood/70 hover:shadow-[0_0_30px_-12px_rgba(225,29,36,0.8)]"} ${pad}`}
      >
        {/* fill bar */}
        <span
          aria-hidden
          className="absolute inset-y-0 left-0"
          style={{
            width: holding ? "100%" : "0%",
            transition: `width ${holding ? HOLD_MS : 160}ms linear`,
            background:
              "linear-gradient(90deg, rgba(225,29,36,0.35), rgba(255,59,64,0.55))",
          }}
        />
        <span className="relative z-10 flex items-center justify-center gap-2">
          {done ? (
            <>
              <Check className="h-4 w-4 text-blood-bright" /> Added to loadout
            </>
          ) : (
            <>
              Press &amp; hold to buy
              <span className="text-ash">·</span>
              <span className="text-blood-bright">{formatPrice(priceCents)}</span>
            </>
          )}
        </span>
      </button>
      <p className="mt-1.5 text-center text-[11px] uppercase tracking-widest text-ash">
        [ Cost: {points.toLocaleString()} points ]
      </p>
    </div>
  );
}
