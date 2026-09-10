import { BadgeCheck } from "lucide-react";
import Stars from "./Stars";
import type { Review } from "@/lib/reviews";

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-GB", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

/**
 * Product reviews block: an aggregate summary (the headline rating/count from
 * the catalogue) plus individual review cards for social proof.
 */
export default function Reviews({
  rating,
  count,
  reviews,
}: {
  rating: number;
  count: number;
  reviews: Review[];
}) {
  if (reviews.length === 0) return null;

  return (
    <section className="mt-16" aria-labelledby="reviews-heading">
      <div className="mb-8 flex flex-col gap-4 border-b border-line pb-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 id="reviews-heading" className="display text-3xl">
            What the community says
          </h2>
          <div className="mt-3 flex items-center gap-3">
            <span className="display text-3xl text-bone">{rating.toFixed(1)}</span>
            <div>
              <Stars rating={rating} size="md" />
              <p className="mt-0.5 text-xs text-ash">
                Based on {count.toLocaleString()} reviews
              </p>
            </div>
          </div>
        </div>
        <p className="text-xs uppercase tracking-widest text-ash">
          Verified buyers
        </p>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        {reviews.map((r, i) => (
          <figure key={i} className="card p-5">
            <div className="flex items-center justify-between gap-3">
              <Stars rating={r.rating} size="sm" />
              <time className="text-[11px] uppercase tracking-widest text-ash">
                {formatDate(r.date)}
              </time>
            </div>
            <figcaption className="mt-3 flex items-center gap-2">
              <span className="text-sm font-semibold text-bone">{r.author}</span>
              {r.verified && (
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold uppercase tracking-widest text-gold">
                  <BadgeCheck className="h-3.5 w-3.5" /> Verified
                </span>
              )}
            </figcaption>
            <p className="mt-2 text-sm font-semibold text-bone">{r.title}</p>
            <blockquote className="mt-1 text-sm leading-relaxed text-ash">
              {r.body}
            </blockquote>
          </figure>
        ))}
      </div>
    </section>
  );
}
