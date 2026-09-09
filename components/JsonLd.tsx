/**
 * Renders a JSON-LD structured-data <script>. Server component — the data is
 * serialized at render time. Used for Product, Organization, WebSite and
 * FAQPage schemas to earn richer Google results.
 */
export default function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      // Structured data is trusted, app-authored content.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
