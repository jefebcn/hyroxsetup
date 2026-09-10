"use client";

import { useState } from "react";
import { Loader2, Check } from "lucide-react";

export default function ContactForm() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [state, setState] = useState<"idle" | "loading" | "done">("idle");
  const [msg, setMsg] = useState<string | null>(null);

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null);
    setState("loading");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        setMsg(data.error || "Something went wrong.");
        setState("idle");
        return;
      }
      setState("done");
    } catch {
      setMsg("Something went wrong. Please try again.");
      setState("idle");
    }
  }

  if (state === "done") {
    return (
      <div className="rounded-xl border border-gold/40 bg-gold/10 p-5 text-sm text-gold">
        <p className="flex items-center gap-2 font-semibold">
          <Check className="h-4 w-4" /> Message sent
        </p>
        <p className="mt-1 text-ash">Thanks — we&rsquo;ll get back to you shortly.</p>
      </div>
    );
  }

  const field =
    "w-full rounded-lg border border-line bg-elevated px-3.5 py-2.5 text-sm text-bone outline-none transition-colors placeholder:text-ash/60 focus:border-blood/60";

  return (
    <form onSubmit={onSubmit} className="space-y-3">
      <div className="grid gap-3 sm:grid-cols-2">
        <input
          type="text"
          required
          minLength={2}
          value={form.name}
          onChange={set("name")}
          placeholder="Your name"
          aria-label="Your name"
          className={field}
        />
        <input
          type="email"
          required
          value={form.email}
          onChange={set("email")}
          placeholder="you@email.com"
          aria-label="Your email"
          className={field}
        />
      </div>
      <textarea
        required
        minLength={5}
        rows={5}
        value={form.message}
        onChange={set("message")}
        placeholder="How can we help?"
        aria-label="Your message"
        className={`${field} resize-y`}
      />
      {msg && (
        <p className="rounded-md border border-blood/40 bg-blood/10 px-3 py-2 text-xs text-blood-bright">
          {msg}
        </p>
      )}
      <button
        type="submit"
        disabled={state === "loading"}
        className="btn btn-primary disabled:opacity-60"
      >
        {state === "loading" && <Loader2 className="h-4 w-4 animate-spin" />}
        Send message
      </button>
    </form>
  );
}
