import { SITE } from "./site";

export function formatPrice(
  cents: number,
  currency: string = SITE.currency,
  locale: string = SITE.locale,
): string {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
  }).format(cents / 100);
}
