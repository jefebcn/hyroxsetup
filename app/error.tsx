"use client";

import Link from "next/link";

export default function Error({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="mx-auto flex max-w-xl flex-col items-center px-4 py-28 text-center">
      <p className="display text-7xl text-blood-bright">Ugh.</p>
      <h1 className="display mt-4 text-3xl">Something went down.</h1>
      <p className="mt-3 text-ash">
        A gremlin got into the wiring. Try again, or head back to base.
      </p>
      <div className="mt-8 flex gap-3">
        <button type="button" onClick={reset} className="btn btn-primary">
          Try again
        </button>
        <Link href="/" className="btn btn-ghost">
          Home
        </Link>
      </div>
    </div>
  );
}
