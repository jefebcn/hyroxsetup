/**
 * PayPal configuration. Payments via PayPal are optional: when the keys aren't
 * set the checkout degrades to a "being set up" state, so the site still builds
 * and runs without them.
 *
 * Set in the Vercel project env to enable PayPal checkout:
 *   NEXT_PUBLIC_PAYPAL_CLIENT_ID   (public — used by the browser SDK and server)
 *   PAYPAL_SECRET                  (secret — server only, never sent to the browser)
 *   PAYPAL_ENV                     (optional: "sandbox" to test, default "live")
 */
export const PAYPAL_CLIENT_ID = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID ?? "";
const PAYPAL_SECRET = process.env.PAYPAL_SECRET ?? "";

export const isPayPalConfigured = Boolean(PAYPAL_CLIENT_ID && PAYPAL_SECRET);

/** "sandbox" for testing, "live" for real money. Defaults to live. */
export const PAYPAL_ENV =
  process.env.PAYPAL_ENV === "sandbox" ? "sandbox" : "live";

export function paypalApiBase(): string {
  return PAYPAL_ENV === "sandbox"
    ? "https://api-m.sandbox.paypal.com"
    : "https://api-m.paypal.com";
}

/**
 * OAuth2 access token for server-to-server PayPal REST calls. Uses the client
 * id + secret via HTTP Basic auth. Throws on failure so callers can 500.
 */
export async function getPayPalAccessToken(): Promise<string> {
  const auth = Buffer.from(`${PAYPAL_CLIENT_ID}:${PAYPAL_SECRET}`).toString(
    "base64",
  );
  const res = await fetch(`${paypalApiBase()}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
    cache: "no-store",
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`PayPal auth failed (${res.status}): ${text}`);
  }
  const data = (await res.json()) as { access_token: string };
  return data.access_token;
}

/** Money helper: cents → "12.34" string PayPal expects. */
export function toPayPalAmount(cents: number): string {
  return (cents / 100).toFixed(2);
}
