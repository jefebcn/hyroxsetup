import Link from "next/link";
import Image from "next/image";
import { formatPrice } from "@/lib/format";
import { rarityColor, type Product } from "@/lib/products";
import AddToCart from "./AddToCart";

export default function ProductCard({ product }: { product: Product }) {
  return (
    <div className="group flex flex-col overflow-hidden rounded-xl border border-line bg-panel transition-colors hover:border-blood/50">
      <Link
        href={`/product/${product.slug}`}
        className="relative block aspect-[4/3] overflow-hidden bg-black"
      >
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {/* rarity + points badges */}
        <span
          className="absolute left-3 top-3 rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-widest"
          style={{
            color: rarityColor[product.rarity],
            borderColor: `${rarityColor[product.rarity]}66`,
            backgroundColor: "rgba(0,0,0,0.55)",
          }}
        >
          {product.rarity}
        </span>
        <span className="absolute right-3 top-3 rounded-full bg-black/55 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-widest text-ash">
          {product.points} pts
        </span>
        {!product.inStock && (
          <span className="absolute inset-x-0 bottom-0 bg-black/70 py-1.5 text-center text-xs font-bold uppercase tracking-widest text-blood-bright">
            Sold out
          </span>
        )}
      </Link>

      <div className="flex flex-1 flex-col p-4">
        <Link href={`/product/${product.slug}`}>
          <h3 className="display text-xl text-bone group-hover:text-white">
            {product.name}
          </h3>
        </Link>
        <p className="mt-1 line-clamp-2 text-sm text-ash">{product.tagline}</p>
        <div className="mt-3 flex items-center justify-between">
          <span className="display text-lg text-bone">
            {formatPrice(product.priceCents)}
          </span>
        </div>
        <div className="mt-4">
          {product.inStock ? (
            <AddToCart
              slug={product.slug}
              priceCents={product.priceCents}
              points={product.points}
              size="sm"
            />
          ) : (
            <div className="rounded-md border border-line bg-elevated px-4 py-3 text-center text-xs font-bold uppercase tracking-widest text-ash">
              Out of stock
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
