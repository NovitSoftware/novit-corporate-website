import { ServicesArchitecture } from "../_sections/ServicesArchitecture";
import { ServicesCases } from "../_sections/ServicesCases";
import { ServicesEvolution } from "../_sections/ServicesEvolution";
import { ServicesOpener } from "../_sections/ServicesOpener";
import { ServicesRole } from "../_sections/ServicesRole";
import { SiteShell } from "@/shared/layout/SiteShell";
import { servicesFooterContent } from "../_content/inteligencia-artificial";

/**
 * `/inteligencia-artificial`: opener, then Nuestro rol → Infraestructura →
 * Casos → Evolución.
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
export function ServicesPage() {
  return (
    <SiteShell footer={servicesFooterContent}>
      <ServicesOpener />
      <ServicesRole />
      <ServicesArchitecture />
      <ServicesCases />
      <ServicesEvolution />
    </SiteShell>
  );
}
