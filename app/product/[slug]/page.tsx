import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Truck, ShieldCheck, Undo2 } from "lucide-react";
import { getProduct, products, rarityColor } from "@/lib/products";
import { formatPrice } from "@/lib/format";
import AddToCart from "@/components/AddToCart";
import ProductCard from "@/components/ProductCard";

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) return { title: "Not found" };
  return {
    title: product.name,
    description: product.blurb,
    openGraph: {
      title: product.name,
      description: product.blurb,
      images: [product.image],
    },
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) notFound();

  const related = products.filter((p) => p.slug !== product.slug).slice(0, 3);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <nav className="mb-6 text-xs uppercase tracking-widest text-ash">
        <Link href="/shop" className="hover:text-bone">
          Shop
        </Link>{" "}
        <span className="text-line">/</span> {product.name}
      </nav>

      <div className="grid gap-10 md:grid-cols-2">
        {/* Image */}
        <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-line bg-black">
          <Image
            src={product.image}
            alt={product.name}
            fill
            priority
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover"
          />
          <span
            className="absolute left-4 top-4 rounded-full border px-3 py-1 text-[11px] font-bold uppercase tracking-widest"
            style={{
              color: rarityColor[product.rarity],
              borderColor: `${rarityColor[product.rarity]}66`,
              backgroundColor: "rgba(0,0,0,0.55)",
            }}
          >
            {product.rarity}
          </span>
        </div>

        {/* Info */}
        <div>
          <h1 className="display text-4xl sm:text-5xl">{product.name}</h1>
          <p className="mt-2 text-ash">{product.tagline}</p>

          <div className="mt-5 flex items-baseline gap-3">
            <span className="display text-3xl text-bone">
              {formatPrice(product.priceCents)}
            </span>
            <span className="text-xs uppercase tracking-widest text-ash">
              incl. VAT · excl. shipping
            </span>
          </div>

          <p className="mt-5 leading-relaxed text-ash">{product.blurb}</p>

          <div className="mt-6 max-w-sm">
            {product.inStock ? (
              <AddToCart
                slug={product.slug}
                priceCents={product.priceCents}
                points={product.points}
              />
            ) : (
              <div className="rounded-md border border-line bg-elevated px-4 py-4 text-center text-sm font-bold uppercase tracking-widest text-ash">
                Sold out — back soon
              </div>
            )}
          </div>

          {/* trust row */}
          <div className="mt-6 grid grid-cols-3 gap-3 text-center text-[11px] uppercase tracking-widest text-ash">
            <TrustItem icon={<Truck className="h-4 w-4" />} label="Ships worldwide" />
            <TrustItem icon={<Undo2 className="h-4 w-4" />} label="14-day returns" />
            <TrustItem icon={<ShieldCheck className="h-4 w-4" />} label="Secure checkout" />
          </div>

          {/* specs */}
          <div className="mt-8 rounded-xl border border-line bg-panel">
            <h2 className="border-b border-line px-5 py-3 text-xs font-bold uppercase tracking-widest text-bone">
              Specifications
            </h2>
            <dl className="divide-y divide-line">
              {product.specs.map((s) => (
                <div key={s.label} className="flex justify-between px-5 py-3 text-sm">
                  <dt className="text-ash">{s.label}</dt>
                  <dd className="text-bone">{s.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>

      {/* related */}
      <section className="mt-20">
        <h2 className="display mb-6 text-3xl">More off the wall</h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {related.map((p) => (
            <ProductCard key={p.slug} product={p} />
          ))}
        </div>
      </section>
    </div>
  );
}

function TrustItem({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="flex flex-col items-center gap-1.5 rounded-md border border-line bg-panel py-3">
      <span className="text-blood-bright">{icon}</span>
      {label}
    </div>
  );
}
