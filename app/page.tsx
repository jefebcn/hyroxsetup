import Link from "next/link";
import Image from "next/image";
import { Zap, Truck, ShieldCheck, Sparkles } from "lucide-react";
import { products } from "@/lib/products";
import { SITE } from "@/lib/site";
import ProductCard from "@/components/ProductCard";

export default function Home() {
  const featured = products.filter((p) => p.featured);

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-line">
        <div className="grid-bg absolute inset-0 opacity-70" />
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(60% 60% at 70% 30%, rgba(210,31,36,0.18), transparent 70%)",
          }}
        />
        <div className="relative mx-auto grid max-w-6xl items-center gap-8 px-4 py-16 md:grid-cols-2 md:py-24">
          <div className="rise">
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.3em] text-blood-bright">
              Neon wall-buys · Zombies collection
            </p>
            <h1 className="display text-5xl leading-[0.9] sm:text-6xl md:text-7xl">
              Buy it
              <br />
              off the <span className="text-blood neon-red flicker">wall</span>.
            </h1>
            <p className="mt-5 max-w-md text-ash">
              Hand-built LED neon weapons inspired by the wall-buys you slap on
              every round. Mount your loadout. Light up the room.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                href="/shop"
                className="rounded-md bg-blood px-6 py-4 text-sm font-bold uppercase tracking-widest text-white transition-colors hover:bg-blood-bright"
              >
                Shop the wall
              </Link>
              <a
                href={SITE.socials.tiktok}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-md border border-line px-6 py-4 text-sm font-bold uppercase tracking-widest text-bone transition-colors hover:border-blood/60"
              >
                Watch on TikTok
              </a>
            </div>
          </div>

          <div className="relative rise">
            <div className="relative aspect-[3/4] overflow-hidden rounded-2xl border border-line bg-black shadow-2xl shadow-black/60">
              <Image
                src="/products/raygun.jpg"
                alt="Ray Gun neon sign"
                fill
                priority
                sizes="(max-width: 768px) 100vw, 40vw"
                className="object-cover"
              />
            </div>
            <div className="absolute -bottom-4 left-4 rounded-md border border-blood/50 bg-ink/90 px-4 py-2 text-xs font-bold uppercase tracking-widest text-bone backdrop-blur">
              Wonder Weapon · Ray Gun
            </div>
          </div>
        </div>
      </section>

      {/* Feature strip */}
      <section className="border-b border-line bg-panel">
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-6 px-4 py-8 md:grid-cols-4">
          <Feature
            icon={<Zap className="h-5 w-5" />}
            title="Real neon-flex"
            text="Hand-shaped LED, not a printed sticker."
          />
          <Feature
            icon={<Sparkles className="h-5 w-5" />}
            title="Remote dimmer"
            text="Set the mood, on or off in one click."
          />
          <Feature
            icon={<Truck className="h-5 w-5" />}
            title="Ships worldwide"
            text={`Free over ${(SITE.freeShippingOverCents / 100).toFixed(0)}€.`}
          />
          <Feature
            icon={<ShieldCheck className="h-5 w-5" />}
            title="14-day returns"
            text="Not stoked? Send it back."
          />
        </div>
      </section>

      {/* Featured products */}
      <section className="mx-auto max-w-6xl px-4 py-16">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <h2 className="display text-4xl">The Wall</h2>
            <p className="mt-1 text-ash">
              Press &amp; hold to buy. Just like the game.
            </p>
          </div>
          <Link
            href="/shop"
            className="hidden text-xs font-bold uppercase tracking-widest text-ash hover:text-bone sm:block"
          >
            View all →
          </Link>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((p) => (
            <ProductCard key={p.slug} product={p} />
          ))}
        </div>
      </section>

      {/* TikTok CTA */}
      <section className="border-y border-line bg-panel">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 px-4 py-14 text-center">
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-blood-bright">
            Seen us on TikTok?
          </p>
          <h2 className="display max-w-2xl text-4xl">
            The wall-buy that broke the algorithm
          </h2>
          <p className="max-w-xl text-ash">
            Drop a comment with the weapon you want next — we build the wall the
            community votes for.
          </p>
          <a
            href={SITE.socials.tiktok}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 rounded-md bg-blood px-6 py-4 text-sm font-bold uppercase tracking-widest text-white hover:bg-blood-bright"
          >
            Follow @wallbuy
          </a>
        </div>
      </section>
    </>
  );
}

function Feature({
  icon,
  title,
  text,
}: {
  icon: React.ReactNode;
  title: string;
  text: string;
}) {
  return (
    <div className="flex flex-col gap-2">
      <span className="flex h-10 w-10 items-center justify-center rounded-md border border-line bg-elevated text-blood-bright">
        {icon}
      </span>
      <h3 className="text-sm font-bold uppercase tracking-widest text-bone">
        {title}
      </h3>
      <p className="text-sm text-ash">{text}</p>
    </div>
  );
}
