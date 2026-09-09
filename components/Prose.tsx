export default function Prose({
  title,
  updated,
  children,
}: {
  title: string;
  updated?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto max-w-3xl px-4 py-14">
      <h1 className="display text-4xl sm:text-5xl">{title}</h1>
      {updated && (
        <p className="mt-2 text-xs uppercase tracking-widest text-ash">
          Last updated {updated}
        </p>
      )}
      <div className="legal mt-8 space-y-4 text-sm">{children}</div>
    </div>
  );
}
