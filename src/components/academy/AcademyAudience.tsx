import { Container } from "@/components/ui/Container";
import { PinnedIntro } from "@/components/ui/PinnedIntro";
import { ReadingPanel } from "@/components/ui/ReadingPanel";
import { Scene } from "@/components/motion/Scene";
import { Section } from "@/components/ui/Section";
import { academyPageContent, academyProgram } from "@/content/site";

/**
 * The filter, at full size.
 *
 * "No es una academia de nivel inicial" was a footnote under a requirements
 * list. It is the section's statement here, because the most useful thing this
 * page can do for the wrong candidate is let them leave early, and the most
 * useful thing it can do for the right one is say the bar is real. A page that
 * keeps its prerequisites in small print wastes both their time.
 */
export function AcademyAudience() {
  const { audience } = academyPageContent.sections;

  return (
    <Section id={audience.id}>
      <Scene>
        <Container>
          <PinnedIntro
            eyebrow={audience.eyebrow}
            title={audience.title}
            beside={<Checklist heading={audience.checklist} />}
          >
            <p
              data-anim="rise"
              className="max-w-[46ch] text-base leading-7 text-on-detail sm:text-lg sm:leading-8"
            >
              {audience.lead}
            </p>
          </PinnedIntro>
        </Container>
      </Scene>
    </Section>
  );
}

/**
 * The four things taken as given, as a list to read against yourself.
 *
 * One panel with four marked lines, not four cards: these are conditions on
 * one decision, and a card each would inflate four short phrases into four
 * panels competing for attention. The marks are violet rules rather than
 * ticks — nothing here is checked off by the reader, and a tick implies it is.
 */
function Checklist({ heading }: { heading: string }) {
  const { items } = academyProgram.requirements;

  return (
    <ReadingPanel as="section">
      <h3 className="text-[0.6875rem] font-bold uppercase tracking-[0.16em] text-violeta-medio">
        {heading}
      </h3>
      <ul data-anim-batch className="mt-6 grid gap-px">
        {items.map((item) => (
          <li
            key={item}
            data-anim="rise"
            /* A shared hairline between rows rather than a border on each:
               four bordered rows read as four fields in a form. */
            className="flex items-baseline gap-4 border-t border-t-gris-borde py-4 first:border-t-0 first:pt-0"
          >
            <span
              aria-hidden="true"
              className="mt-2 h-0.5 w-4 shrink-0 bg-violeta-medio"
            />
            <span className="text-[0.9375rem] leading-relaxed text-texto">
              {item}
            </span>
          </li>
        ))}
      </ul>
    </ReadingPanel>
  );
}
