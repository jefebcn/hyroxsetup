import type { Metadata } from "next";
import Link from "next/link";
import { SignUp } from "@clerk/nextjs";
import { isClerkConfigured } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Create account",
  robots: { index: false },
};

export default function SignUpPage() {
  if (!isClerkConfigured) {
    return (
      <div className="mx-auto max-w-md px-4 py-16 text-center">
        <h1 className="display text-4xl">Create account</h1>
        <div className="mt-6 rounded-xl border border-line bg-panel p-6 text-sm text-ash">
          <p className="font-semibold text-bone">Accounts aren&rsquo;t enabled yet.</p>
          <p className="mt-2">
            You can still shop and check out as a guest — head to{" "}
            <Link href="/shop" className="text-bone underline">
              the shop
            </Link>
            .
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto flex max-w-md flex-col items-center px-4 py-16">
      <span className="eyebrow">Members</span>
      <h1 className="display mt-4 text-4xl">Join the wall</h1>
      <p className="mt-2 text-center text-sm text-ash">
        Create an account to save your details and follow your orders.
      </p>
      <div className="mt-8">
        <SignUp routing="hash" signInUrl="/login" forceRedirectUrl="/account" />
      </div>
    </div>
  );
}
