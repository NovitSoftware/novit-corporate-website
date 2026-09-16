import { ChipButton } from "@/components/ui/ChipButton";
import { Container } from "@/components/ui/Container";
import { Scene } from "@/components/motion/Scene";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { SplitWords } from "@/components/motion/SplitWords";
import { servicesPageContent } from "@/content/site";

/**
 * The opener: the claim, and the door.
 *
 * ## What used to be here
 *
 * The architecture diagram hung off the bottom of this band, on the reasoning
 * that the reader this page is written for reads architecture diagrams for a
 * living and that the diagram *is* the proposition. Both halves of that are
 * still true; the placement was not. What it produced on screen was a label,
 * four floating pills and then an abrupt white strip with four more titles in
 * it, with nothing saying what the two halves had to do with each other — and
 * it arrived before the reader had been told why a shared architecture is the
 * question. It is its own band now, third, where the brochure puts it, with a
 * heading over it saying what it is. See `ServicesArchitecture`.
 *
 * So this band does the one thing an opener does: says what Novit is, and
 * offers the way in. Shorter than it was by about a screen, which the whole
 * page benefits from.
 *
 * Not `HeroScene` and not `Section`: `HeroScene`'s timeline waits on the
 * intro curtain's completion signal, which only the home page sends, so a
 * hero built on it here would sit at opacity 0 for good. `Section` carries
 * the standard vertical rhythm where an opener has to clear the fixed header.
 * Same reasoning, same shape as `AcademyOpener`.
 */
export function ServicesOpener() {
  const { eyebrow, title, lead, cta } = servicesPageContent;

  return (
    <section
      /* The page's first band, so `SectionHandoff` gives it the later exit
         window every opener gets. */
      data-band
      data-tone="dark"
      className="relative scroll-mt-anchor overflow-x-clip pb-16 pt-[calc(var(--header-height)+3.5rem)] text-blanco sm:pb-20 lg:pt-[calc(var(--header-height)+5rem)]"
    >
      <Scene className="relative">
        <Container>
          <div data-anim-block className="max-w-[54rem]">
            <SectionLabel name={eyebrow} />
            <h1
              data-anim="words"
              className="display-hero mt-7 max-w-[22ch] text-blanco"
            >
              <SplitWords text={title} />
            </h1>
            <p
              data-anim="rise"
              className="mt-7 max-w-[58ch] text-base leading-7 text-on-detail sm:text-lg sm:leading-8"
            >
              {lead}
            </p>
            <div data-anim="rise" className="mt-9">
              {/* The WhatsApp line, so it opens away from the page. */}
              <ChipButton
                href={cta.href}
                variant="light"
                target="_blank"
                rel="noreferrer"
              >
                {cta.label}
              </ChipButton>
            </div>
          </div>
        </Container>
      </Scene>
    </section>
  );
}
