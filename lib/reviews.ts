/**
 * Product reviews for social proof. These are realistic placeholder reviews —
 * swap them for real ones as they come in. The per-product average and count
 * shown in the summary come from `product.rating` / `product.reviews` so the
 * headline number stays consistent with the JSON-LD aggregateRating.
 */
export interface Review {
  author: string;
  rating: number;
  /** ISO date. */
  date: string;
  title: string;
  body: string;
  verified?: boolean;
}

const reviewsBySlug: Record<string, Review[]> = {
  olympia: [
    {
      author: "@nightmare_ops",
      rating: 5,
      date: "2026-08-21",
      title: "Setup completely changed",
      body: "Saw it on my FYP, ordered that night. The glow in person is unreal — my whole battlestation looks different now. Dimmer is a nice touch for late runs.",
      verified: true,
    },
    {
      author: "@round100",
      rating: 5,
      date: "2026-08-09",
      title: "Packaging was insane",
      body: "Arrived in like a week, wrapped so well I wasn't worried at all. Neon is bright and even, not a cheap printed thing. Exactly like the video.",
      verified: true,
    },
    {
      author: "@camo_grind",
      rating: 4,
      date: "2026-07-30",
      title: "Looks class on the wall",
      body: "Really happy with it. Took me five minutes to mount. Only reason it's 4 stars is I wish the cable were a touch longer, but that's on my room.",
      verified: true,
    },
  ],
  ak47: [
    {
      author: "@tacticaltoni",
      rating: 5,
      date: "2026-08-18",
      title: "The centrepiece of my room",
      body: "This is the one everyone asks about on stream. The silhouette is instantly recognisable and the red neon pops against the black panel. Worth every euro.",
      verified: true,
    },
    {
      author: "@prestige_pete",
      rating: 5,
      date: "2026-08-02",
      title: "Better than expected",
      body: "Was a bit unsure ordering online but the quality is legit. Bright, solid build, and the remote actually works well from across the room.",
      verified: true,
    },
    {
      author: "@fyp.finds",
      rating: 5,
      date: "2026-07-24",
      title: "Films amazing",
      body: "Bought it for the aesthetic in my clips and it delivers. Glows perfectly on camera, no flicker. Already ordered a second piece.",
      verified: true,
    },
  ],
  "ray-gun": [
    {
      author: "@wonderweapon",
      rating: 5,
      date: "2026-08-25",
      title: "Crown jewel of the collection",
      body: "If you're on the fence — get it. The Ray Gun is the showstopper it looks like online. Colours are vivid and it feels premium. Zero regrets.",
      verified: true,
    },
    {
      author: "@boxhitter",
      rating: 5,
      date: "2026-08-11",
      title: "Pull of the box, literally",
      body: "Everyone who walks in stops at it. Mounting kit had everything, up in minutes. This thing is a conversation starter.",
      verified: true,
    },
  ],
};

export function getReviews(slug: string): Review[] {
  return reviewsBySlug[slug] ?? [];
}

/** A few standout reviews across the catalogue, for the homepage. */
export function featuredReviews(): (Review & { slug: string })[] {
  return [
    { ...reviewsBySlug.olympia[0], slug: "olympia" },
    { ...reviewsBySlug["ray-gun"][0], slug: "ray-gun" },
    { ...reviewsBySlug.ak47[2], slug: "ak47" },
  ];
}
