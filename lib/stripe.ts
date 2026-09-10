import "server-only";
import Stripe from "stripe";

/** Returns a Stripe client, or null when the secret key isn't configured. */
export function getStripe(): Stripe | null {
  const key = process.env.STRIPE_SECRET_KEY;
  return key ? new Stripe(key) : null;
}

/**
 * Find an existing Stripe customer by email, or create one. Used to tie
 * checkout sessions to a logged-in account so we can list their orders later.
 */
export async function findOrCreateCustomer(
  stripe: Stripe,
  email: string,
): Promise<string> {
  const existing = await stripe.customers.list({ email, limit: 1 });
  if (existing.data[0]) return existing.data[0].id;
  const created = await stripe.customers.create({ email });
  return created.id;
}

export interface OrderItem {
  name: string;
  quantity: number;
}

export interface OrderSummary {
  id: string;
  created: number;
  amountTotal: number;
  currency: string;
  status: string;
  items: OrderItem[];
}

/**
 * List a user's paid orders (Stripe is the source of truth). Matches the
 * Stripe customer by email, then returns their completed checkout sessions
 * with line items. Returns [] when there's no customer or no orders.
 */
export async function listOrdersByEmail(
  stripe: Stripe,
  email: string,
  max = 10,
): Promise<OrderSummary[]> {
  const customers = await stripe.customers.list({ email, limit: 1 });
  const customer = customers.data[0];
  if (!customer) return [];

  const sessions = await stripe.checkout.sessions.list({
    customer: customer.id,
    limit: max,
  });

  const paid = sessions.data.filter(
    (s) => s.payment_status === "paid" || s.status === "complete",
  );

  const orders: OrderSummary[] = [];
  for (const s of paid) {
    let items: OrderItem[] = [];
    try {
      const lineItems = await stripe.checkout.sessions.listLineItems(s.id, {
        limit: 20,
      });
      items = lineItems.data.map((i) => ({
        name: i.description ?? "Item",
        quantity: i.quantity ?? 1,
      }));
    } catch {
      /* line items unavailable — show the order without them */
    }
    orders.push({
      id: s.id,
      created: s.created,
      amountTotal: s.amount_total ?? 0,
      currency: (s.currency ?? "eur").toUpperCase(),
      status: s.payment_status ?? s.status ?? "paid",
      items,
    });
  }
  return orders;
}
