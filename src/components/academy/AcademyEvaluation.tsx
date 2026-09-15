import { CardGrid } from "@/components/cards/CardGrid";
import { Card, CardText } from "@/components/cards/Card";
import { Container } from "@/components/ui/Container";
import { Scene } from "@/components/motion/Scene";
import { Section } from "@/components/ui/Section";
import { SectionIntro } from "@/components/ui/SectionIntro";
import { academyPageContent, academyProgram } from "@/content/site";

/**
 * How the work is marked: pass or fail, on three questions.
 *
 * "Que funcione · Que sea eficiente · Que no se pueda torcer" is the best
 * writing in the whole course document — three plain phrases that between
 * them define what Novit thinks good agentic software is — so it gets space
 * and the violet voice rather than being compressed into a bullet list under
 * the paragraph.
 *
 * Three cards, in the voice, and no numbers: the criteria are applied to one
 * submission together, not in sequence. A piece of work that runs but can be
 * turned to another purpose fails on the third whatever it did on the first.
 *
 * A badge each, because the three headings are the shortest on the page and
 * the cards carried nothing else — three identical rectangles whose only
 * distinguishing mark was four words of violet text. The marks say which
 * question is which before the words are read: it works, it is efficient, it
 * cannot be turned to something else.
 */
export function AcademyEvaluation() {
  const { evaluation } = academyPageContent.sections;

  return (
    <Section id={evaluation.id}>
      <Scene>
        <Container>
          <SectionIntro
            eyebrow={evaluation.eyebrow}
            title={evaluation.title}
            aside={
              <p
                data-anim="rise"
                className="max-w-[50ch] text-base leading-7 text-on-detail sm:text-lg sm:leading-8"
              >
                {academyProgram.evaluation.description}
              </p>
            }
            below={
              <CardGrid columns={3}>
                {academyProgram.evaluation.criteria.map((criterion) => (
                  <li key={criterion.title} data-anim="card">
                    <Card icon={criterion.icon} title={criterion.title}>
                      <CardText>{criterion.detail}</CardText>
                    </Card>
                  </li>
                ))}
              </CardGrid>
            }
          />
        </Container>
      </Scene>
    </Section>
  );
}
