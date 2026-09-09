"use client";

import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { useCart } from "@/lib/cart-context";
import { SITE } from "@/lib/site";
import { formatPrice } from "@/lib/format";

export default function Header() {
  const { count, setOpen } = useCart();

  return (
    <>
      {/* Announcement bar */}
      <div className="bg-blood text-center text-[11px] font-bold uppercase tracking-widest text-white">
        <div className="px-4 py-1.5">
          Free shipping over {formatPrice(SITE.freeShippingOverCents)} · Ships worldwide 🧟
        </div>
      </div>

      <header className="sticky top-0 z-40 border-b border-line bg-ink/85 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-blood neon-red text-xl leading-none">|||||</span>
            <span className="display text-2xl tracking-tight">
              WALL<span className="text-blood">BUY</span>
            </span>
          </Link>

          <nav className="hidden items-center gap-7 text-xs font-bold uppercase tracking-widest text-ash sm:flex">
            <Link href="/shop" className="transition-colors hover:text-bone">
              Shop
            </Link>
            <Link href="/about" className="transition-colors hover:text-bone">
              The Story
            </Link>
            <Link href="/contact" className="transition-colors hover:text-bone">
              Contact
            </Link>
          </nav>

          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-label="Open cart"
            className="relative flex items-center gap-2 rounded-md border border-line bg-panel px-3 py-2 text-xs font-bold uppercase tracking-widest text-bone transition-colors hover:border-blood/60"
          >
            <ShoppingCart className="h-4 w-4" />
            <span className="hidden sm:inline">Cart</span>
            {count > 0 && (
              <span className="ml-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-blood px-1 text-[11px] font-bold text-white">
                {count}
              </span>
            )}
          </button>
        </div>
      </header>
    </>
  );
}
