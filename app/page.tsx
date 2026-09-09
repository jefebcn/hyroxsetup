import Link from "next/link";
import Image from "next/image";
import {
  Zap,
  Truck,
  ShieldCheck,
  Sparkles,
  Star,
  MousePointerClick,
  Wrench,
  Quote,
} from "lucide-react";
import { products } from "@/lib/products";
import { SITE } from "@/lib/site";
import ProductCard from "@/components/ProductCard";
import Faq from "@/components/Faq";
import { formatPrice } from "@/lib/format";

export default function Home() {
  const featured = products.filter((p) => p.featured);

  return (
    <>
      {/* ===== HERO ===== */}
      <section className="relative overflow-hidden border-b border-line">
        <div className="grid-bg absolute inset-0" />
        <div className="noise pointer-events-none absolute inset-0" />
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(70% 60% at 72% 28%, rgba(225,29,36,0.22), transparent 68%)",
          }}
        />
        <div className="relative mx-auto grid max-w-6xl items-center gap-10 px-4 py-20 md:grid-cols-[1.05fr_0.95fr] md:py-28">
          <div className="rise">
            <span className="eyebrow">Zombies Neon Collection</span>
            <h1 className="display mt-5 text-6xl uppercase leading-[0.86] sm:text-7xl md:text-[5.5rem]">
              Buy it
              <br />
              off the{" "}
              <span className="text-blood neon-red flicker">wall</span>.
            </h1>
            <p className="mt-6 max-w-md text-lg leading-relaxed text-ash">
              Hand-built LED neon weapons inspired by the wall-buys you slap on
              every round. Mount your loadout. Light up the room.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/shop" className="btn btn-primary">
                Shop the wall
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
            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 text-xs uppercase tracking-widest text-ash">
              <span className="inline-flex items-center gap-1.5">
                <span className="flex text-gold">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="h-3.5 w-3.5 fill-current" />
                  ))}
                </span>
                Loved by the community
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Truck className="h-4 w-4 text-blood-bright" /> Ships worldwide
              </span>
            </div>
          </div>

          <div className="relative rise">
            <div className="float relative aspect-[3/4] overflow-hidden rounded-2xl border border-line bg-black glow-red">
              <Image
                src="/products/raygun.jpg"
                alt="Ray Gun neon sign"
                fill
                priority
                sizes="(max-width: 768px) 90vw, 40vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent" />
            </div>
            <div className="card absolute -bottom-5 -left-3 flex items-center gap-3 px-4 py-3 backdrop-blur">
              <span className="pill-gold rounded-md px-2 py-1 text-[10px] font-bold uppercase tracking-widest">
                Legendary
              </span>
              <div>
                <p className="display text-sm uppercase text-bone">Ray Gun</p>
                <p className="text-[11px] text-ash">Wonder Weapon · {formatPrice(11990)}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== TRUST STRIP ===== */}
      <section className="border-b border-line bg-panel">
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-px overflow-hidden md:grid-cols-4">
          <Feature icon={<Zap />} title="Real neon-flex" text="Hand-shaped LED, never a printed sticker." />
          <Feature icon={<Sparkles />} title="Remote dimmer" text="Set the vibe — on, off, dimmed, in a click." />
          <Feature icon={<Truck />} title="Ships worldwide" text={`Free over ${formatPrice(SITE.freeShippingOverCents)}.`} />
          <Feature icon={<ShieldCheck />} title="14-day returns" text="Not stoked? Send it back, no drama." />
        </div>
      </section>

      {/* ===== FEATURED / THE WALL ===== */}
      <section className="mx-auto max-w-6xl px-4 py-20">
        <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <span className="eyebrow">The arsenal</span>
            <h2 className="display mt-3 text-4xl uppercase sm:text-5xl">The Wall</h2>
            <p className="mt-2 max-w-md text-ash">
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

      {/* ===== HOW IT WORKS ===== */}
      <section className="border-y border-line bg-panel">
        <div className="mx-auto max-w-6xl px-4 py-20">
          <div className="mb-12 text-center">
            <span className="eyebrow justify-center">Three rounds</span>
            <h2 className="display mt-3 text-4xl uppercase sm:text-5xl">How it works</h2>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            <Step
              n="01"
              icon={<MousePointerClick />}
              title="Pick your weapon"
              text="Browse the wall and choose the neon that fits your loadout."
            />
            <Step
              n="02"
              icon={<Zap />}
              title="Press & hold to buy"
              text="Hold the buy button — just like the game — and it drops in your cart."
            />
            <Step
              n="03"
              icon={<Wrench />}
              title="Mount & glow"
              text="Hang it, plug it in, dial the dimmer. Your room just got a Pack-a-Punch."
            />
          </div>
        </div>
      </section>

      {/* ===== QUALITY SPLIT ===== */}
      <section className="mx-auto max-w-6xl px-4 py-20">
        <div className="grid items-center gap-10 md:grid-cols-2">
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-line bg-black">
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
            <h2 className="display mt-3 text-4xl uppercase sm:text-5xl">
              Studio-grade neon,
              <br /> made to be seen
            </h2>
            <ul className="mt-6 space-y-4">
              {[
                ["Flexible LED neon", "Even, glare-free glow that photographs incredibly for your clips."],
                ["Matte-black acrylic", "Premium panel that disappears into the wall so the neon pops."],
                ["Remote + dimmer", "Full brightness control and one-tap on/off from the couch."],
                ["Ready to hang", "Mounting hardware and adapter included — up in minutes."],
              ].map(([t, d]) => (
                <li key={t} className="flex gap-3">
                  <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-blood" />
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
          <div className="mb-12 grid gap-6 sm:grid-cols-3">
            <Stat value="2k+" label="Signs shipped" />
            <Stat value="4.9/5" label="Average rating" />
            <Stat value="40+" label="Countries" />
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {[
              ["This thing is unreal in person. My whole setup changed.", "@nightmare_ops"],
              ["Bought the Ray Gun after seeing it on my FYP. No regrets.", "@round100"],
              ["Packaging was insane and it lights up perfectly. 10/10.", "@camo_grind"],
            ].map(([quote, handle]) => (
              <figure key={handle} className="card p-6">
                <Quote className="h-6 w-6 text-blood" />
                <blockquote className="mt-3 text-sm leading-relaxed text-bone">
                  “{quote}”
                </blockquote>
                <figcaption className="mt-4 text-xs uppercase tracking-widest text-ash">
                  {handle}
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FAQ ===== */}
      <section className="mx-auto max-w-6xl px-4 py-20">
        <div className="mb-10 text-center">
          <span className="eyebrow justify-center">Good to know</span>
          <h2 className="display mt-3 text-4xl uppercase sm:text-5xl">FAQ</h2>
        </div>
        <Faq />
      </section>

      {/* ===== FINAL CTA ===== */}
      <section className="relative overflow-hidden border-t border-line">
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(60% 120% at 50% 0%, rgba(225,29,36,0.25), transparent 70%)",
          }}
        />
        <div className="relative mx-auto flex max-w-3xl flex-col items-center gap-5 px-4 py-24 text-center">
          <span className="eyebrow justify-center">Last chance before the horde</span>
          <h2 className="display text-4xl uppercase sm:text-6xl">
            Light up your <span className="text-blood neon-red">battlestation</span>
          </h2>
          <p className="max-w-lg text-ash">
            Free shipping over {formatPrice(SITE.freeShippingOverCents)}. Built to
            order, shipped worldwide.
          </p>
          <Link href="/shop" className="btn btn-primary mt-2">
            Shop the wall
          </Link>
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
    <div className="flex flex-col gap-2 bg-panel p-6 outline outline-1 -outline-offset-[0.5px] outline-line">
      <span className="flex h-10 w-10 items-center justify-center rounded-lg border border-line bg-elevated text-blood-bright [&>svg]:h-5 [&>svg]:w-5">
        {icon}
      </span>
      <h3 className="mt-1 text-sm font-semibold uppercase tracking-widest text-bone">
        {title}
      </h3>
      <p className="text-sm text-ash">{text}</p>
    </div>
  );
}

function Step({
  n,
  icon,
  title,
  text,
}: {
  n: string;
  icon: React.ReactNode;
  title: string;
  text: string;
}) {
  return (
    <div className="card relative p-7">
      <span className="display absolute right-5 top-4 text-5xl text-line">{n}</span>
      <span className="flex h-12 w-12 items-center justify-center rounded-lg border border-blood/40 bg-blood/10 text-blood-bright [&>svg]:h-6 [&>svg]:w-6">
        {icon}
      </span>
      <h3 className="display mt-5 text-2xl uppercase text-bone">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-ash">{text}</p>
    </div>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="card flex flex-col items-center py-8 text-center">
      <span className="display text-5xl text-blood-bright">{value}</span>
      <span className="mt-2 text-xs uppercase tracking-widest text-ash">{label}</span>
    </div>
  );
}
