import { NextRequest, NextResponse } from "next/server";
import { SITE } from "@/lib/site";
import { priceCart } from "@/lib/cart-pricing";
import {
  isPayPalConfigured,
  paypalApiBase,
  getPayPalAccessToken,
  toPayPalAmount,
} from "@/lib/paypal";

/**
 * Creates a PayPal order from the cart. Prices are computed server-side from our
 * own catalog (see priceCart), so the amount charged can't be tampered with.
 */
export async function POST(req: NextRequest) {
  if (!isPayPalConfigured) {
    return NextResponse.json(
      {
        error:
          "Payments aren't switched on yet. Add your PayPal keys to enable checkout.",
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
      ? ((body as { items: { slug?: string; qty?: number }[] }).items)
      : [];
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

  const currency = SITE.currency;
  const purchaseUnit = {
    description: `${SITE.name} — ${cart.totalQty} item${cart.totalQty > 1 ? "s" : ""}`,
    amount: {
      currency_code: currency,
      value: toPayPalAmount(cart.totalCents),
      breakdown: {
        item_total: {
          currency_code: currency,
          value: toPayPalAmount(cart.subtotalCents),
        },
        shipping: {
          currency_code: currency,
          value: toPayPalAmount(cart.shippingCents),
        },
        discount: {
          currency_code: currency,
          value: toPayPalAmount(cart.discountCents),
        },
      },
    },
    items: cart.items.map((i) => ({
      name: i.name,
      quantity: String(i.quantity),
      unit_amount: {
        currency_code: currency,
        value: toPayPalAmount(i.unitCents),
      },
      sku: i.slug,
      category: "PHYSICAL_GOODS" as const,
    })),
  };

  try {
    const token = await getPayPalAccessToken();
    const res = await fetch(`${paypalApiBase()}/v2/checkout/orders`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        intent: "CAPTURE",
        purchase_units: [purchaseUnit],
        application_context: {
          brand_name: SITE.name,
          shipping_preference: "GET_FROM_FILE",
          user_action: "PAY_NOW",
        },
      }),
      cache: "no-store",
    });
    const data = await res.json();
    if (!res.ok || !data.id) {
      console.error("PayPal create-order error", JSON.stringify(data));
      return NextResponse.json(
        { error: "Could not start checkout. Please try again." },
        { status: 502 },
      );
    }
    return NextResponse.json({ id: data.id });
  } catch (err) {
    console.error("PayPal create-order exception", err);
    return NextResponse.json(
      { error: "Could not start checkout. Please try again." },
      { status: 500 },
    );
  }
}
