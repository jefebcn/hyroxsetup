import Link from "next/link";
import Image from "next/image";
import { Zap, Truck, ShieldCheck, Sparkles, Star, Quote, BadgeCheck } from "lucide-react";
import { products } from "@/lib/products";
import { SITE } from "@/lib/site";
import ProductCard from "@/components/ProductCard";
import HowItWorks from "@/components/HowItWorks";
import Faq from "@/components/Faq";
import JsonLd from "@/components/JsonLd";
import Stars from "@/components/Stars";
import { FAQ_ITEMS } from "@/lib/faq";
import { featuredReviews } from "@/lib/reviews";
import { formatPrice } from "@/lib/format";

export default function Home() {
  const featured = products.filter((p) => p.featured);

  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ_ITEMS.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };

  return (
    <>
      <JsonLd data={faqLd} />
      {/* ===== HERO (full-bleed, image-led) ===== */}
      <section className="relative isolate flex min-h-[86vh] items-end overflow-hidden border-b border-line">
        <Image
          src="/products/olympia.jpg"
          alt="Olympia LED neon sign glowing above a gaming battlestation"
          fill
          priority
          sizes="100vw"
          className="-z-10 object-cover"
        />
        {/* legibility overlays */}
        <div className="absolute inset-0 -z-10 bg-linear-to-t from-ink via-ink/75 to-ink/25" />
        <div className="absolute inset-0 -z-10 bg-linear-to-r from-ink/85 via-ink/20 to-transparent" />

        <div className="relative mx-auto w-full max-w-6xl px-4 pb-14 pt-28 md:pb-20">
          <div className="max-w-xl rise">
            <span className="eyebrow">Zombies Neon Collection</span>
            <h1 className="display mt-5 text-5xl leading-[0.95] sm:text-6xl md:text-7xl">
              Buy it off the <span className="text-grad">wall</span>.
            </h1>
            <p className="mt-5 max-w-md text-base leading-relaxed text-bone/85 sm:text-lg">
              Hand-built LED neon weapons from the wall-buys you slap on every
              round. Mount your loadout. Light up the room.
            </p>
            <div className="mt-7 flex flex-wrap items-center gap-3">
              <Link href="/shop" className="btn btn-primary">
                Shop the collection
              </Link>
              <a
                href={SITE.socials.tiktok}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-ghost"
              >
                Watch on TikTok
              </a>
            </div>
            <div className="mt-7 flex flex-wrap items-center gap-x-7 gap-y-3 text-xs uppercase tracking-widest text-ash">
              <span className="inline-flex items-center gap-2">
                <span className="flex text-gold">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="h-3.5 w-3.5 fill-current" />
                  ))}
                </span>
                4.9 / 5 · loved by 2k+
              </span>
              <span className="inline-flex items-center gap-2">
                <Truck className="h-4 w-4 text-blood-bright" /> Ships worldwide
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ===== FEATURED / THE WALL — right under the fold so new visitors see what to buy ===== */}
      <section className="mx-auto max-w-6xl px-4 py-16 md:py-20">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <span className="eyebrow">The arsenal</span>
            <h2 className="display mt-4 text-4xl sm:text-5xl">Grab a weapon</h2>
            <p className="mt-3 max-w-md text-ash">
              Press &amp; hold to buy — exactly like slapping it off the wall in-game.
            </p>
          </div>
          <Link
            href="/shop"
            className="text-xs font-semibold uppercase tracking-widest text-ash transition-colors hover:text-bone"
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

      {/* ===== TRUST STRIP ===== */}
      <section className="border-y border-line bg-panel">
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-px overflow-hidden md:grid-cols-4">
          <Feature icon={<Zap />} perk="Built tough" title="Real neon-flex" text="Hand-shaped LED, never a printed sticker." />
          <Feature icon={<Sparkles />} perk="Full control" title="Remote dimmer" text="Set the vibe — on, off, dimmed, in a click." />
          <Feature icon={<Truck />} perk="Free over €150" title="Ships worldwide" text={`Free over ${formatPrice(SITE.freeShippingOverCents)}.`} />
          <Feature icon={<ShieldCheck />} perk="Risk-free" title="14-day returns" text="Not stoked? Send it back, no drama." />
        </div>
      </section>

      {/* ===== HOW IT WORKS (interactive rounds) ===== */}
      <section className="border-b border-line bg-panel">
        <HowItWorks />
      </section>

      {/* ===== QUALITY SPLIT ===== */}
      <section className="mx-auto max-w-6xl px-4 py-20">
        <div className="grid items-center gap-10 md:grid-cols-2">
          <div className="vignette relative aspect-[4/3] overflow-hidden rounded-2xl border border-line bg-black">
            <Image
              src="/products/ak47.jpg"
              alt="AK-47 neon sign detail"
              fill
              sizes="(max-width: 768px) 90vw, 45vw"
              className="object-cover"
            />
          </div>
          <div>
            <span className="eyebrow">Built to last the horde</span>
            <h2 className="display mt-4 text-4xl sm:text-5xl">
              Studio-grade neon,
              <br /> made to be seen
            </h2>
            <ul className="mt-7 space-y-4">
              {[
                ["Flexible LED neon", "Even, glare-free glow that photographs incredibly for your clips."],
                ["Matte-black acrylic", "Premium panel that disappears into the wall so the neon pops."],
                ["Remote + dimmer", "Full brightness control and one-tap on/off from the couch."],
                ["Ready to hang", "Mounting hardware and adapter included — up in minutes."],
              ].map(([t, d]) => (
                <li key={t} className="flex gap-3">
                  <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-blood" />
                  <span>
                    <span className="font-semibold text-bone">{t}. </span>
                    <span className="text-ash">{d}</span>
                  </span>
                </li>
              ))}
            </ul>
            <Link href="/shop" className="btn btn-primary mt-8">
              Shop the collection
            </Link>
          </div>
        </div>
      </section>

      {/* ===== SOCIAL PROOF ===== */}
      <section className="border-y border-line bg-panel">
        <div className="mx-auto max-w-6xl px-4 py-20">
          <div className="mb-10 text-center">
            <span className="eyebrow justify-center">Loved by the community</span>
            <h2 className="display mt-4 text-4xl sm:text-5xl">Off the wall, worldwide</h2>
          </div>

          <div className="mb-12 grid gap-6 sm:grid-cols-3">
            <Stat value="2k+" label="Signs shipped" />
            <Stat value="4.9/5" label="Average rating" />
            <Stat value="40+" label="Countries" />
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {featuredReviews().map((r) => {
              const product = products.find((p) => p.slug === r.slug);
              const initial = r.author.replace(/^@/, "").charAt(0).toUpperCase();
              return (
                <figure
                  key={r.author}
                  className="group relative flex flex-col overflow-hidden rounded-2xl border border-line bg-ink/40 p-6 transition-all duration-300 hover:-translate-y-1 hover:border-blood/40"
                >
                  <span className="absolute inset-x-0 top-0 h-0.5 origin-left scale-x-0 bg-blood transition-transform duration-300 group-hover:scale-x-100" />
                  <div className="flex items-center justify-between">
                    <Stars rating={r.rating} size="sm" />
                    <Quote className="h-5 w-5 text-blood/70" />
                  </div>

                  {r.title && (
                    <p className="mt-4 font-semibold text-bone">“{r.title}”</p>
                  )}
                  <blockquote className="mt-1.5 flex-1 text-sm leading-relaxed text-ash">
                    {r.body}
                  </blockquote>

                  <figcaption className="mt-5 flex items-center gap-3 border-t border-line pt-4">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-blood/40 bg-blood/10 text-sm font-bold text-blood-bright">
                      {initial}
                    </span>
                    <span className="min-w-0">
                      <span className="flex items-center gap-1.5">
                        <span className="truncate text-sm font-semibold text-bone">
                          {r.author}
                        </span>
                        {r.verified && (
                          <BadgeCheck className="h-3.5 w-3.5 shrink-0 text-gold" />
                        )}
                      </span>
                      {product && (
                        <span className="text-[11px] uppercase tracking-widest text-ash">
                          Bought the {product.weapon}
                        </span>
                      )}
                    </span>
                  </figcaption>
                </figure>
              );
            })}
          </div>

          <div className="mt-10 text-center">
            <a
              href={SITE.socials.tiktok}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-ghost"
            >
              See it on TikTok
            </a>
          </div>
        </div>
      </section>

      {/* ===== FAQ ===== */}
      <section className="mx-auto max-w-6xl px-4 py-20">
        <div className="mb-10 text-center">
          <span className="eyebrow justify-center">Good to know</span>
          <h2 className="display mt-4 text-4xl sm:text-5xl">FAQ</h2>
        </div>
        <Faq />
      </section>

      {/* ===== FINAL CTA ===== */}
      <section className="relative overflow-hidden border-t border-line">
        {/* living atmosphere: crimson from the top, Element-115 green from below */}
        <div className="cta-glow-red pointer-events-none absolute inset-0" />
        <div className="cta-glow-green pointer-events-none absolute inset-0" />

        <div className="relative mx-auto flex max-w-3xl flex-col items-center gap-6 px-4 py-28 text-center">
          <span className="eyebrow justify-center">Last chance before the horde</span>
          <h2 className="display text-5xl leading-[0.95] sm:text-6xl md:text-7xl">
            Light up your <span className="text-grad">battlestation</span>
          </h2>
          <p className="max-w-lg text-base text-ash sm:text-lg">
            Hand-built LED neon weapons — built to order, shipped worldwide.
          </p>

          {/* offer chips */}
          <div className="flex flex-wrap justify-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-line bg-panel px-3 py-1.5 text-[11px] font-semibold uppercase tracking-widest text-ash">
              <Truck className="h-3.5 w-3.5 text-blood-bright" /> Free over{" "}
              {formatPrice(SITE.freeShippingOverCents)}
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-[#7ed957]/40 bg-[#7ed957]/10 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-widest text-[#7ed957]">
              <Zap className="h-3.5 w-3.5" /> Buy 2, save {SITE.bundle.percent}%
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-line bg-panel px-3 py-1.5 text-[11px] font-semibold uppercase tracking-widest text-ash">
              <ShieldCheck className="h-3.5 w-3.5 text-blood-bright" /> Secure checkout
            </span>
          </div>

          <div className="mt-1 flex flex-wrap justify-center gap-3">
            <Link href="/shop" className="btn btn-primary">
              Shop the collection
            </Link>
            <a
              href={SITE.socials.tiktok}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-ghost"
            >
              Watch on TikTok
            </a>
          </div>

          <p className="mt-2 text-xs uppercase tracking-widest text-ash">
            Ships worldwide · 14-day returns · Remote dimmer included
          </p>
        </div>
      </section>
    </>
  );
}

function Feature({
  icon,
  perk,
  title,
  text,
}: {
  icon: React.ReactNode;
  perk: string;
  title: string;
  text: string;
}) {
  return (
    <div className="group relative flex flex-col gap-2 bg-panel p-6 outline outline-1 -outline-offset-[0.5px] outline-line transition-colors duration-300 hover:bg-elevated">
      {/* crimson accent that wipes in on hover */}
      <span className="absolute inset-x-0 top-0 h-0.5 origin-left scale-x-0 bg-blood transition-transform duration-300 group-hover:scale-x-100" />
      <div className="flex items-center justify-between">
        <span className="flex h-10 w-10 items-center justify-center rounded-lg border border-line bg-elevated text-blood-bright transition-all duration-300 group-hover:-translate-y-0.5 group-hover:border-blood/50 group-hover:shadow-[0_0_16px_-5px_rgba(217,44,58,0.75)] [&>svg]:h-5 [&>svg]:w-5">
          {icon}
        </span>
        <span className="pill-gold rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-widest opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          {perk}
        </span>
      </div>
      <h3 className="mt-1 text-sm font-semibold uppercase tracking-widest text-bone">
        {title}
      </h3>
      <p className="text-sm text-ash">{text}</p>
    </div>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="card group flex flex-col items-center py-8 text-center transition-all duration-300 hover:-translate-y-1 hover:border-blood/40">
      <span className="display text-5xl text-bone transition-colors duration-300 group-hover:text-blood-bright">
        {value}
      </span>
      <span className="mt-2 text-xs uppercase tracking-widest text-ash">{label}</span>
    </div>
  );
}
