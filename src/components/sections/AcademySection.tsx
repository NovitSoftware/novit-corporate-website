import { ChipButton } from "@/components/ui/ChipButton";
import { Container } from "@/components/ui/Container";
import { IconBadge } from "@/components/ui/IconBadge";
import { ReadingPanel } from "@/components/ui/ReadingPanel";
import { Scene } from "@/components/motion/Scene";
import { Section } from "@/components/ui/Section";
import { SectionIntro } from "@/components/ui/SectionIntro";
import { academyContent, academyProgram } from "@/content/site";

/**
 * The Academia, on the home page: what it is, who backs it, who it is not
 * for, and a way through to the rest.
 *
 * This band has been cut twice. First from the whole course document — the
 * aim, thirteen outcomes in four groups, five modules, the requirements list
 * and the marking criteria, about 3,000px of syllabus in the band whose job
 * is to *introduce* the Academia. Then again, when `/academianovit` was
 * built and the definition panel and the load figures here became the same
 * words the page now says in context: two pages stating the definition
 * verbatim is one of them repeating the other, and the one with room for it
 * should win.
 *
 * What a teaser owes a reader is why to click and one reason not to. So:
 * the description, the single line that stops the wrong person going
 * further, and the link. The load and modality are in the hero's
 * announcement strip a screen above; everything else is on the page.
 *
 * The violet runs through it, because this is Novit talking about its own
 * teaching, and violet is what that means in this system.
 */
export function AcademySection() {
  return (
    <Section id={academyContent.id}>
      <Scene>
        <Container>
          <SectionIntro
            index={academyContent.index}
            eyebrow={academyContent.eyebrow}
            title={academyContent.title}
            aside={
              <p
                data-anim="rise"
                className="max-w-[52ch] text-base leading-7 text-on-detail sm:text-lg sm:leading-8"
              >
                {academyContent.description}
              </p>
            }
            below={
              /* The disqualifier and the way through, paired across the
                 measure.

                 They were stacked: a panel capped at 68ch with the button on
                 the gradient below it, which left about 535x330px of bare
                 gradient to the right of both — a band uses its whole width
                 or it does not claim it. Side by side in one wide voice
                 panel they fill the row and the band loses about 150px of
                 height. Same shape as the featured ServiceCard, and the
                 button turns dark because it sits on the light surface now
                 rather than on the ground. */
              <ReadingPanel
                voice
                as="section"
                className="mt-16 p-7 sm:p-10 lg:mt-20"
              >
                <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center lg:gap-14">
                  <div>
                    <h3 className="flex items-center gap-3 text-[0.6875rem] font-bold uppercase tracking-[0.16em] text-violeta-medio">
                      {/* `alert`, not `academy`: what this panel does is turn
                          the wrong reader away, and the mark should say so
                          before the sentence does. */}
                      <IconBadge name="alert" tone="voice" />
                      Para quién es
                    </h3>
                    <p className="mt-5 max-w-[62ch] text-[0.9375rem] font-bold leading-relaxed text-violeta-medio">
                      {academyProgram.entryLevel}
                    </p>
                  </div>
                  <div data-anim="rise" className="mt-8 shrink-0 lg:mt-0">
                    <ChipButton href={academyContent.cta.href} variant="dark">
                      {academyContent.cta.label}
                    </ChipButton>
                  </div>
                </div>
              </ReadingPanel>
            }
          />
        </Container>
      </Scene>
    </Section>
  );
}
