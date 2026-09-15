import { ServicesArchitecture } from "@/components/services/ServicesArchitecture";
import { ServicesCapabilities } from "@/components/services/ServicesCapabilities";
import { ServicesCases } from "@/components/services/ServicesCases";
import { ServicesEvolution } from "@/components/services/ServicesEvolution";
import { ServicesOpener } from "@/components/services/ServicesOpener";
import { ServicesRole } from "@/components/services/ServicesRole";
import { SiteShell } from "@/components/layout/SiteShell";

/**
 * `/inteligencia-artificial`.
 *
 * The AI line described at length, for a reader who got the summary on the
 * home page and wants the rest.
 *
 * ## It states one thing, then lists capabilities under it
 *
 * The claim is the brochure's own and it is the sharpest thing in the
 * material: on a shared architecture, each new agent costs less than the last.
 * Everything here is in service of it. The opener states it, the role band
 * says what a partner is for, the architecture band draws the thing itself,
 * the cases show four companies already running on it, the evolution band
 * shows it accumulating, and the capabilities are what makes it buildable. The
 * page could have been a grid of six disciplines with a process timeline under
 * it, which is what every agency services page is.
 *
 * ## Two bands came out, and the order is what is left of the brochure's
 *
 * `ServicesRisk` opened the page with six cards of what goes wrong when you
 * buy agents from six vendors, damage set in the alert red; `ServicesStart`
 * closed it on "Pedir el workshop". Both are sales moves — the right ones in
 * the deck they came from, and the wrong ones on a corporate site, which is
 * describing a service rather than working a decision. See the note on
 * `servicesPageContent` for the full reasoning; the positive half of the risk
 * argument is still here, in `ServicesArchitecture` and `ServicesEvolution`.
 *
 * What remains runs Nuestro rol → Infraestructura → Casos → Evolución, the
 * brochure's own sequence minus its first slide. Evolución after Casos is
 * load-bearing: its lead opens on "ninguna de estas empresas…" and the
 * companies are the band above it.
 *
 * ## Where the boldness goes
 *
 * Into `ServicesArchitecture`, and nowhere else. Four agent boxes floating on
 * the gradient over one solid panel holding the four shared services, because
 * the reader this page is written for reads architecture diagrams for a living
 * and that diagram *is* the proposition. The bands around it are deliberately
 * quiet.
 *
 * ## What is deliberately not here
 *
 * A contact form — the site has one and it is on the home page; and the
 * standing site's own AI copy, which pitches WhatsApp bots and collections
 * campaigns to a small business — see the note on `servicesPageContent`.
 *
 * ## Numbering
 *
 * Only the evolution band, which is the only real sequence. The home page's
 * bands are numbered 01–07 as one continuous argument, and numbering these
 * would read as chapters eight to twelve of it.
 */
export function ServicesPage() {
  return (
    <SiteShell>
      <ServicesOpener />
      <ServicesRole />
      <ServicesArchitecture />
      <ServicesCases />
      <ServicesEvolution />
      <ServicesCapabilities />
    </SiteShell>
  );
}
