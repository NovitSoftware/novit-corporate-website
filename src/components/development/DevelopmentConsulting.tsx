import { Card, CardText } from "@/components/cards/Card";
import { CardGrid } from "@/components/cards/CardGrid";
import { CardList } from "@/components/cards/CardList";
import { Container } from "@/components/ui/Container";
import { ReadingPanel } from "@/components/ui/ReadingPanel";
import { Scene } from "@/components/motion/Scene";
import { Section } from "@/components/ui/Section";
import { SectionIntro } from "@/components/ui/SectionIntro";
import { developmentPageContent } from "@/content/site";

/**
 * The consultoría, for a company whose team already exists: what it is for,
 * then how it runs.
 *
 * The seven outcomes go in a panel and the four steps in cards, which is the
 * distinction between them — the outcomes are one list read at once, the steps
 * are a sequence with a paragraph each.
 */
export function DevelopmentConsulting() {
  const { consulting } = developmentPageContent;

  return (
    <Section id={consulting.id}>
      <Scene>
        <Container>
          <SectionIntro
            eyebrow={consulting.eyebrow}
            title={consulting.title}
            aside={
              <p
                data-anim="rise"
                className="max-w-[52ch] text-base leading-7 text-on-detail sm:text-lg sm:leading-8"
              >
                {consulting.lead}
              </p>
            }
            below={
              <>
                <ReadingPanel as="section" data-anim-block>
                  <h3 className="card-ink-voice eyebrow">
                    {consulting.helpLabel}
                  </h3>
                  <CardList
                    items={consulting.help}
                    reveal
                    className="mt-6 sm:grid-cols-2 sm:gap-x-10"
                  />
                </ReadingPanel>

                <CardGrid as="ol" columns={4} className="mt-4">
                  {consulting.steps.map((step) => (
                    <li key={step.id} data-anim="card">
                      <Card
                        icon={step.icon}
                        label={step.label}
                        title={step.title}
                      >
                        <CardText>{step.description}</CardText>
                      </Card>
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
