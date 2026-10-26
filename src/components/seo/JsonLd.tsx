import { site } from "@/content/site";

/**
 * Structured data (schema.org, as JSON-LD) for search engines and AI
 * assistants: what a page is about, in a form a machine does not have to
 * infer from the prose. Nothing a visitor sees; every value comes from the
 * same content the page renders.
 */
export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      // `<` escaped, as the Next.js guide does, so no string can close the tag.
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({ "@context": "https://schema.org", ...data }).replace(/</g, "\\u003c"),
      }}
    />
  );
}

/** Novit as the provider of a service or a course, by reference to the home page's Organization. */
export const novitProvider = { "@type": "Organization", name: site.name, url: site.url } as const;
