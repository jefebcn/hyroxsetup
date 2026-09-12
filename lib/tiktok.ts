/**
 * TikTok Pixel helpers.
 *
 * The pixel ID is read from the public env var NEXT_PUBLIC_TIKTOK_PIXEL_ID so
 * it can be set on Vercel without a code change. When it's empty the pixel is
 * never loaded and every track call below is a safe no-op — so the site works
 * fine locally and in preview without a real pixel.
 *
 * TikTok expects monetary `value` in major currency units (e.g. 69.90), not
 * cents, so all helpers convert from cents.
 */
export const TIKTOK_PIXEL_ID = process.env.NEXT_PUBLIC_TIKTOK_PIXEL_ID ?? "";

type TtqParams = Record<string, unknown>;

interface Ttq {
  track: (event: string, params?: TtqParams) => void;
  page: (params?: TtqParams) => void;
}

declare global {
  interface Window {
    ttq?: Ttq;
  }
}

/** One item as TikTok's `contents` array expects it. */
export interface TikTokContent {
  content_id: string;
  content_name?: string;
  content_type: "product";
  quantity: number;
  /** Unit price in major currency units. */
  price: number;
}

/** Fire a TikTok PageView, silently no-op if the pixel isn't loaded. */
export function trackTikTokPage(): void {
  if (typeof window === "undefined") return;
  const ttq = window.ttq;
  if (!ttq || typeof ttq.page !== "function") return;
  try {
    ttq.page();
  } catch {
    /* pixel not ready / blocked — ignore */
  }
}

/** Fire a TikTok event, silently no-op if the pixel isn't loaded. */
export function trackTikTok(event: string, params?: TtqParams): void {
  if (typeof window === "undefined") return;
  const ttq = window.ttq;
  if (!ttq || typeof ttq.track !== "function") return;
  try {
    ttq.track(event, params);
  } catch {
    /* pixel not ready / blocked — ignore */
  }
}

/** cents → major units, rounded to 2 decimals. */
export function toMajor(cents: number): number {
  return Math.round(cents) / 100;
}
