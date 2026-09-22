import { CardGrid } from "@/components/cards/CardGrid";
import { Container } from "@/components/ui/Container";
import { Scene } from "@/components/motion/Scene";
import { Section } from "@/components/section/Section";
import { SectionLabel } from "@/components/section/SectionLabel";
import { ServiceCard } from "../_components/ServiceCard";
import { services, servicesIntro } from "@/content/home";

/**
 * Qué hacemos: the four lines of work, two across.
 *
 * No statement over the grid. The reference names the band and goes straight
 * to the cards, so the rail label is the whole opener — `SectionIntro` is not
 * used here because its `title` is required and there is none to give.
 *
 * The rail is the same grid `SectionIntro` draws, which is what lets the label
 * travel: a sticky element only moves inside its own parent box, so the cards
 * have to share the grid with it.
 */
export function ServicesSection() {
  return (
    <Section id={servicesIntro.id}>
      <Scene>
        <Container>
          <div
            data-anim-block
            className="grid gap-x-10 gap-y-9 lg:grid-cols-[10rem_minmax(0,1fr)] lg:items-start"
          >
            <SectionLabel
              index={servicesIntro.index}
              name={servicesIntro.eyebrow}
              className="lg:sticky lg:top-[calc(var(--header-height)+2.5rem)] lg:self-start"
            />

            <CardGrid columns={2} className="min-w-0">
              {services.map((service) => (
                <li key={service.id} data-anim="card">
                  <ServiceCard service={service} />
                </li>
              ))}
            </CardGrid>
          </div>
        </Container>
      </Scene>
    </Section>
  );
}
