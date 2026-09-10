import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { LogOut, Package, Mail } from "lucide-react";
import { currentUser } from "@clerk/nextjs/server";
import { SignOutButton } from "@clerk/nextjs";
import { isClerkConfigured } from "@/lib/auth";
import { getStripe, listOrdersByEmail, type OrderSummary } from "@/lib/stripe";
import { formatPrice } from "@/lib/format";
import { SITE } from "@/lib/site";

// Orders come from Stripe live — always render fresh.
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Account",
  robots: { index: false },
};

export default async function AccountPage() {
  if (!isClerkConfigured) {
    return (
      <div className="mx-auto max-w-md px-4 py-16 text-center">
        <h1 className="display text-4xl">Account</h1>
        <p className="mt-3 text-sm text-ash">
          Accounts aren&rsquo;t enabled yet. You can still shop and check out as a
          guest.
        </p>
        <Link href="/shop" className="btn btn-primary mt-6">
          Shop the collection
        </Link>
      </div>
    );
  }

  const user = await currentUser();
  if (!user) redirect("/login");

  const email =
    user.primaryEmailAddress?.emailAddress ??
    user.emailAddresses[0]?.emailAddress ??
    "";

  const memberSince = user.createdAt
    ? new Date(user.createdAt).toLocaleDateString("en-GB", {
        year: "numeric",
        month: "long",
      })
    : null;

  // Pull the order history from Stripe (source of truth). Never let a Stripe
  // hiccup take down the account page.
  const stripe = getStripe();
  let orders: OrderSummary[] = [];
  let ordersError = false;
  if (stripe && email) {
    try {
      orders = await listOrdersByEmail(stripe, email);
    } catch {
      ordersError = true;
    }
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-16">
      <span className="eyebrow">Members</span>
      <h1 className="display mt-4 text-4xl">Your account</h1>

      <div className="mt-8 space-y-4">
        <div className="card p-6">
          <div className="flex items-center gap-3">
            <Mail className="h-5 w-5 text-blood-bright" />
            <div>
              <p className="text-xs uppercase tracking-widest text-ash">Email</p>
              <p className="font-semibold text-bone">{email}</p>
            </div>
          </div>
          {memberSince && (
            <p className="mt-4 text-xs text-ash">Member since {memberSince}</p>
          )}
        </div>

        <div className="card p-6">
          <div className="mb-4 flex items-center gap-3">
            <Package className="h-5 w-5 text-blood-bright" />
            <p className="font-semibold text-bone">Your orders</p>
          </div>

          {orders.length > 0 ? (
            <ul className="space-y-3">
              {orders.map((o) => (
                <li
                  key={o.id}
                  className="rounded-lg border border-line bg-elevated p-4"
                >
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-sm font-semibold text-bone">
                      {new Date(o.created * 1000).toLocaleDateString("en-GB", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                    <span className="display text-bone">
                      {formatPrice(o.amountTotal, o.currency)}
                    </span>
                  </div>
                  {o.items.length > 0 && (
                    <p className="mt-1.5 text-sm text-ash">
                      {o.items.map((i) => `${i.quantity}× ${i.name}`).join(", ")}
                    </p>
                  )}
                  <span className="mt-2 inline-block rounded-full border border-gold/30 bg-gold/10 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-widest text-gold">
                    {o.status === "paid" ? "Paid" : o.status}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-ash">
              {ordersError
                ? "We couldn't load your orders right now — please try again shortly."
                : "No orders yet. Your purchases will appear here, and a confirmation is emailed to you after checkout."}
            </p>
          )}
        </div>

        <SignOutButton redirectUrl="/">
          <button type="button" className="btn btn-ghost w-full">
            <LogOut className="h-4 w-4" /> Log out
          </button>
        </SignOutButton>

        <p className="text-center text-xs text-ash">
          Need help? Email {SITE.supportEmail}
        </p>
      </div>
    </div>
  );
}
