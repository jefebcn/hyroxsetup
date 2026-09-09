"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CONSENT_KEY, setConsent, type Consent } from "@/lib/consent";

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      if (!localStorage.getItem(CONSENT_KEY)) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setVisible(true);
      }
    } catch {
      /* ignore */
    }
  }, []);

  function decide(value: Consent) {
    setConsent(value);
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 border-t border-line bg-elevated/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-ash">
          We use essential cookies to run the store (like your cart). With your
          consent we also use analytics and marketing cookies — including the
          TikTok Pixel — to improve WALL BUY and measure our ads. See our{" "}
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
