"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import { products, type Product } from "./products";
import { SITE } from "./site";

export interface CartItem {
  slug: string;
  qty: number;
}

export interface CartLine extends CartItem {
  product: Product;
  lineTotalCents: number;
}

interface CartState {
  items: CartItem[];
  lines: CartLine[];
  count: number;
  subtotalCents: number;
  /** Bundle discount applied to the product subtotal (0 when not eligible). */
  discountCents: number;
  /** True once the cart qualifies for the bundle discount. */
  bundleApplied: boolean;
  shippingCents: number;
  totalCents: number;
  add: (slug: string, qty?: number) => void;
  setQty: (slug: string, qty: number) => void;
  remove: (slug: string) => void;
  clear: () => void;
  /** Drawer open state (header cart). */
  open: boolean;
  setOpen: (v: boolean) => void;
}

const CartContext = createContext<CartState | null>(null);
export const STORAGE_KEY = "wallbuy.cart";

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [open, setOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  // Restore cart from localStorage on mount.
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as CartItem[];
        if (Array.isArray(parsed)) {
          // eslint-disable-next-line react-hooks/set-state-in-effect
          setItems(parsed.filter((i) => products.some((p) => p.slug === i.slug)));
        }
      }
    } catch {
      /* ignore */
    }
    setHydrated(true);
  }, []);

  // Persist on change (after hydration to avoid clobbering).
  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      /* ignore */
    }
  }, [items, hydrated]);

  const add = useCallback((slug: string, qty = 1) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.slug === slug);
      if (existing) {
        return prev.map((i) =>
          i.slug === slug ? { ...i, qty: Math.min(i.qty + qty, 20) } : i,
        );
      }
      return [...prev, { slug, qty: Math.min(qty, 20) }];
    });
  }, []);

  const setQty = useCallback((slug: string, qty: number) => {
    setItems((prev) =>
      qty <= 0
        ? prev.filter((i) => i.slug !== slug)
        : prev.map((i) => (i.slug === slug ? { ...i, qty: Math.min(qty, 20) } : i)),
    );
  }, []);

  const remove = useCallback((slug: string) => {
    setItems((prev) => prev.filter((i) => i.slug !== slug));
  }, []);

  const clear = useCallback(() => setItems([]), []);

  const value = useMemo<CartState>(() => {
    const lines: CartLine[] = items
      .map((i) => {
        const product = products.find((p) => p.slug === i.slug);
        if (!product) return null;
        return {
          ...i,
          product,
          lineTotalCents: product.priceCents * i.qty,
        };
      })
      .filter((l): l is CartLine => l !== null);

    const subtotalCents = lines.reduce((s, l) => s + l.lineTotalCents, 0);
    const count = lines.reduce((s, l) => s + l.qty, 0);

    // Bundle discount: % off the product subtotal for `minItems`+ pieces.
    const bundleApplied = count >= SITE.bundle.minItems;
    const discountCents = bundleApplied
      ? Math.round((subtotalCents * SITE.bundle.percent) / 100)
      : 0;

    // Shipping is charged on top and is based on the pre-discount subtotal.
    const shippingCents =
      subtotalCents === 0 || subtotalCents >= SITE.freeShippingOverCents
        ? 0
        : SITE.flatShippingCents;

    return {
      items,
      lines,
      count,
      subtotalCents,
      discountCents,
      bundleApplied,
      shippingCents,
      totalCents: subtotalCents - discountCents + shippingCents,
      add,
      setQty,
      remove,
      clear,
      open,
      setOpen,
    };
  }, [items, open, add, setQty, remove, clear]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartState {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
