import Link from "next/link";
import Image from "next/image";
import { formatPrice } from "@/lib/format";
import { rarityColor, BLUR_DATA_URL, type Product } from "@/lib/products";
import AddToCart from "./AddToCart";
import Stars from "./Stars";

export default function ProductCard({ product }: { product: Product }) {
  const accent = rarityColor[product.rarity];
  return (
    <div className="group card relative flex flex-col overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:border-blood/40 hover:shadow-[0_24px_60px_-30px_rgba(0,0,0,0.9)]">
      {/* rarity top accent */}
      <span
        className="absolute inset-x-0 top-0 z-10 h-0.5 opacity-70"
        style={{ background: `linear-gradient(90deg, transparent, ${accent}, transparent)` }}
      />
      <Link
        href={`/product/${product.slug}`}
        className="relative block aspect-[4/3] overflow-hidden bg-black"
      >
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          placeholder="blur"
          blurDataURL={BLUR_DATA_URL}
          className="object-cover transition-transform duration-700 group-hover:scale-[1.07]"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/70 via-transparent to-transparent" />
        <span
          className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-widest backdrop-blur"
          style={{ color: accent, borderColor: `${accent}55`, backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: accent }} />
          {product.rarity}
        </span>
        <span className="pill-gold absolute right-3 top-3 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest backdrop-blur">
          {product.points} pts
        </span>
        {!product.inStock && (
          <span className="absolute inset-x-0 bottom-0 bg-black/75 py-1.5 text-center text-xs font-bold uppercase tracking-widest text-blood-bright">
            Sold out
          </span>
        )}
      </Link>

      <div className="flex flex-1 flex-col p-5">
        <Link href={`/product/${product.slug}`}>
          <h3 className="display text-xl uppercase tracking-tight text-bone transition-colors group-hover:text-white">
            {product.name}
          </h3>
        </Link>
        <Stars rating={product.rating} reviews={product.reviews} className="mt-2" />
        <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-ash">
          {product.tagline}
        </p>
        <div className="mt-4 flex items-baseline gap-2">
          <span className="display text-2xl text-bone">
            {formatPrice(product.priceCents)}
          </span>
          <span className="text-[11px] uppercase tracking-widest text-ash">
            + shipping
          </span>
        </div>
        <div className="mt-5">
          {product.inStock ? (
            <AddToCart
              slug={product.slug}
              priceCents={product.priceCents}
              points={product.points}
              size="sm"
            />
          ) : (
            <div className="rounded-lg border border-line bg-elevated px-4 py-3 text-center text-xs font-bold uppercase tracking-widest text-ash">
              Out of stock
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
