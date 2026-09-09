import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-xl flex-col items-center px-4 py-28 text-center">
      <p className="display text-7xl text-blood neon-red">404</p>
      <h1 className="display mt-4 text-3xl">You went down.</h1>
      <p className="mt-3 text-ash">
        This page got overrun. Get back to the wall and grab a weapon.
      </p>
      <Link
        href="/"
        className="mt-8 rounded-md bg-blood px-6 py-3 text-sm font-bold uppercase tracking-widest text-white hover:bg-blood-bright"
      >
        Back to base
      </Link>
    </div>
  );
}
