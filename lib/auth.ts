/**
 * Auth configuration (Clerk). Auth is optional: when the keys aren't set the
 * app degrades to guest-only checkout and shows a "not enabled yet" state,
 * so the site still builds and runs without them.
 *
 * Set in the Vercel project env to enable accounts:
 *   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
 *   CLERK_SECRET_KEY
 */
export const isClerkConfigured = Boolean(
  process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY && process.env.CLERK_SECRET_KEY,
);
