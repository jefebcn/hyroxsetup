import type { Metadata } from "next";
import { products } from "@/lib/products";
import ProductCard from "@/components/ProductCard";

export const metadata: Metadata = {
  title: "Shop the Wall",
  description:
    "Every WALL BUY neon weapon. Hand-built LED signs inspired by the Zombies wall-buys.",
};

export default function ShopPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-14">
      <header className="mb-10">
        <h1 className="display text-5xl">Shop the Wall</h1>
        <p className="mt-2 max-w-xl text-ash">
          Every weapon on the wall, ready to mount. Press &amp; hold to buy.
        </p>
      </header>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((p) => (
          <ProductCard key={p.slug} product={p} />
        ))}
      </div>
    </div>
  );
}
