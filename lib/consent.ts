/**
 * Cookie-consent helpers shared by the banner and any consent-gated scripts
 * (e.g. the TikTok Pixel). Consent is stored in localStorage; changes are
 * broadcast on a window event so gated scripts can react within the session.
 */
export const CONSENT_KEY = "wallbuy.cookie-consent";
export const CONSENT_EVENT = "wallbuy:consent-change";

export type Consent = "accepted" | "rejected";

export function getConsent(): Consent | null {
  if (typeof window === "undefined") return null;
  try {
    const v = localStorage.getItem(CONSENT_KEY);
    return v === "accepted" || v === "rejected" ? v : null;
  } catch {
    return null;
  }
}

export function setConsent(value: Consent): void {
  try {
    localStorage.setItem(CONSENT_KEY, value);
  } catch {
    /* ignore */
  }
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent(CONSENT_EVENT, { detail: value }));
  }
}
