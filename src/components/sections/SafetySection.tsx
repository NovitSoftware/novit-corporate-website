import { CardGrid } from "@/components/cards/CardGrid";
import { Card, CardText } from "@/components/cards/Card";
import { Container } from "@/components/ui/Container";
import { ReadingPanel } from "@/components/ui/ReadingPanel";
import { Scene } from "@/components/motion/Scene";
import { Section } from "@/components/ui/Section";
import { SectionIntro } from "@/components/ui/SectionIntro";
import { SplitWords } from "@/components/motion/SplitWords";
import { safetyContent } from "@/content/site";

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
                  <p
                    data-anim="words"
                    data-anim-stagger="0.022"
                    className="max-w-[38ch] text-lg font-bold leading-8 text-blanco sm:text-xl"
                  >
                    <SplitWords text={safetyContent.statement} />
                  </p>

                  {/* No button under this. It read "Leer el enfoque de
                      gobierno" and went to /inteligencia-artificial, and
                      nothing links to that route now — see the note in
                      `safetyContent`. The four cards beside this are where
                      the reader goes next. */}
                  <ReadingPanel className="mt-9 max-w-[62ch]">
                    <p className="text-base leading-7 text-texto">
                      {safetyContent.description}
                    </p>
                  </ReadingPanel>
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
