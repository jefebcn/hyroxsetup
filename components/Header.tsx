"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
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
  const pathname = usePathname();

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  // Close the mobile menu whenever the route changes.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMenu(false);
  }, [pathname]);

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
          <Link href="/" className="group flex items-center gap-2.5">
            <Image
              src="/brand/wallbuy-emblem.jpg"
              alt="WALL BUY"
              width={36}
              height={36}
              priority
              className="brand-emblem h-9 w-9 border border-line"
            />
            <span className="brand-word display text-2xl tracking-tight">
              <span className="wall">WALL</span>
              <span className="buy">BUY</span>
            </span>
            {/* Zombies-style kill/round tally that ticks in 1→5 */}
            <span className="tally hidden sm:inline-flex" aria-hidden>
              <i />
              <i />
              <i />
              <i />
              <i className="slash" />
            </span>
          </Link>

          <nav className="hidden items-center gap-8 md:flex">
            {NAV.map((n) => {
              const active = isActive(n.href);
              return (
                <Link
                  key={n.href}
                  href={n.href}
                  aria-current={active ? "page" : undefined}
                  className={`group relative text-xs font-semibold uppercase tracking-[0.18em] transition-colors ${
                    active ? "text-bone" : "text-ash hover:text-bone"
                  }`}
                >
                  {n.label}
                  <span
                    className={`absolute -bottom-1.5 left-0 h-px bg-blood transition-all duration-300 ${
                      active ? "w-full" : "w-0 group-hover:w-full"
                    }`}
                  />
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-2">
            <Link
              href="/account"
              aria-label="Account"
              className={`flex items-center justify-center rounded-lg border bg-panel p-2.5 text-bone transition-colors hover:border-blood/60 ${
                isActive("/account") ? "border-blood/60" : "border-line"
              }`}
            >
              <User className="h-4 w-4" />
            </Link>
            <button
              type="button"
              onClick={() => setOpen(true)}
              aria-label={`Open cart${count > 0 ? ` (${count} items)` : ""}`}
              className="relative flex items-center gap-2 rounded-lg border border-line bg-panel px-3.5 py-2.5 text-xs font-semibold uppercase tracking-widest text-bone transition-colors hover:border-blood/60"
            >
              <ShoppingCart className="h-4 w-4" />
              <span className="hidden sm:inline">Cart</span>
              {count > 0 && (
                <span
                  key={count}
                  className="cart-badge flex h-5 min-w-5 items-center justify-center rounded-full bg-blood px-1 text-[11px] font-bold text-white"
                >
                  {count}
                </span>
              )}
            </button>
            <button
              type="button"
              onClick={() => setMenu((v) => !v)}
              aria-label="Menu"
              aria-expanded={menu}
              className="flex items-center justify-center rounded-lg border border-line bg-panel p-2.5 text-bone md:hidden"
            >
              {menu ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        <div
          className={`grid overflow-hidden border-line bg-ink/95 transition-all duration-300 md:hidden ${
            menu ? "grid-rows-[1fr] border-t opacity-100" : "grid-rows-[0fr] opacity-0"
          }`}
        >
          <nav className="min-h-0 overflow-hidden px-4 py-2">
            {NAV.map((n) => (
              <Link
                key={n.href}
                href={n.href}
                onClick={() => setMenu(false)}
                aria-current={isActive(n.href) ? "page" : undefined}
                className={`flex items-center justify-between border-b border-line py-3 text-sm font-semibold uppercase tracking-widest ${
                  isActive(n.href) ? "text-blood-bright" : "text-bone"
                }`}
              >
                {n.label}
                <span className="text-ash">→</span>
              </Link>
            ))}
            <Link
              href="/account"
              onClick={() => setMenu(false)}
              className="flex items-center gap-2 py-3 text-sm font-semibold uppercase tracking-widest text-bone"
            >
              <User className="h-4 w-4" /> Account
            </Link>
            <button
              type="button"
              onClick={() => {
                setMenu(false);
                setOpen(true);
              }}
              className="flex w-full items-center gap-2 py-3 text-left text-sm font-semibold uppercase tracking-widest text-bone"
            >
              <ShoppingCart className="h-4 w-4" /> Cart
              {count > 0 && (
                <span className="ml-1 rounded-full bg-blood px-1.5 text-[11px] font-bold text-white">
                  {count}
                </span>
              )}
            </button>
          </nav>
        </div>
      </header>
    </>
  );
}
