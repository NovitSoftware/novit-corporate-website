import { ChipButton } from "@/components/ui/ChipButton";
import { Container } from "@/components/ui/Container";
import { ReadingPanel } from "@/components/ui/ReadingPanel";
import { Scene } from "@/components/motion/Scene";
import { Section } from "@/components/ui/Section";
import { SectionIntro } from "@/components/ui/SectionIntro";
import { servicesPageContent } from "@/content/site";

/**
 * How it starts, which on this page is the only thing left to say.
 *
 * No form. The site has one enquiry and it is on the home page; a second copy
 * of it here would be a second inbox to forget about, and the shared
 * `useUnsentForm` making one cheap to build is not a reason to have one. The
 * `/academianovit` form exists because applying to a course is a different
 * act from asking a question — this band is asking a question.
 *
 * No phone number or email either, though this is the band where a services
 * page usually puts them: the footer is about a hundred pixels below this
 * button and carries both. Saying them twice in one screen makes neither
 * more findable.
 *
 * The commitment and the button share a row inside one wide panel — the same
 * shape the home page's Academia teaser closes on, for the same reason: a
 * capped paragraph with a button stacked under it leaves a hand-sized
 * rectangle of bare gradient beside both.
 */
export function ServicesStart() {
  const { start } = servicesPageContent;

  return (
    <Section id={start.id}>
      <Scene>
        <Container>
          <SectionIntro
            eyebrow={start.eyebrow}
            title={start.title}
            aside={
              <p
                data-anim="rise"
                className="max-w-[52ch] text-base leading-7 text-on-detail sm:text-lg sm:leading-8"
              >
                {start.lead}
              </p>
            }
            below={
              <ReadingPanel as="section">
                <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center lg:gap-14">
                  <p className="max-w-[62ch] text-[0.9375rem] font-bold leading-relaxed text-violeta-medio">
                    {start.commitment}
                  </p>
                  <div data-anim="rise" className="mt-8 shrink-0 lg:mt-0">
                    <ChipButton href={start.cta.href} variant="dark">
                      {start.cta.label}
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
