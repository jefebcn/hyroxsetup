import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { products } from "@/lib/products";
import { SITE, siteUrl } from "@/lib/site";

// Countries we ship to (Stripe collects the address at checkout).
const ALLOWED_COUNTRIES: Stripe.Checkout.SessionCreateParams.ShippingAddressCollection.AllowedCountry[] =
  [
    "IT", "SM", "FR", "DE", "ES", "PT", "NL", "BE", "LU", "AT", "IE", "FI",
    "SE", "DK", "PL", "CZ", "GR", "RO", "HU", "SK", "SI", "HR", "BG", "EE",
    "LV", "LT", "GB", "CH", "NO", "US", "CA", "AU", "NZ",
  ];

export async function POST(req: NextRequest) {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    return NextResponse.json(
      {
        error:
          "Payments aren't switched on yet. Add your STRIPE_SECRET_KEY to enable checkout.",
      },
      { status: 503 },
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const rawItems =
    body && typeof body === "object" && Array.isArray((body as { items?: unknown }).items)
      ? ((body as { items: unknown[] }).items as unknown[])
      : [];
  if (rawItems.length === 0) {
    return NextResponse.json({ error: "Your cart is empty." }, { status: 400 });
  }

  const base = siteUrl();
  const currency = SITE.currency.toLowerCase();
  const canShowImages = base.startsWith("https://");
  const stripe = new Stripe(key);

  const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = [];
  let subtotal = 0;

  for (const raw of rawItems) {
    if (!raw || typeof raw !== "object") continue;
    const { slug, qty } = raw as { slug?: string; qty?: number };
    const product = products.find((p) => p.slug === slug);
    if (!product || !product.inStock) continue;
    const quantity = Math.max(1, Math.min(20, Math.floor(Number(qty) || 1)));
    subtotal += product.priceCents * quantity;
    lineItems.push({
      quantity,
      price_data: {
        currency,
        unit_amount: product.priceCents,
        product_data: {
          name: product.name,
          metadata: { slug: product.slug },
          ...(canShowImages ? { images: [`${base}${product.image}`] } : {}),
        },
      },
    });
  }

  if (lineItems.length === 0) {
    return NextResponse.json(
      { error: "No purchasable items in cart." },
      { status: 400 },
    );
  }

  const freeShipping = subtotal >= SITE.freeShippingOverCents;
  const shippingOption: Stripe.Checkout.SessionCreateParams.ShippingOption = {
    shipping_rate_data: {
      type: "fixed_amount",
      display_name: freeShipping ? "Free shipping" : "Standard shipping",
      fixed_amount: {
        amount: freeShipping ? 0 : SITE.flatShippingCents,
        currency,
      },
      delivery_estimate: {
        minimum: { unit: "business_day", value: 3 },
        maximum: { unit: "business_day", value: 10 },
      },
    },
  };

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: lineItems,
      success_url: `${base}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${base}/cart`,
      shipping_address_collection: { allowed_countries: ALLOWED_COUNTRIES },
      phone_number_collection: { enabled: true },
      shipping_options: [shippingOption],
      allow_promotion_codes: true,
      billing_address_collection: "auto",
    });
    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("Stripe checkout error", err);
    return NextResponse.json(
      { error: "Could not start checkout. Please try again." },
      { status: 500 },
    );
  }
}
