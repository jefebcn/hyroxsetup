import Link from "next/link";
import Image from "next/image";
import { SITE } from "@/lib/site";
import { formatPrice } from "@/lib/format";

const shopLinks = [
  { href: "/shop", label: "All weapons" },
  { href: "/product/olympia", label: "Olympia" },
  { href: "/product/ak47", label: "AK-47" },
  { href: "/product/ray-gun", label: "Ray Gun" },
];
const infoLinks = [
  { href: "/about", label: "The Story" },
  { href: "/contact", label: "Contact" },
  { href: "/shipping-returns", label: "Shipping & Returns" },
];
const legalLinks = [
  { href: "/privacy", label: "Privacy Policy" },
  { href: "/cookie-policy", label: "Cookie Policy" },
  { href: "/terms", label: "Terms of Service" },
];
const payments = ["Visa", "Mastercard", "Amex", "Apple Pay", "Google Pay"];

export default function Footer() {
  return (
    <footer className="relative mt-24 border-t border-line bg-panel">
      {/* CTA band */}
      <div className="border-b border-line">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-5 px-4 py-10 text-center md:flex-row md:text-left">
          <div>
            <h3 className="display text-3xl text-bone">
              Join the <span className="text-blood-bright">horde</span>
            </h3>
            <p className="mt-1 text-sm text-ash">
              New weapons drop on TikTok first. Follow to vote on what we build next.
            </p>
          </div>
          <div className="flex gap-3">
            <a href={SITE.socials.tiktok} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
              Follow on TikTok
            </a>
            <a href={SITE.socials.instagram} target="_blank" rel="noopener noreferrer" className="btn btn-ghost">
              Instagram
            </a>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 py-14">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <Image
              src="/brand/wallbuy-logo.jpg"
              alt="WALL BUY — Premium LED Wall Art Collection"
              width={1200}
              height={655}
              className="w-full max-w-[320px] rounded-xl border border-line"
            />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-ash">
              {SITE.description}
            </p>
            <div className="mt-5 flex flex-wrap gap-1.5">
              {payments.map((p) => (
                <span
                  key={p}
                  className="rounded-md border border-line bg-elevated px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-ash"
                >
                  {p}
                </span>
              ))}
            </div>
          </div>

          <FooterCol title="Shop" links={shopLinks} />
          <FooterCol title="Info" links={infoLinks} />
          <FooterCol title="Legal" links={legalLinks} />
        </div>

        <div className="mt-12 space-y-3 border-t border-line pt-6 text-xs text-ash">
          <p>
            <strong className="text-bone">Not affiliated.</strong> WALL BUY is an
            independent maker of fan-inspired neon art and is not affiliated with,
            endorsed by, or sponsored by Activision Publishing, Inc. &ldquo;Call of
            Duty&rdquo; and &ldquo;Zombies&rdquo; are trademarks of their respective
            owners. All product silhouettes are original neon interpretations.
          </p>
          <div className="flex flex-col justify-between gap-2 sm:flex-row">
            <span>
              © {new Date().getFullYear()} {SITE.company.legalName}. All rights
              reserved.
            </span>
            <span>
              Free shipping over {formatPrice(SITE.freeShippingOverCents)} · Secure
              checkout by Stripe
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({
  title,
  links,
}: {
  title: string;
  links: { href: string; label: string }[];
}) {
  return (
    <div>
      <h3 className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-bone">
        {title}
      </h3>
      <ul className="space-y-2.5 text-sm text-ash">
        {links.map((l) => (
          <li key={l.href}>
            <Link href={l.href} className="transition-colors hover:text-bone">
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
