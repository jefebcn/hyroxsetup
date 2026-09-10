import "server-only";
import { Resend } from "resend";

/**
 * Email/newsletter helpers (Resend). Everything is optional: without a
 * RESEND_API_KEY the API routes return a friendly 503 and the UI degrades
 * gracefully, so the site works without it.
 *
 * Env:
 *   RESEND_API_KEY       — enables sending + audience writes
 *   RESEND_FROM          — verified sender, e.g. "WALL BUY <hello@wallbuyshop.com>"
 *                          (falls back to Resend's test sender)
 *   RESEND_AUDIENCE_ID   — optional; newsletter signups are added to this
 *                          audience. Without it, a signup notification is
 *                          emailed to support instead.
 */
export const isEmailConfigured = Boolean(process.env.RESEND_API_KEY);
export const EMAIL_FROM =
  process.env.RESEND_FROM || "WALL BUY <onboarding@resend.dev>";
export const AUDIENCE_ID = process.env.RESEND_AUDIENCE_ID || "";

export function getResend(): Resend | null {
  const key = process.env.RESEND_API_KEY;
  return key ? new Resend(key) : null;
}

/** Very small email sanity check. */
export function isValidEmail(email: unknown): email is string {
  return (
    typeof email === "string" &&
    email.length <= 254 &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  );
}
