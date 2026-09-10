"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Plus, Minus, Search } from "lucide-react";
import { FAQ_ITEMS, FAQ_CATEGORIES, type FaqCategory } from "@/lib/faq";
import { SITE } from "@/lib/site";

type Filter = "All" | FaqCategory;

export default function Faq() {
  const [filter, setFilter] = useState<Filter>("All");
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState<string | null>(FAQ_ITEMS[0]?.q ?? null);

  const items = useMemo(() => {
    const q = query.trim().toLowerCase();
    return FAQ_ITEMS.filter((it) => {
      const matchCat = filter === "All" || it.category === filter;
      const matchQ =
        !q || it.q.toLowerCase().includes(q) || it.a.toLowerCase().includes(q);
      return matchCat && matchQ;
    });
  }, [filter, query]);

  return (
    <div className="mx-auto max-w-3xl">
      {/* search */}
      <div className="relative mb-4">
        <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ash" />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search the FAQ…"
          aria-label="Search the FAQ"
          className="w-full rounded-full border border-line bg-elevated py-2.5 pl-10 pr-4 text-sm text-bone outline-none transition-colors placeholder:text-ash/60 focus:border-blood/60"
        />
      </div>

      {/* category filter */}
      <div className="mb-6 flex flex-wrap gap-2">
        {(["All", ...FAQ_CATEGORIES] as Filter[]).map((c) => {
          const active = filter === c;
          return (
            <button
              key={c}
              type="button"
              onClick={() => setFilter(c)}
              aria-pressed={active}
              className={`rounded-full border px-3.5 py-1.5 text-xs font-semibold uppercase tracking-widest transition-colors ${
                active
                  ? "border-blood bg-blood/15 text-blood-bright"
                  : "border-line bg-panel text-ash hover:text-bone"
              }`}
            >
              {c}
            </button>
          );
        })}
      </div>

      {/* accordion */}
      <div className="divide-y divide-line border-y border-line">
        {items.map((item) => {
          const active = open === item.q;
          return (
            <div key={item.q}>
              <button
                type="button"
                onClick={() => setOpen(active ? null : item.q)}
                className="flex w-full items-center gap-4 py-5 text-left"
                aria-expanded={active}
              >
                <span
                  className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border transition-colors ${
                    active
                      ? "border-blood bg-blood/15 text-blood-bright"
                      : "border-line text-blood-bright"
                  }`}
                >
                  {active ? <Minus className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                </span>
                <span className="flex-1 display text-lg uppercase tracking-tight text-bone">
                  {item.q}
                </span>
                <span className="hidden shrink-0 rounded-full border border-line bg-panel px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-widest text-ash sm:inline-block">
                  {item.category}
                </span>
              </button>
              {/* animated reveal via grid-rows trick */}
              <div
                className={`grid transition-all duration-300 ease-out ${
                  active ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                }`}
              >
                <div className="overflow-hidden">
                  <p className="pb-5 pl-11 pr-10 text-sm leading-relaxed text-ash">
                    {item.a}
                  </p>
                </div>
              </div>
            </div>
          );
        })}

        {items.length === 0 && (
          <p className="py-8 text-center text-sm text-ash">
            No matches. Try another word or clear the filter.
          </p>
        )}
      </div>

      {/* still stuck CTA */}
      <div className="mt-8 flex flex-col items-center justify-between gap-3 rounded-xl border border-line bg-panel px-5 py-5 text-center sm:flex-row sm:text-left">
        <p className="text-sm text-ash">
          <span className="font-semibold text-bone">Still stuck?</span> We usually
          reply within a day.
        </p>
        <div className="flex gap-2">
          <Link href="/contact" className="btn btn-primary">
            Contact us
          </Link>
          <a href={`mailto:${SITE.supportEmail}`} className="btn btn-ghost">
            Email
          </a>
        </div>
      </div>
    </div>
  );
}
