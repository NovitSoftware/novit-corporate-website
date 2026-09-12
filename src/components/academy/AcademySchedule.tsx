import { Container } from "@/components/ui/Container";
import { Icon } from "@/components/ui/Icon";
import { PinnedIntro } from "@/components/ui/PinnedIntro";
import { ReadingPanel } from "@/components/ui/ReadingPanel";
import { Scene } from "@/components/motion/Scene";
import { Section } from "@/components/ui/Section";
import { academyPageContent, academyProgram } from "@/content/site";

/**
 * The five blocks, in the order they are taught, and nothing else.
 *
 * This is the one numbered thing on the page. Everywhere else numbering would
 * be decoration — the three marking criteria are parallel, the section
 * headings are not a continuation of the home page's argument — but the
 * blocks genuinely run one after another.
 *
 * ## What came out of it
 *
 * Four or five topics under each block, and a class count beside each. Both
 * are gone. The topics were the full syllabus — "RAG: embeddings, chunking,
 * similitud, e implementación sobre PostgreSQL con pgvector" and twenty more
 * like it — which reads as a contract to teach exactly that list, an edition
 * ahead of time, and which turned a page about a course into the course
 * document. The class counts are the same problem one size down: "3 clases de
 * 2 horas" per block commits a timetable that has not been drawn yet, and the
 * totals a reader needs are already in the opener's stat row.
 *
 * What is left is the shape of the programme, which is what a page can
 * promise. Five rows on one panel rather than five cards, and set quietly:
 * this is reference, not persuasion.
 *
 * Beside the statement rather than under it. Five two-word titles across the
 * full measure is a panel two thirds empty — the band claimed a width it had
 * nothing to put in.
 */
export function AcademySchedule() {
  const { schedule } = academyPageContent.sections;
  const { modules } = academyProgram.format;

  return (
    <Section id={schedule.id}>
      <Scene>
        <Container>
          <PinnedIntro
            eyebrow={schedule.eyebrow}
            title={schedule.title}
            beside={
              <ReadingPanel as="section">
                <ol data-anim-batch className="grid">
                  {modules.map((module, index) => (
                    <li
                      key={module.title}
                      data-anim="rise"
                      className="flex items-baseline gap-5 border-t border-t-gris-borde py-5 first:border-t-0 first:pt-0 last:pb-0 sm:gap-7"
                    >
                      <span className="w-7 shrink-0 text-[0.8125rem] font-bold tabular-nums tracking-[0.12em] text-violeta-medio">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <h3 className="flex items-baseline gap-2.5 text-[1.0625rem] font-bold leading-snug text-azul">
                        <Icon
                          name={module.icon}
                          className="size-[1.125rem] shrink-0 translate-y-0.5 text-violeta-medio"
                        />
                        {module.title}
                      </h3>
                    </li>
                  ))}
                </ol>
              </ReadingPanel>
            }
          >
            <p
              data-anim="rise"
              className="max-w-[46ch] text-base leading-7 text-on-detail sm:text-lg sm:leading-8"
            >
              {schedule.lead}
            </p>
          </PinnedIntro>
        </Container>
      </Scene>
    </Section>
  );
}
