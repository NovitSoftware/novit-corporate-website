import { Container } from "@/components/ui/Container";
import { PinnedIntro } from "@/components/ui/PinnedIntro";
import { ReadingPanel } from "@/components/ui/ReadingPanel";
import { Scene } from "@/components/motion/Scene";
import { Section } from "@/components/ui/Section";
import { academyPageContent, academyProgram } from "@/content/site";

/**
 * What the course is about, which is one distinction and one aim.
 *
 * The distinction is the whole reason the course exists — an agent is the
 * entity, agentic software is the paradigm that coordinates several of them,
 * and conflating the two is the confusion the first class clears up — so it
 * is set as a statement in the violet voice rather than as the opening line
 * of a paragraph. The aim follows it in plain body copy, because it is a
 * sixty-word sentence and no amount of type treatment makes that a slogan.
 *
 * One panel, not two. They are one idea in two registers, and splitting them
 * into a pair of cards would claim they are peers in a set.
 *
 * Pinned rather than stacked under the statement: capped at a readable
 * measure and set below a full-width heading, the panel left about 480px of
 * bare gradient down the right of the band — a band uses its whole width or
 * it does not claim it. Beside the statement, the same panel is the same
 * measure and the row is full. It is also the shape `AcademyAudience` uses
 * for the same relationship, a statement and the detail behind it.
 */
export function AcademyAbout() {
  const { about } = academyPageContent.sections;

  return (
    <Section id={about.id}>
      <Scene>
        <Container>
          <PinnedIntro
            eyebrow={about.eyebrow}
            title={about.title}
            beside={
              <ReadingPanel as="section">
                {/* Both capped in `ch`, which resolves against each ones own
                    font size, so the two measures stay right if either size
                    changes. Uncapped they ran to the panel width — about 95
                    characters a line for the aim, well past where a line
                    stops being comfortable to track. */}
                <p
                  data-anim="rise"
                  className="max-w-[62ch] text-lg font-bold leading-relaxed text-violeta-medio"
                >
                  {academyProgram.definition}
                </p>
                <p
                  data-anim="rise"
                  className="mt-6 max-w-[76ch] text-[0.9375rem] leading-7 text-texto"
                >
                  {academyProgram.objective}
                </p>
              </ReadingPanel>
            }
          />
        </Container>
      </Scene>
    </Section>
  );
}
