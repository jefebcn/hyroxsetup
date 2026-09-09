"use client";

import Script from "next/script";
import { useEffect, useState } from "react";
import { TIKTOK_PIXEL_ID } from "@/lib/tiktok";
import { getConsent, CONSENT_EVENT } from "@/lib/consent";

/**
 * Loads the TikTok Pixel base code + tracks the initial PageView — but only
 * once the visitor has accepted marketing cookies, and only when a pixel ID is
 * configured. Renders nothing (and loads no external script) otherwise, so the
 * site stays clean in local/preview and respects consent for GDPR.
 *
 * To activate: set NEXT_PUBLIC_TIKTOK_PIXEL_ID in the Vercel project env.
 */
export default function TikTokPixel() {
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    const sync = () => {
      if (getConsent() === "accepted") setAllowed(true);
    };
    sync();
    window.addEventListener(CONSENT_EVENT, sync);
    return () => window.removeEventListener(CONSENT_EVENT, sync);
  }, []);

  if (!TIKTOK_PIXEL_ID || !allowed) return null;

  return (
    <Script id="tiktok-pixel" strategy="afterInteractive">
      {`
        !function (w, d, t) {
          w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];
          ttq.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie","holdConsent","revokeConsent","grantConsent"];
          ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};
          for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);
          ttq.instance=function(t){for(var e=ttq._i[t]||[],n=0;n<ttq.methods.length;n++)ttq.setAndDefer(e,ttq.methods[n]);return e};
          ttq.load=function(e,n){var r="https://analytics.tiktok.com/i18n/pixel/events.js",o=n&&n.partner;ttq._i=ttq._i||{},ttq._i[e]=[],ttq._i[e]._u=r,ttq._t=ttq._t||{},ttq._t[e]=+new Date,ttq._o=ttq._o||{},ttq._o[e]=n||{};n=document.createElement("script");n.type="text/javascript",n.async=!0,n.src=r+"?sdkid="+e+"&lib="+t;e=document.getElementsByTagName("script")[0];e.parentNode.insertBefore(n,e)};
          ttq.load('${TIKTOK_PIXEL_ID}');
          ttq.page();
        }(window, document, 'ttq');
      `}
    </Script>
  );
}
