import { cardCopy } from "@/components/cards/Card";
import { Container } from "@/components/ui/Container";
import { PanelRow, panelRowRule } from "@/components/section/PanelRow";
import { PinnedIntro } from "@/components/section/PinnedIntro";
import { ReadingPanel } from "@/components/section/ReadingPanel";
import { Scene } from "@/components/motion/Scene";
import { Section } from "@/components/section/Section";
import { academyPageContent, academyProgram } from "@/content/academianovit";
import { cn } from "@/lib/cn";

/**
 * The five blocks, in the order they are taught, and nothing else.
 *
 * This is the one numbered thing on the page. Everywhere else numbering would
 * be decoration — the three marking criteria are parallel, the section
 * headings are not a continuation of the home page's argument — but the
 * blocks genuinely run one after another.
 *
 * ## A sentence per block, and no hours
 *
 * Each row carries one compressed sentence from
 * `docs/novit/academia-novit.md`, because a two-word title describes nothing —
 * "Contexto y conocimiento" is unreadable without the temario open. One
 * sentence, not the full syllabus: the twenty-odd topic bullets stay in the
 * temario, where they belong.
 *
 * No per-block hours. They make the panel read as a timetable, and the totals a
 * reader needs are in the opener's stat row.
 *
 * Five rows on one panel rather than five cards, and set quietly: this is
 * reference, not persuasion.
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
                      className={cn(panelRowRule, "pb-5 last:pb-0")}
                    >
                      <PanelRow
                        index={String(index + 1).padStart(2, "0")}
                        icon={module.icon}
                        title={module.title}
                      >
                        <p className={cardCopy}>{module.detail}</p>
                      </PanelRow>
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
