import type { Metadata } from "next";
import { ServicesArchitecture } from "./_sections/ServicesArchitecture";
import { ServicesCases } from "./_sections/ServicesCases";
import { ServicesEvolution } from "./_sections/ServicesEvolution";
import { ServicesOpener } from "./_sections/ServicesOpener";
import { ServicesRole } from "./_sections/ServicesRole";
import { SiteShell } from "@/components/layout/SiteShell";
import { JsonLd, novitProvider } from "@/components/seo/JsonLd";
import { servicesFooterContent, servicesPageContent } from "@/content/inteligencia-artificial";
import { site, siteMarkets } from "@/content/site";

/**
 * Its own title, description and link-card title, not the site's: the title
 * is what the tab reads and what search results show for this page.
 *
 * `metadataBase` in the root layout is what makes the relative `url` below
 * resolve, and the root layout's `openGraph` block is not inherited field by
 * field — declaring `openGraph` here replaces it, so the fields that still
 * apply (`siteName`, `locale`, `type`) are repeated rather than assumed.
 */
export const metadata: Metadata = {
  title: servicesPageContent.meta.title,
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

/**
 * Opener, then Nuestro rol → Infraestructura → Casos → Evolución.
 *
 * Evolución must stay after Casos — its lead opens on "ninguna de estas
 * empresas…" and refers to the cards in the band above it.
 *
 * `ServicesArchitecture` is the one band with a figure in it; the rest are
 * heading, lead and cards. No contact form here, no "La oferta" band, and no
 * section numbers — the home page's 01–07 belongs to that page.
 *
 * Nothing on this page leaves the route: the way in is the WhatsApp line, in
 * the opener and again in the footer, and `servicesFooterContent` indexes
 * these four bands instead of the home page's.
 */
export default function InteligenciaArtificial() {
  return (
    <SiteShell footer={servicesFooterContent}>
      <JsonLd
        data={{
          "@type": "Service",
          name: servicesPageContent.title,
          serviceType: "Desarrollo de agentes de inteligencia artificial",
          description: servicesPageContent.lead,
          url: `${site.url}/inteligencia-artificial/`,
          provider: novitProvider,
          areaServed: siteMarkets.map((name) => ({ "@type": "Country", name })),
        }}
      />
      <ServicesOpener />
      <ServicesRole />
      <ServicesArchitecture />
      <ServicesCases />
      <ServicesEvolution />
    </SiteShell>
  );
}
