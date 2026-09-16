import type { Metadata } from "next";
import { ServicesPage } from "./_components/ServicesPage";
import { servicesPageContent } from "./_content/inteligencia-artificial";
import { site } from "@/shared/content/site";

/**
 * Its own description and link-card title, not the site's — but not its own
 * tab title. The root layout pins `title` to `site.name` so the tab reads
 * "Novit Software" everywhere; leaving `title` out here is what lets that
 * inherit instead of being overridden per route.
 *
 * `metadataBase` in the root layout is what makes the relative `url` below
 * resolve, and the root layout's `openGraph` block is not inherited field by
 * field — declaring `openGraph` here replaces it, so the fields that still
 * apply (`siteName`, `locale`, `type`) are repeated rather than assumed.
 */
export const metadata: Metadata = {
  description: servicesPageContent.meta.description,
  alternates: { canonical: "/inteligencia-artificial" },
  openGraph: {
    title: servicesPageContent.meta.title,
    description: servicesPageContent.meta.description,
    url: "/inteligencia-artificial",
    siteName: site.name,
    locale: "es_AR",
    type: "website",
  },
};

export default function InteligenciaArtificial() {
  return <ServicesPage />;
}
