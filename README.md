# WALL BUY — Zombies neon e-commerce

A dark, TikTok-ready storefront for **WALL BUY**: hand-built LED neon wall art
inspired by the wall-weapons of Call of Duty Zombies. Signature *"press & hold
to buy"* interaction, full cart + Stripe checkout, and all the legal pages.

## Tech stack

| Concern    | Choice                                  |
| ---------- | --------------------------------------- |
| Framework  | Next.js 16 (App Router) + React 19 + TS |
| Styling    | Tailwind CSS v4                         |
| Payments   | Stripe Checkout                         |
| Icons      | `lucide-react`                          |
| Deployment | Vercel                                  |

## Structure

```
app/
  page.tsx                 Home (hero, featured wall, TikTok CTA)
  shop/page.tsx            Product grid
  product/[slug]/page.tsx  Product detail
  cart/page.tsx            Full cart page
  checkout/success/…       Post-payment confirmation (clears cart)
  api/checkout/route.ts    Stripe Checkout session
  about · contact · shipping-returns · privacy · cookie-policy · terms
components/                Header, Footer, CartDrawer, ProductCard, AddToCart, CookieBanner, Prose
lib/
  products.ts              Catalogue (edit products & prices here)
  cart-context.tsx         Cart state (localStorage)
  site.ts                  Site config (name, emails, socials, shipping)
public/products/           Product images
```

## Getting started

```bash
npm install
cp .env.local.example .env.local   # add your Stripe key
npm run dev                        # http://localhost:3000
```

Without a Stripe key the store runs fully — browsing, cart, "press & hold to
buy" — and checkout shows a friendly "payments not switched on yet" message.

## Enabling checkout (Stripe)

1. Create a Stripe account and copy your **secret key** from
   <https://dashboard.stripe.com/apikeys>.
2. Put it in `.env.local` (and in your Vercel project env vars) as
   `STRIPE_SECRET_KEY`.
3. Set `NEXT_PUBLIC_SITE_URL` to your deployed URL.

Prices/line items are created dynamically from `lib/products.ts`, so you don't
need to pre-create products in Stripe.

## Deploy

Push to GitHub and import in Vercel (framework auto-detected as Next.js, pinned
in `vercel.json`). Add `STRIPE_SECRET_KEY` and `NEXT_PUBLIC_SITE_URL` in the
Vercel project settings.

## Note

WALL BUY is an independent brand and is not affiliated with or endorsed by
Activision. Designs are original neon interpretations sold as fan-inspired art.
The legal pages are starter templates — review them and fill in the real
company details in `lib/site.ts` before launch.
