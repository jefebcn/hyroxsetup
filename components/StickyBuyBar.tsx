"use client";

import { useEffect, useState } from "react";
import { ShoppingCart } from "lucide-react";
import { useCart } from "@/lib/cart-context";
import { formatPrice } from "@/lib/format";
import { trackTikTok, toMajor } from "@/lib/tiktok";
import { SITE } from "@/lib/site";

/**
 * Mobile-only bar pinned to the bottom of the product page so the price and a
 * buy action are always in reach — most WALL BUY traffic comes from TikTok on
 * a phone. Appears after the user scrolls past the hero add-to-cart.
 */
export default function StickyBuyBar({
  slug,
  name,
  priceCents,
  points,
}: {
  slug: string;
  name: string;
  priceCents: number;
  points: number;
}) {
  const { add, setOpen } = useCart();
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const onScroll = () => setShown(window.scrollY > 520);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  function buy() {
    add(slug, 1);
    trackTikTok("AddToCart", {
      contents: [
        { content_id: slug, content_type: "product", quantity: 1, price: toMajor(priceCents) },
      ],
      value: toMajor(priceCents),
      currency: SITE.currency,
    });
    setOpen(true);
  }

  return (
    <div
      className={`fixed inset-x-0 bottom-0 z-40 border-t border-line bg-ink/95 backdrop-blur-xl transition-transform duration-300 md:hidden ${
        shown ? "translate-y-0" : "translate-y-full"
      }`}
    >
      <div className="flex items-center gap-3 px-4 py-3">
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-bone">{name}</p>
          <p className="text-xs text-ash">
            {formatPrice(priceCents)}
            <span className="text-ash/70"> · {points.toLocaleString()} pts</span>
          </p>
        </div>
        <button
          type="button"
          onClick={buy}
          className="btn btn-primary shrink-0"
        >
          <ShoppingCart className="h-4 w-4" /> Add to cart
        </button>
      </div>
    </div>
  );
}
