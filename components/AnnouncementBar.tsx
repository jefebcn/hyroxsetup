"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { X } from "lucide-react";
import { SITE } from "@/lib/site";

const KEY = "wallbuy.announcement-dismissed";
// Bump this when the offer changes so the bar shows again to everyone.
const VERSION = "bundle-v1";

/**
 * Slim promo bar at the very top of the page. Dismissible (remembered per
 * browser). Advertises the current headline offer.
 */
export default function AnnouncementBar() {
  const [hidden, setHidden] = useState(true);

  useEffect(() => {
    // Reveal on the client once we know the stored dismissal state.
    /* eslint-disable react-hooks/set-state-in-effect */
    try {
      setHidden(localStorage.getItem(KEY) === VERSION);
    } catch {
      setHidden(false);
    }
    /* eslint-enable react-hooks/set-state-in-effect */
  }, []);

  if (hidden) return null;

  function dismiss() {
    try {
      localStorage.setItem(KEY, VERSION);
    } catch {
      /* ignore */
    }
    setHidden(true);
  }

  return (
    <div className="relative bg-blood text-white">
      <Link
        href="/shop"
        className="block px-10 py-2 text-center text-[12px] font-semibold uppercase tracking-[0.14em]"
      >
        Buy 2, save {SITE.bundle.percent}% — applied automatically at checkout
      </Link>
      <button
        type="button"
        onClick={dismiss}
        aria-label="Dismiss announcement"
        className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-white/80 hover:text-white"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}
