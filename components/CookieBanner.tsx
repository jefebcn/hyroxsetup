"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const KEY = "wallbuy.cookie-consent";

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      if (!localStorage.getItem(KEY)) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setVisible(true);
      }
    } catch {
      /* ignore */
    }
  }, []);

  function decide(value: "accepted" | "rejected") {
    try {
      localStorage.setItem(KEY, value);
    } catch {
      /* ignore */
    }
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 border-t border-line bg-elevated/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-ash">
          We use only essential cookies to run the store (like your cart). With
          your consent we may also use analytics to improve WALL BUY. See our{" "}
          <Link href="/cookie-policy" className="text-bone underline">
            Cookie Policy
          </Link>
          .
        </p>
        <div className="flex shrink-0 gap-2">
          <button
            type="button"
            onClick={() => decide("rejected")}
            className="rounded-md border border-line px-4 py-2 text-xs font-bold uppercase tracking-widest text-ash hover:text-bone"
          >
            Essential only
          </button>
          <button
            type="button"
            onClick={() => decide("accepted")}
            className="rounded-md bg-blood px-4 py-2 text-xs font-bold uppercase tracking-widest text-white hover:bg-blood-bright"
          >
            Accept all
          </button>
        </div>
      </div>
    </div>
  );
}
