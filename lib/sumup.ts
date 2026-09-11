import "server-only";

/**
 * SumUp online-payments configuration. Payments via SumUp are optional: without
 * the keys the checkout degrades to a "being set up" note, so the site still
 * builds and runs.
 *
 * Set in the Vercel project env to enable SumUp checkout:
 *   SUMUP_API_KEY        (secret — server only; a "sup_sk_..." API key)
 *   SUMUP_MERCHANT_CODE  (your merchant code, e.g. "MXXXXXXX")
 */
export const SUMUP_API_KEY = process.env.SUMUP_API_KEY ?? "";
export const SUMUP_MERCHANT_CODE = process.env.SUMUP_MERCHANT_CODE ?? "";
export const isSumUpConfigured = Boolean(SUMUP_API_KEY && SUMUP_MERCHANT_CODE);

const SUMUP_API = "https://api.sumup.com/v0.1";

export interface SumUpCheckout {
  id: string;
  status: "PENDING" | "PAID" | "FAILED" | "EXPIRED";
  amount: number;
  currency: string;
  checkout_reference: string;
  hosted_checkout_url?: string;
}

function headers() {
  return {
    Authorization: `Bearer ${SUMUP_API_KEY}`,
    "Content-Type": "application/json",
  };
}

/**
 * Creates a SumUp hosted checkout (SumUp-hosted payment page). Returns the
 * checkout with `hosted_checkout_url` to redirect the shopper to.
 */
export async function createSumUpCheckout(input: {
  amount: number;
  currency: string;
  reference: string;
  description?: string;
  redirectUrl?: string;
}): Promise<SumUpCheckout> {
  const res = await fetch(`${SUMUP_API}/checkouts`, {
    method: "POST",
    headers: headers(),
    body: JSON.stringify({
      checkout_reference: input.reference,
      amount: input.amount,
      currency: input.currency,
      merchant_code: SUMUP_MERCHANT_CODE,
      ...(input.description ? { description: input.description } : {}),
      hosted_checkout: { enabled: true },
      ...(input.redirectUrl ? { redirect_url: input.redirectUrl } : {}),
    }),
    cache: "no-store",
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`SumUp create checkout failed (${res.status}): ${text}`);
  }
  return (await res.json()) as SumUpCheckout;
}

/** Fetches a checkout so we can confirm its status (PAID) server-side. */
export async function getSumUpCheckout(id: string): Promise<SumUpCheckout> {
  const res = await fetch(`${SUMUP_API}/checkouts/${encodeURIComponent(id)}`, {
    headers: headers(),
    cache: "no-store",
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`SumUp get checkout failed (${res.status}): ${text}`);
  }
  return (await res.json()) as SumUpCheckout;
}
