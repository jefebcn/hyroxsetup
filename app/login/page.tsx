"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Loader2, Mail, Lock } from "lucide-react";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createClient } from "@/lib/supabase/client";

type Mode = "signin" | "signup";

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setNotice(null);
    setLoading(true);
    try {
      const supabase = createClient();
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
        });
        if (error) throw error;
        setNotice(
          "Almost there — check your inbox and confirm your email to activate your account.",
        );
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        router.push("/account");
        router.refresh();
        return;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto flex max-w-md flex-col px-4 py-16">
      <span className="eyebrow">Members</span>
      <h1 className="display mt-4 text-4xl">
        {mode === "signin" ? "Welcome back" : "Join the wall"}
      </h1>
      <p className="mt-2 text-sm text-ash">
        {mode === "signin"
          ? "Log in to track your orders and check out faster."
          : "Create an account to save your details and follow your orders."}
      </p>

      {!isSupabaseConfigured ? (
        <div className="mt-8 rounded-xl border border-line bg-panel p-6 text-sm text-ash">
          <p className="font-semibold text-bone">Accounts aren&rsquo;t enabled yet.</p>
          <p className="mt-2">
            You can still shop and check out as a guest — head to{" "}
            <Link href="/shop" className="text-bone underline">
              the shop
            </Link>
            . Accounts switch on as soon as the store owner adds the sign-in keys.
          </p>
        </div>
      ) : (
        <>
          <form onSubmit={onSubmit} className="mt-8 space-y-4">
            <label className="block">
              <span className="mb-1.5 block text-xs font-semibold uppercase tracking-widest text-ash">
                Email
              </span>
              <div className="flex items-center gap-2 rounded-lg border border-line bg-elevated px-3">
                <Mail className="h-4 w-4 text-ash" />
                <input
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-transparent py-3 text-sm text-bone outline-none placeholder:text-ash/60"
                  placeholder="you@email.com"
                />
              </div>
            </label>
            <label className="block">
              <span className="mb-1.5 block text-xs font-semibold uppercase tracking-widest text-ash">
                Password
              </span>
              <div className="flex items-center gap-2 rounded-lg border border-line bg-elevated px-3">
                <Lock className="h-4 w-4 text-ash" />
                <input
                  type="password"
                  required
                  minLength={6}
                  autoComplete={mode === "signup" ? "new-password" : "current-password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-transparent py-3 text-sm text-bone outline-none placeholder:text-ash/60"
                  placeholder="At least 6 characters"
                />
              </div>
            </label>

            {error && (
              <p className="rounded-md border border-blood/40 bg-blood/10 px-3 py-2 text-xs text-blood-bright">
                {error}
              </p>
            )}
            {notice && (
              <p className="rounded-md border border-gold/40 bg-gold/10 px-3 py-2 text-xs text-gold">
                {notice}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary w-full disabled:opacity-60"
            >
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              {mode === "signin" ? "Log in" : "Create account"}
            </button>
          </form>

          <button
            type="button"
            onClick={() => {
              setMode(mode === "signin" ? "signup" : "signin");
              setError(null);
              setNotice(null);
            }}
            className="mt-5 text-center text-sm text-ash transition-colors hover:text-bone"
          >
            {mode === "signin"
              ? "New here? Create an account"
              : "Already have an account? Log in"}
          </button>
        </>
      )}
    </div>
  );
}
