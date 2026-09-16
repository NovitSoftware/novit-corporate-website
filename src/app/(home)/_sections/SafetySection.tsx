import { CardGrid } from "@/shared/cards/CardGrid";
import { Card, CardText } from "@/shared/cards/Card";
import { Container } from "@/shared/ui/Container";
import { Scene } from "@/shared/motion/Scene";
import { Section } from "@/shared/ui/Section";
import { SectionIntro } from "@/shared/ui/SectionIntro";
import { SplitWords } from "@/shared/motion/SplitWords";
import { safetyContent } from "../_content/home";

/**
 * The argument holds still and the evidence moves past it: the intro column
 * pins for the length of the band while the four pillars travel by.
 *
 * Only from `lg` up — on a narrow screen the column is the full width, so
 * there is nothing for it to stay beside and it simply reads top to bottom.
 */
export function SafetySection() {
  return (
    <Section id="seguridad">
      <Scene>
        <Container className="relative">
          <div className="grid gap-16 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:items-start lg:gap-20">
            <div className="lg:sticky lg:top-[calc(var(--header-height)+4rem)]">
              <SectionIntro
                index={safetyContent.index}
                eyebrow={safetyContent.eyebrow}
                title={safetyContent.title}
                layout="stacked"
              >
                <div data-anim-block>
                  {/* The one pull-quote on the page, so it gets the word
                      reveal the section titles use rather than a plain lift. */}
                  {/* Nothing under this. There was a `description` panel that
                      listed the four pillars in prose and then the four cards
                      beside it said the same thing; and before that a button
                      to /inteligencia-artificial, which nothing links to now.
                      The cards are what the reader goes to next. */}
                  <p
                    data-anim="words"
                    data-anim-stagger="0.022"
                    className="max-w-[38ch] text-lg font-bold leading-8 text-blanco sm:text-xl"
                  >
                    <SplitWords text={safetyContent.statement} />
                  </p>
                </div>
              </SectionIntro>
            </div>

            <CardGrid>
              {safetyContent.pillars.map((pillar) => (
                <li key={pillar.title} data-anim="card">
                  <Card title={pillar.title} icon={pillar.icon}>
                    <CardText>{pillar.description}</CardText>
                  </Card>
                </li>
              ))}
            </CardGrid>
          </div>
        </Container>
      </Scene>
    </Section>
  );
}
