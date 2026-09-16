import { CardGrid } from "@/shared/cards/CardGrid";
import { Container } from "@/shared/ui/Container";
import { HighlightCard } from "../_components/HighlightCard";
import { Scene } from "@/shared/motion/Scene";
import { Section } from "@/shared/ui/Section";
import { SectionIntro } from "@/shared/ui/SectionIntro";
import { ServiceCard } from "../_components/ServiceCard";
import { highlights, services, servicesIntro } from "../_content/home";

/**
 * The three dimensions of AI, then the offer. The cards used to state what the
 * market gets wrong and the services answered it; they describe the AI line
 * now — how we work, what we build, how it is sustained — and the services
 * are the same three branches at service granularity. The featured card is
 * Novit's own role, which is why it carries the violet.
 *
 * Neither grid tracks the pointer or dims its siblings any more: none of
 * these cards is a link, and answering a hover on something that cannot be
 * clicked promises a destination that isn't there.
 *
 * Nothing leaves the band either. A chip under the grids used to go to
 * `/inteligencia-artificial`; this page describes the company and names its
 * three lines of work, and the footer is what links to the route.
 */
export function ServicesSection() {
  const [featured, ...rest] = services;

  return (
    <Section id="servicios">
      <Scene>
        <Container>
          <SectionIntro
            index={servicesIntro.index}
            eyebrow={servicesIntro.eyebrow}
            title={servicesIntro.title}
            /* Three lines, so they stay on the gradient. The panels are for
               blocks that are actually read at length — putting this one on
               a surface made a small box adrift in the middle of the band. */
            aside={
              <p
                data-anim="rise"
                className="max-w-[52ch] text-base leading-7 text-on-detail sm:text-lg sm:leading-8"
              >
                {servicesIntro.description}
              </p>
            }
            below={
              <>
                <CardGrid columns={3}>
                  {highlights.map((item) => (
                    <li key={item.id} data-anim="card">
                      <HighlightCard highlight={item} />
                    </li>
                  ))}
                </CardGrid>

                {/* The featured line runs the width of the grid it stands in,
                    which is what `col-span` on the wrapper is for — the card
                    itself does not know how wide it is. */}
                <CardGrid columns={2} className="mt-4">
                  <li data-anim="card" className="sm:col-span-2">
                    <ServiceCard service={featured} />
                  </li>
                  {rest.map((service) => (
                    <li key={service.id} data-anim="card">
                      <ServiceCard service={service} />
                    </li>
                  ))}
                </CardGrid>
              </>
            }
          />
        </Container>
      </Scene>
    </Section>
  );
}
