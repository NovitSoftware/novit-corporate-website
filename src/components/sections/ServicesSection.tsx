import { CardGrid } from "@/components/cards/CardGrid";
import { ChipButton } from "@/components/ui/ChipButton";
import { Container } from "@/components/ui/Container";
import { HighlightCard } from "@/components/cards/HighlightCard";
import { Scene } from "@/components/motion/Scene";
import { Section } from "@/components/ui/Section";
import { SectionIntro } from "@/components/ui/SectionIntro";
import { ServiceCard } from "@/components/cards/ServiceCard";
import { highlights, services, servicesIntro } from "@/content/site";

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

                {/* One route out of the grid rather than five, and it goes to
                    `/inteligencia-artificial` rather than to the enquiry: a
                    reader who has just met three framings and five services
                    wants the next level of detail, not a form. */}
                <div data-anim="rise" className="mt-12">
                  <ChipButton href={servicesIntro.cta.href} variant="light">
                    {servicesIntro.cta.label}
                  </ChipButton>
                </div>
              </>
            }
          />
        </Container>
      </Scene>
    </Section>
  );
}
