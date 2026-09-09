import Link from "next/link";
import { SITE } from "@/lib/site";

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

export default function Footer() {
  return (
    <footer className="mt-24 border-t border-line bg-panel">
      <div className="mx-auto max-w-6xl px-4 py-12">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-blood neon-red leading-none">|||||</span>
              <span className="display text-2xl">
                WALL<span className="text-blood">BUY</span>
              </span>
            </div>
            <p className="mt-3 max-w-xs text-sm text-ash">{SITE.description}</p>
            <div className="mt-4 flex gap-3 text-xs font-bold uppercase tracking-widest">
              <a
                href={SITE.socials.tiktok}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-md border border-line px-3 py-2 text-bone hover:border-blood/60"
              >
                TikTok
              </a>
              <a
                href={SITE.socials.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-md border border-line px-3 py-2 text-bone hover:border-blood/60"
              >
                Instagram
              </a>
            </div>
          </div>

          <FooterCol title="Shop" links={shopLinks} />
          <FooterCol title="Info" links={infoLinks} />
          <FooterCol title="Legal" links={legalLinks} />
        </div>

        <div className="mt-10 space-y-3 border-t border-line pt-6 text-xs text-ash">
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
            <span>Secure payments via Stripe · Cards · Apple Pay · Google Pay</span>
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
      <h3 className="mb-3 text-xs font-bold uppercase tracking-widest text-bone">
        {title}
      </h3>
      <ul className="space-y-2 text-sm text-ash">
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
