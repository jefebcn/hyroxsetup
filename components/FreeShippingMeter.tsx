import { Truck } from "lucide-react";
import { SITE } from "@/lib/site";
import { formatPrice } from "@/lib/format";

/**
 * Progress toward the free-shipping threshold — nudges average order value.
 * Shows how much more to spend, or a celebratory unlocked state.
 */
export default function FreeShippingMeter({
  subtotalCents,
}: {
  subtotalCents: number;
}) {
  const threshold = SITE.freeShippingOverCents;
  if (subtotalCents <= 0) return null;

  const unlocked = subtotalCents >= threshold;
  const pct = Math.min(100, Math.round((subtotalCents / threshold) * 100));
  const remaining = Math.max(0, threshold - subtotalCents);

  return (
    <div className="rounded-lg border border-line bg-elevated px-4 py-3">
      <p className="flex items-center gap-2 text-xs text-ash">
        <Truck className="h-4 w-4 text-blood-bright" />
        {unlocked ? (
          <span className="font-semibold text-bone">
            You&rsquo;ve unlocked free shipping.
          </span>
        ) : (
          <span>
            <span className="font-semibold text-bone">
              {formatPrice(remaining)}
            </span>{" "}
            away from free shipping.
          </span>
        )}
      </p>
      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-line">
        <div
          className="h-full rounded-full bg-linear-to-r from-blood to-blood-bright transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
