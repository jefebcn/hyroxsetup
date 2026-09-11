import { NextRequest, NextResponse } from "next/server";
import { SITE, siteUrl } from "@/lib/site";
import { priceCart } from "@/lib/cart-pricing";
import { isSumUpConfigured, createSumUpCheckout } from "@/lib/sumup";
import { shipToSummary, type ShippingDetails } from "@/lib/order";

function newReference(): string {
  return `wallbuy-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

/**
 * Creates a SumUp hosted checkout for the cart. Prices are computed server-side
 * from our own catalog (see priceCart), so the charged amount can't be tampered
 * with. Returns the SumUp-hosted payment URL to redirect the shopper to.
 */
export async function POST(req: NextRequest) {
  if (!isSumUpConfigured) {
    return NextResponse.json(
      {
        error:
          "Card payments aren't switched on yet. Add your SumUp keys to enable checkout.",
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

  const obj = (body ?? {}) as {
    items?: { slug?: string; qty?: number }[];
    shipping?: Partial<ShippingDetails>;
  };
  const rawItems = Array.isArray(obj.items) ? obj.items : [];
  if (rawItems.length === 0) {
    return NextResponse.json({ error: "Your cart is empty." }, { status: 400 });
  }

  const cart = priceCart(rawItems);
  if (cart.items.length === 0) {
    return NextResponse.json(
      { error: "No purchasable items in cart." },
      { status: 400 },
    );
  }

  const amount = Number((cart.totalCents / 100).toFixed(2));
  const reference = newReference();
  const shipTo = shipToSummary(obj.shipping);
  const description = `${SITE.name}: ${cart.totalQty} item${
    cart.totalQty > 1 ? "s" : ""
  }${shipTo ? ` — ship to ${shipTo}` : ""}`.slice(0, 255);

  try {
    const checkout = await createSumUpCheckout({
      amount,
      currency: SITE.currency,
      reference,
      description,
      redirectUrl: `${siteUrl()}/checkout/success`,
    });
    if (!checkout.hosted_checkout_url) {
      console.error("SumUp checkout missing hosted_checkout_url", checkout.id);
      return NextResponse.json(
        { error: "Could not start checkout. Please try again." },
        { status: 502 },
      );
    }
    return NextResponse.json({
      id: checkout.id,
      reference,
      hosted_checkout_url: checkout.hosted_checkout_url,
    });
  } catch (err) {
    console.error("SumUp create-checkout exception", err);
    return NextResponse.json(
      { error: "Could not start checkout. Please try again." },
      { status: 500 },
    );
  }
}
