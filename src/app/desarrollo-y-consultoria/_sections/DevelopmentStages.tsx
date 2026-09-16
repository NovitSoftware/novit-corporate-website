import { Card, CardText } from "@/shared/cards/Card";
import { CardGrid } from "@/shared/cards/CardGrid";
import { CardList } from "@/shared/cards/CardList";
import { Container } from "@/shared/ui/Container";
import { ReadingPanel } from "@/shared/ui/ReadingPanel";
import { Scene } from "@/shared/motion/Scene";
import { Section } from "@/shared/ui/Section";
import { SectionIntro } from "@/shared/ui/SectionIntro";
import { developmentPageContent } from "../_content/desarrollo-y-consultoria";

/**
 * The three stages of a project, each one contractable on its own.
 *
 * Numbered, because this is a sequence and the standing site sells it as one:
 * each stage hands its deliverables to the next.
 *
 * The deliverables are Discovery's and take a panel of their own under the
 * three. Inside the first card they left the other two with a 250px hole —
 * and they read better as a list at the measure than as a column of five in a
 * third of it.
 */
export function DevelopmentStages() {
  const { build } = developmentPageContent;

  return (
    <Section id={build.id}>
      <Scene>
        <Container>
          <SectionIntro
            eyebrow={build.eyebrow}
            title={build.title}
            aside={
              <p
                data-anim="rise"
                className="max-w-[52ch] text-base leading-7 text-on-detail sm:text-lg sm:leading-8"
              >
                {build.lead}
              </p>
            }
            below={
              <>
                <CardGrid as="ol" columns={3}>
                  {build.stages.map((stage) => (
                    <li key={stage.id} data-anim="card">
                      <Card
                        icon={stage.icon}
                        label={stage.label}
                        title={stage.title}
                      >
                        <CardText>{stage.description}</CardText>
                      </Card>
                    </li>
                  ))}
                </CardGrid>

                <ReadingPanel as="section" data-anim-block className="mt-4">
                  <h3 className="card-ink-voice eyebrow">
                    {build.deliverablesLabel}
                  </h3>
                  <CardList
                    items={build.deliverables}
                    reveal
                    className="mt-6 sm:grid-cols-2 sm:gap-x-10"
                  />
                </ReadingPanel>
              </>
            }
          />
        </Container>
      </Scene>
    </Section>
  );
}
