export type Rarity = "Common" | "Rare" | "Legendary";

export interface ProductSpec {
  label: string;
  value: string;
}

export interface Product {
  slug: string;
  name: string;
  /** In-game wall-buy weapon this piece is based on. */
  weapon: string;
  tagline: string;
  /** Price in EUR cents. */
  priceCents: number;
  /** In-game "cost" shown as a themed badge. */
  points: number;
  rarity: Rarity;
  /** Primary image (cards, cart, share previews). */
  image: string;
  /** Full gallery for the product page (falls back to the primary image). */
  images?: string[];
  blurb: string;
  specs: ProductSpec[];
  inStock: boolean;
  featured?: boolean;
  /** Average star rating (0–5) for social proof. */
  rating: number;
  /** Number of reviews behind the rating. */
  reviews: number;
}

/**
 * Tiny neutral blur used as the placeholder while product images load —
 * keeps the layout calm and premium instead of flashing empty boxes.
 */
export const BLUR_DATA_URL =
  "data:image/gif;base64,R0lGODlhAQABAPAAAAsLDf///yH5BAAAAAAALAAAAAABAAEAAAICRAEAOw==";

/**
 * Product catalogue. Prices are placeholders in EUR — adjust to your real
 * pricing. Images live in /public/products.
 */
export const products: Product[] = [
  {
    slug: "olympia",
    name: "Olympia Neon Sign",
    weapon: "Olympia",
    tagline: "The wall-buy every run starts with.",
    priceCents: 6090,
    points: 500,
    rarity: "Common",
    image: "/products/olympia.jpg",
    images: [
      "/products/olympia.jpg",
      "/products/olympia-2.jpg",
      "/products/olympia-3.jpg",
      "/products/olympia-4.jpg",
      "/products/olympia-5.jpg",
    ],
    blurb:
      "The double-barrel classic, hand-shaped in glowing neon-flex on a black acrylic panel. The one you slap off the wall on Round 1 — now lighting up your setup.",
    specs: [
      { label: "Size", value: "40 × 30 cm" },
      { label: "Material", value: "Black acrylic + LED neon flex" },
      { label: "Power", value: "USB / 12V adapter (included)" },
      { label: "Control", value: "Remote dimmer + on/off" },
      { label: "Mounting", value: "Wall bracket + standoffs included" },
    ],
    inStock: true,
    featured: true,
    rating: 4.8,
    reviews: 214,
  },
  {
    slug: "ak47",
    name: "AK-47 Neon Sign",
    weapon: "AK47",
    tagline: "900 points of pure wall-buy respect.",
    priceCents: 7290,
    points: 900,
    rarity: "Rare",
    image: "/products/ak47.jpg",
    blurb:
      "The unmistakable silhouette that carries you deep into the high rounds. Crisp neon outline, deep black panel, engineered to be the centrepiece of any battlestation.",
    specs: [
      { label: "Size", value: "50 × 33 cm" },
      { label: "Material", value: "Black acrylic + LED neon flex" },
      { label: "Power", value: "USB / 12V adapter (included)" },
      { label: "Control", value: "Remote dimmer + on/off" },
      { label: "Mounting", value: "Wall bracket + standoffs included" },
    ],
    inStock: true,
    featured: true,
    rating: 4.9,
    reviews: 168,
  },
  {
    slug: "ray-gun",
    name: "Ray Gun Neon Sign",
    weapon: "Ray Gun",
    tagline: "The Wonder Weapon. Pull of the box.",
    priceCents: 8990,
    points: 1500,
    rarity: "Legendary",
    image: "/products/raygun.jpg",
    blurb:
      "The one everyone prays for out of the Mystery Box. A show-stopping Wonder-Weapon centrepiece in vivid neon — the crown jewel of the collection.",
    specs: [
      { label: "Size", value: "45 × 32 cm" },
      { label: "Material", value: "Black acrylic + LED neon flex" },
      { label: "Power", value: "USB / 12V adapter (included)" },
      { label: "Control", value: "Remote dimmer + on/off" },
      { label: "Mounting", value: "Wall bracket + standoffs included" },
    ],
    inStock: true,
    featured: true,
    rating: 5.0,
    reviews: 96,
  },
];

export function getProduct(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export const rarityColor: Record<Rarity, string> = {
  Common: "#9a9aa3",
  Rare: "#4ea1ff",
  Legendary: "#ef8b1f",
};
