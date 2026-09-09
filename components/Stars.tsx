import { Star } from "lucide-react";

/**
 * Star rating with optional review count. Renders 5 stars, filling whole and
 * half stars to match the rating. Accessible via an aria-label summary.
 */
export default function Stars({
  rating,
  reviews,
  size = "sm",
  className = "",
}: {
  rating: number;
  reviews?: number;
  size?: "sm" | "md";
  className?: string;
}) {
  const px = size === "md" ? "h-4 w-4" : "h-3.5 w-3.5";
  return (
    <div
      className={`inline-flex items-center gap-1.5 ${className}`}
      aria-label={`Rated ${rating} out of 5${reviews ? ` from ${reviews} reviews` : ""}`}
    >
      <span className="flex text-gold" aria-hidden>
        {Array.from({ length: 5 }).map((_, i) => {
          const fill = Math.max(0, Math.min(1, rating - i)); // 0, .5-ish, or 1
          return (
            <span key={i} className="relative inline-block">
              <Star className={`${px} text-line`} />
              <span
                className="absolute inset-0 overflow-hidden"
                style={{ width: `${fill * 100}%` }}
              >
                <Star className={`${px} fill-current text-gold`} />
              </span>
            </span>
          );
        })}
      </span>
      <span className="text-xs font-medium text-ash">
        {rating.toFixed(1)}
        {reviews ? (
          <span className="text-ash/70"> · {reviews.toLocaleString()}</span>
        ) : null}
      </span>
    </div>
  );
}
