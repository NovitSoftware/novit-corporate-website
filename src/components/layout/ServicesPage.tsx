import { ServicesArchitecture } from "@/components/services/ServicesArchitecture";
import { ServicesCapabilities } from "@/components/services/ServicesCapabilities";
import { ServicesCases } from "@/components/services/ServicesCases";
import { ServicesEvolution } from "@/components/services/ServicesEvolution";
import { ServicesOpener } from "@/components/services/ServicesOpener";
import { ServicesRisk } from "@/components/services/ServicesRisk";
import { ServicesRole } from "@/components/services/ServicesRole";
import { ServicesStart } from "@/components/services/ServicesStart";
import { SiteShell } from "@/components/layout/SiteShell";

/**
 * `/inteligencia-artificial`.
 *
 * The page for a company that is already being sold agents — by two or three
 * vendors at once, usually — and has to decide what it is actually buying.
 *
 * ## It makes one argument, then lists capabilities under it
 *
 * The argument is the brochure's own and it is the sharpest thing in the
 * material: on a shared architecture, each new agent costs less than the last.
 * Everything here is in service of that one claim. The opener states it, the
 * risk band asks why not just hire the vendors, the role band says what a
 * partner is for, the architecture band draws the thing itself, the cases show
 * four companies already running on it, the evolution band shows it
 * accumulating, and the capabilities are what makes it buildable. The page
 * could have been a grid of six disciplines with a process timeline under it,
 * which is what every agency services page is; a director does not act on a
 * list of disciplines.
 *
 * ## The order is the brochure's
 *
 * Riesgos → Nuestro rol → Infraestructura → Casos → Evolución, which is slides
 * 01 to 05 of `Novit Software - Transformación IA`. It was not, and the
 * mismatch showed: Evolución opened on "ninguna de estas empresas…" one band
 * *above* the band that shows them, so the sentence pointed at nothing. Moving
 * one band fixed the sentence and the argument at once — you cannot show what
 * accumulates before showing what it accumulated on.
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
 * A second contact form; the four case cards the home page already runs; and
 * the standing site's own AI copy, which pitches WhatsApp bots and collections
 * campaigns to a small business — see the note on `servicesPageContent`.
 *
 * ## Numbering
 *
 * Only the evolution band, which is the only real sequence. The home page's
 * bands are numbered 01–07 as one continuous argument, and numbering these
 * would read as chapters eight to fourteen of it.
 */
export function ServicesPage() {
  return (
    <SiteShell>
      <ServicesOpener />
      <ServicesRisk />
      <ServicesRole />
      <ServicesArchitecture />
      <ServicesCases />
      <ServicesEvolution />
      <ServicesCapabilities />
      <ServicesStart />
    </SiteShell>
  );
}
