import { ServicesArchitecture } from "@/components/services/ServicesArchitecture";
import { ServicesCases } from "@/components/services/ServicesCases";
import { ServicesEvolution } from "@/components/services/ServicesEvolution";
import { ServicesOpener } from "@/components/services/ServicesOpener";
import { ServicesRole } from "@/components/services/ServicesRole";
import { SiteShell } from "@/components/layout/SiteShell";

/**
 * `/inteligencia-artificial`: opener, then Nuestro rol → Infraestructura →
 * Casos → Evolución.
 *
 * Evolución must stay after Casos — its lead opens on "ninguna de estas
 * empresas…" and refers to the cards in the band above it.
 *
 * `ServicesArchitecture` is the one band with a figure in it; the rest are
 * heading, lead and cards. No contact form here (the site's one is on the
 * home page), no "La oferta" band, and no section numbers — the home page's
 * 01–07 belongs to that page.
 */
export function ServicesPage() {
  return (
    <SiteShell>
      <ServicesOpener />
      <ServicesRole />
      <ServicesArchitecture />
      <ServicesCases />
      <ServicesEvolution />
    </SiteShell>
  );
}
