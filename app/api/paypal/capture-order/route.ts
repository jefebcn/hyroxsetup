import { NextRequest, NextResponse } from "next/server";
import {
  isPayPalConfigured,
  paypalApiBase,
  getPayPalAccessToken,
} from "@/lib/paypal";

/**
 * Captures (charges) an approved PayPal order. Called by the client from the
 * PayPal button's onApprove after the shopper confirms payment.
 */
export async function POST(req: NextRequest) {
  if (!isPayPalConfigured) {
    return NextResponse.json(
      { error: "Payments aren't switched on yet." },
      { status: 503 },
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const orderID =
    body && typeof body === "object"
      ? (body as { orderID?: unknown }).orderID
      : undefined;
  if (typeof orderID !== "string" || !/^[A-Z0-9-]{5,40}$/i.test(orderID)) {
    return NextResponse.json({ error: "Invalid order." }, { status: 400 });
  }

  try {
    const token = await getPayPalAccessToken();
    const res = await fetch(
      `${paypalApiBase()}/v2/checkout/orders/${orderID}/capture`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        cache: "no-store",
      },
    );
    const data = await res.json();
    if (!res.ok || data.status !== "COMPLETED") {
      console.error("PayPal capture error", JSON.stringify(data));
      return NextResponse.json(
        { error: "Payment could not be completed.", status: data.status ?? null },
        { status: 502 },
      );
    }
    return NextResponse.json({ status: data.status, id: data.id });
  } catch (err) {
    console.error("PayPal capture exception", err);
    return NextResponse.json(
      { error: "Payment could not be completed. Please try again." },
      { status: 500 },
    );
  }
}
