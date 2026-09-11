import { products } from "./products";
import { SITE } from "./site";

export interface PricedItem {
  slug: string;
  name: string;
  quantity: number;
  unitCents: number;
  lineCents: number;
}

export interface PricedCart {
  items: PricedItem[];
  subtotalCents: number;
  discountCents: number;
  shippingCents: number;
  totalCents: number;
  totalQty: number;
}

/**
 * Server-authoritative cart pricing. Prices always come from our own catalog
 * (never the client), so a tampered request can't change what's charged. Mirrors
 * the client cart math in `lib/cart-context.tsx`.
 */
export function priceCart(
  raw: { slug?: string; qty?: number }[],
): PricedCart {
  const items: PricedItem[] = [];
  let subtotalCents = 0;
  let totalQty = 0;

  for (const entry of raw) {
    if (!entry || typeof entry !== "object") continue;
    const product = products.find((p) => p.slug === entry.slug);
    if (!product || !product.inStock) continue;
    const quantity = Math.max(1, Math.min(20, Math.floor(Number(entry.qty) || 1)));
    const lineCents = product.priceCents * quantity;
    subtotalCents += lineCents;
    totalQty += quantity;
    items.push({
      slug: product.slug,
      name: product.name,
      quantity,
      unitCents: product.priceCents,
      lineCents,
    });
  }

  const bundleApplied = totalQty >= SITE.bundle.minItems;
  const discountCents = bundleApplied
    ? Math.round((subtotalCents * SITE.bundle.percent) / 100)
    : 0;

  const shippingCents =
    subtotalCents === 0 || subtotalCents >= SITE.freeShippingOverCents
      ? 0
      : SITE.flatShippingCents;

  return {
    items,
    subtotalCents,
    discountCents,
    shippingCents,
    totalCents: subtotalCents - discountCents + shippingCents,
    totalQty,
  };
}
