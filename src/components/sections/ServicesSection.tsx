import { ChipButton } from "@/components/ui/ChipButton";
import { Container } from "@/components/ui/Container";
import { HighlightCard } from "@/components/cards/HighlightCard";
import { Scene } from "@/components/motion/Scene";
import { Section } from "@/components/ui/Section";
import { SectionIntro } from "@/components/ui/SectionIntro";
import { ServiceCard } from "@/components/cards/ServiceCard";
import { highlights, services, servicesIntro } from "@/content/site";

/**
 * The argument, then the offer. Three cards state what the market gets wrong,
 * and the services answer it — which is why the featured card, Novit's own
 * role, is the one carrying the violet.
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
                <div data-anim-batch className="grid gap-4 md:grid-cols-3">
                  {highlights.map((item) => (
                    <div key={item.id} data-anim="card">
                      <HighlightCard highlight={item} />
                    </div>
                  ))}
                </div>

                <div data-anim-batch className="mt-4 grid gap-4 lg:grid-cols-2">
                  <div data-anim="card" className="lg:col-span-2">
                    <ServiceCard service={featured} />
                  </div>
                  {rest.map((service) => (
                    <div key={service.id} data-anim="card">
                      <ServiceCard service={service} />
                    </div>
                  ))}
                </div>

                {/* One route out of the grid rather than five, and it goes to
                    the page that argues the case rather than to the enquiry:
                    a reader who has just met three framings and five services
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
