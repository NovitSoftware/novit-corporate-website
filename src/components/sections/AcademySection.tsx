import { Container } from "@/components/ui/Container";
import { IconLine } from "@/components/ui/Icon";
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
 * ## There is no button, and there were two
 *
 * First "Consultar por la Academia", pointing at `#contacto` — which made
 * "tell us about your course" and "tell us about your project" the same
 * inbox for two different questions. The Academia was never asked to
 * collect anything, so a band about teaching has no business handing a
 * reader a sales form. Then "Ver el programa completo", pointing at
 * `/academianovit`, which was honest about its destination but still a
 * button the band does not need: this is a teaser, and what a teaser owes a
 * reader is what the thing is and one reason not to pursue it, not a
 * demand for a click.
 *
 * So the band states its case and stops. Note the consequence, because it
 * is a decision and not an oversight: nothing on the home page links to
 * `/academianovit` any more, which by `SiteHeader`'s own rule — with the
 * menu gone, a route nothing points at is dead weight — puts that route's
 * future in question rather than merely unlinking it.
 *
 * The load and modality are in the hero's announcement strip a screen
 * above; everything else is on the page.
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
              /* The disqualifier, and now the whole of the panel.

                 The label takes a rail of its own beside the statement
                 rather than sitting on top of it. With the button gone the
                 stacked version left the right half of a full-width panel
                 empty, and a band uses its whole width or it does not claim
                 it; across the measure the label reads as what it is — a
                 margin note on one sentence — and the sentence gets the size
                 a lone statement in a panel deserves. */
              <ReadingPanel as="section" className="mt-16 lg:mt-20">
                <div className="lg:grid lg:grid-cols-[minmax(0,auto)_minmax(0,1fr)] lg:gap-14">
                  {/* `lg:leading-8` is the statement's own leading, borrowed
                      so the two columns' first lines share a line box and
                      their caps land within a couple of pixels of each other.
                      A padding nudge would be fitted to one type size; this
                      is the same token the sentence beside it uses. */}
                  <h3 className="flex items-start gap-2.5 eyebrow text-violeta-medio lg:leading-8">
                    {/* `alert`, not `academy`: what this panel does is turn
                        the wrong reader away, and the mark should say so
                        before the sentence does.

                        A `micro` glyph, not the 40px `IconBadge` that was
                        here: a plate is the identity mark of a card's head
                        zone, and beside 11px uppercase it ran nearly four
                        times the height of the words it marked. `micro` is
                        the size this scale of label takes everywhere else. */}
                    <IconLine name="alert" size="micro" />
                    Para quién es
                  </h3>
                  <p className="mt-5 max-w-[62ch] text-base font-bold leading-7 text-violeta-medio sm:text-lg sm:leading-8 lg:mt-0">
                    {academyProgram.entryLevel}
                  </p>
                </div>
              </ReadingPanel>
            }
          />
        </Container>
      </Scene>
    </Section>
  );
}
