"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ShoppingCart, Menu, X, User } from "lucide-react";
import { useCart } from "@/lib/cart-context";

const NAV = [
  { href: "/shop", label: "Shop" },
  { href: "/about", label: "The Story" },
  { href: "/contact", label: "Contact" },
];

const PERKS = [
  "Buy 2, save 10%",
  "Free shipping over €150",
  "Hand-built LED neon",
  "Ships worldwide",
  "14-day returns",
  "Remote dimmer included",
];

export default function Header() {
  const { count, setOpen } = useCart();
  const [menu, setMenu] = useState(false);

  return (
    <>
      {/* Perks marquee */}
      <div className="overflow-hidden border-b border-line bg-panel">
        <div className="marquee-track py-2 text-[11px] font-medium uppercase tracking-[0.2em] text-ash">
          {[...PERKS, ...PERKS, ...PERKS, ...PERKS].map((p, i) => (
            <span key={i} className="mx-6 inline-flex items-center gap-6">
              {p} <span className="text-blood/70">/</span>
            </span>
          ))}
        </div>
      </div>

      <header className="sticky top-0 z-40 border-b border-line bg-ink/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4">
          <Link href="/" className="flex items-center gap-2.5">
            <Image
              src="/brand/wallbuy-emblem.jpg"
              alt="WALL BUY"
              width={36}
              height={36}
              priority
              className="h-9 w-9 rounded-md border border-line"
            />
            <span className="display text-2xl tracking-tight text-bone">
              WALL<span className="text-blood-bright">BUY</span>
            </span>
          </Link>

          <nav className="hidden items-center gap-8 md:flex">
            {NAV.map((n) => (
              <Link
                key={n.href}
                href={n.href}
                className="group relative text-xs font-semibold uppercase tracking-[0.18em] text-ash transition-colors hover:text-bone"
              >
                {n.label}
                <span className="absolute -bottom-1.5 left-0 h-px w-0 bg-blood transition-all duration-300 group-hover:w-full" />
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <Link
              href="/account"
              aria-label="Account"
              className="flex items-center justify-center rounded-lg border border-line bg-panel p-2.5 text-bone transition-colors hover:border-blood/60"
            >
              <User className="h-4 w-4" />
            </Link>
            <button
              type="button"
              onClick={() => setOpen(true)}
              aria-label="Open cart"
              className="relative flex items-center gap-2 rounded-lg border border-line bg-panel px-3.5 py-2.5 text-xs font-semibold uppercase tracking-widest text-bone transition-colors hover:border-blood/60"
            >
              <ShoppingCart className="h-4 w-4" />
              <span className="hidden sm:inline">Cart</span>
              {count > 0 && (
                <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-blood px-1 text-[11px] font-bold text-white">
                  {count}
                </span>
              )}
            </button>
            <button
              type="button"
              onClick={() => setMenu((v) => !v)}
              aria-label="Menu"
              className="flex items-center justify-center rounded-lg border border-line bg-panel p-2.5 text-bone md:hidden"
            >
              {menu ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {menu && (
          <nav className="border-t border-line bg-ink/95 px-4 py-3 md:hidden">
            {NAV.map((n) => (
              <Link
                key={n.href}
                href={n.href}
                onClick={() => setMenu(false)}
                className="block py-3 text-sm font-semibold uppercase tracking-widest text-bone"
              >
                {n.label}
              </Link>
            ))}
          </nav>
        )}
      </header>
    </>
  );
}
