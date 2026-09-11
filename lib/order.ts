/**
 * Shipping details collected at checkout. Shared by the checkout form (client)
 * and the payment/order routes (server). SumUp — unlike Stripe/PayPal — doesn't
 * collect a delivery address, so we gather it ourselves for fulfilment.
 */
export interface ShippingDetails {
  name: string;
  email: string;
  phone: string;
  address1: string;
  address2: string;
  city: string;
  postal: string;
  country: string;
}

export const EMPTY_SHIPPING: ShippingDetails = {
  name: "",
  email: "",
  phone: "",
  address1: "",
  address2: "",
  city: "",
  postal: "",
  country: "",
};

/** Countries we ship to (ISO code + label), used by the checkout form select. */
export const SHIPPING_COUNTRIES: { code: string; label: string }[] = [
  { code: "IT", label: "Italy" },
  { code: "FR", label: "France" },
  { code: "DE", label: "Germany" },
  { code: "ES", label: "Spain" },
  { code: "PT", label: "Portugal" },
  { code: "NL", label: "Netherlands" },
  { code: "BE", label: "Belgium" },
  { code: "AT", label: "Austria" },
  { code: "IE", label: "Ireland" },
  { code: "FI", label: "Finland" },
  { code: "SE", label: "Sweden" },
  { code: "DK", label: "Denmark" },
  { code: "PL", label: "Poland" },
  { code: "GR", label: "Greece" },
  { code: "GB", label: "United Kingdom" },
  { code: "CH", label: "Switzerland" },
  { code: "US", label: "United States" },
  { code: "CA", label: "Canada" },
  { code: "AU", label: "Australia" },
  { code: "AE", label: "United Arab Emirates" },
];

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** True when every required shipping field is filled and the email looks valid. */
export function isCompleteShipping(s: Partial<ShippingDetails> | undefined): s is ShippingDetails {
  if (!s) return false;
  return (
    !!s.name?.trim() &&
    !!s.email?.trim() &&
    EMAIL_RE.test(s.email.trim()) &&
    !!s.phone?.trim() &&
    !!s.address1?.trim() &&
    !!s.city?.trim() &&
    !!s.postal?.trim() &&
    !!s.country?.trim()
  );
}

/** Short one-line "ship to" summary (for the SumUp transaction description). */
export function shipToSummary(s: Partial<ShippingDetails> | undefined): string {
  if (!s) return "";
  const parts = [s.name, s.address1, s.city, s.postal, s.country].filter(Boolean);
  return parts.join(", ").slice(0, 180);
}

/** Full multi-line address block for order emails. */
export function shippingBlock(s: ShippingDetails): string {
  return [
    s.name,
    s.address1,
    s.address2,
    [s.postal, s.city].filter(Boolean).join(" "),
    s.country,
    `Tel: ${s.phone}`,
    `Email: ${s.email}`,
  ]
    .filter(Boolean)
    .join("\n");
}
