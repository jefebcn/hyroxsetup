"use client";

import { useEffect } from "react";
import { trackTikTok, toMajor } from "@/lib/tiktok";
import { SITE } from "@/lib/site";

/**
 * Fires a TikTok `ViewContent` event once when a product page mounts.
 * Renders nothing; a safe no-op when the pixel isn't loaded.
 */
export default function ViewContentTracker({
  slug,
  name,
  priceCents,
}: {
  slug: string;
  name: string;
  priceCents: number;
}) {
  useEffect(() => {
    trackTikTok("ViewContent", {
      contents: [
        {
          content_id: slug,
          content_name: name,
          content_type: "product",
          quantity: 1,
          price: toMajor(priceCents),
        },
      ],
      value: toMajor(priceCents),
      currency: SITE.currency,
    });
  }, [slug, name, priceCents]);

  return null;
}
