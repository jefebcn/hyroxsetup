import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { LogOut, Package, Mail } from "lucide-react";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createClient } from "@/lib/supabase/server";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Account",
  robots: { index: false },
};

export default async function AccountPage() {
  if (!isSupabaseConfigured) {
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

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const memberSince = user.created_at
    ? new Date(user.created_at).toLocaleDateString("en-GB", {
        year: "numeric",
        month: "long",
      })
    : null;

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
              <p className="font-semibold text-bone">{user.email}</p>
            </div>
          </div>
          {memberSince && (
            <p className="mt-4 text-xs text-ash">Member since {memberSince}</p>
          )}
        </div>

        <div className="card flex items-start gap-3 p-6">
          <Package className="mt-0.5 h-5 w-5 text-ash" />
          <div>
            <p className="font-semibold text-bone">Your orders</p>
            <p className="mt-1 text-sm text-ash">
              Order confirmations are emailed to you by Stripe after checkout. A
              full order history in your account is coming soon.
            </p>
          </div>
        </div>

        <form action="/auth/signout" method="post">
          <button type="submit" className="btn btn-ghost w-full">
            <LogOut className="h-4 w-4" /> Log out
          </button>
        </form>

        <p className="text-center text-xs text-ash">
          Need help? Email {SITE.supportEmail}
        </p>
      </div>
    </div>
  );
}
