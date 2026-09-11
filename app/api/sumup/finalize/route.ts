import { NextRequest, NextResponse } from "next/server";
import { SITE } from "@/lib/site";
import { priceCart } from "@/lib/cart-pricing";
import { isSumUpConfigured, getSumUpCheckout } from "@/lib/sumup";
import {
  isCompleteShipping,
  shippingBlock,
  type ShippingDetails,
} from "@/lib/order";
import {
  getResend,
  isEmailConfigured,
  EMAIL_FROM,
  isValidEmail,
} from "@/lib/email";

const money = (cents: number) => `€${(cents / 100).toFixed(2)}`;

/**
 * Confirms a SumUp checkout was actually PAID (server-side — never trust the
 * client), then best-effort emails the order + shipping address to the shop and
 * a confirmation to the customer. Returns whether the payment is confirmed.
 */
export async function POST(req: NextRequest) {
  if (!isSumUpConfigured) {
    return NextResponse.json({ paid: false, error: "Not configured." }, { status: 503 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ paid: false, error: "Invalid request." }, { status: 400 });
  }

  const obj = (body ?? {}) as {
    id?: unknown;
    shipping?: Partial<ShippingDetails>;
    items?: { slug?: string; qty?: number }[];
  };
  const id = obj.id;
  if (typeof id !== "string" || !/^[a-z0-9-]{6,64}$/i.test(id)) {
    return NextResponse.json({ paid: false, error: "Invalid order." }, { status: 400 });
  }

  let paid = false;
  try {
    const checkout = await getSumUpCheckout(id);
    paid = checkout.status === "PAID";
  } catch (err) {
    console.error("SumUp finalize verify exception", err);
    return NextResponse.json(
      { paid: false, error: "Could not verify payment." },
      { status: 502 },
    );
  }

  if (!paid) {
    return NextResponse.json({ paid: false, status: "UNPAID" });
  }

  // Payment confirmed — notify the shop (and the customer) with the order.
  // Best-effort: never fail the response if email isn't set up or errors.
  try {
    const cart = priceCart(Array.isArray(obj.items) ? obj.items : []);
    const shipping = obj.shipping;
    const resend = getResend();
    if (isEmailConfigured && resend && cart.items.length > 0) {
      const lines = cart.items
        .map((i) => `• ${i.quantity}× ${i.name} — ${money(i.lineCents)}`)
        .join("\n");
      const totals = [
        `Subtotal: ${money(cart.subtotalCents)}`,
        cart.discountCents > 0 ? `Bundle discount: −${money(cart.discountCents)}` : "",
        `Shipping: ${cart.shippingCents === 0 ? "Free" : money(cart.shippingCents)}`,
        `Total paid: ${money(cart.totalCents)}`,
      ]
        .filter(Boolean)
        .join("\n");
      const address = isCompleteShipping(shipping)
        ? shippingBlock(shipping)
        : "(no shipping details captured)";

      // Shop notification.
      await resend.emails.send({
        from: EMAIL_FROM,
        to: SITE.supportEmail,
        subject: `New order — ${money(cart.totalCents)} (${cart.totalQty} item${cart.totalQty > 1 ? "s" : ""})`,
        text: `New paid order via SumUp.\n\nItems:\n${lines}\n\n${totals}\n\nShip to:\n${address}\n\nSumUp checkout: ${id}`,
      });

      // Customer confirmation (only if we have a valid email).
      if (isCompleteShipping(shipping) && isValidEmail(shipping.email)) {
        await resend.emails.send({
          from: EMAIL_FROM,
          to: shipping.email,
          subject: `Your ${SITE.name} order is confirmed`,
          text: `Thanks for buying off the wall!\n\nWe've received your payment and your order is being prepared.\n\nItems:\n${lines}\n\n${totals}\n\nShipping to:\n${shippingBlock(shipping)}\n\nQuestions? ${SITE.supportEmail}`,
        });
      }
    }
  } catch (err) {
    console.error("SumUp finalize email exception", err);
  }

  return NextResponse.json({ paid: true, status: "PAID" });
}
