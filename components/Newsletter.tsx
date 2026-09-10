"use client";

import { useState } from "react";
import { Loader2, Check } from "lucide-react";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "loading" | "done">("idle");
  const [msg, setMsg] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null);
    setState("loading");
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) {
        setMsg(data.error || "Something went wrong.");
        setState("idle");
        return;
      }
      setState("done");
      setMsg("You're on the list — new drops hit your inbox first.");
      setEmail("");
    } catch {
      setMsg("Something went wrong. Please try again.");
      setState("idle");
    }
  }

  if (state === "done") {
    return (
      <p className="flex items-center gap-2 text-sm text-gold">
        <Check className="h-4 w-4" /> {msg}
      </p>
    );
  }

  return (
    <form onSubmit={onSubmit} className="w-full max-w-sm">
      <div className="flex gap-2">
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@email.com"
          aria-label="Email address"
          className="min-w-0 flex-1 rounded-full border border-line bg-elevated px-4 py-2.5 text-sm text-bone outline-none transition-colors placeholder:text-ash/60 focus:border-blood/60"
        />
        <button
          type="submit"
          disabled={state === "loading"}
          className="btn btn-primary shrink-0 disabled:opacity-60"
        >
          {state === "loading" && <Loader2 className="h-4 w-4 animate-spin" />}
          Notify me
        </button>
      </div>
      {msg && <p className="mt-2 text-xs text-blood-bright">{msg}</p>}
    </form>
  );
}
