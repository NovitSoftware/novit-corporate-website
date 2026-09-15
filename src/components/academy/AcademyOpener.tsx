import { ChipButton } from "@/components/ui/ChipButton";
import { Container } from "@/components/ui/Container";
import { Icon } from "@/components/ui/Icon";
import { Scene } from "@/components/motion/Scene";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { SplitWords } from "@/components/motion/SplitWords";
import { StatRow } from "@/components/ui/StatRow";
import { academyPageContent, academyProgram } from "@/content/site";

/**
 * The page's opener, and the one place on it that raises its voice.
 *
 * Deliberately quiet: label, title, one paragraph, the load, one button. This
 * used to lead with a funnel — the admissions figures, at display scale — but
 * those are gone along with the rest of the Academia's selectivity stats, so
 * the load row is what the opener has to say after the claim.
 *
 * Not `HeroScene`, and not `Section`. `HeroScene`'s timeline is built paused
 * and released by the intro curtain's completion signal, which only
 * `IntroOverlay` sends and only the home page mounts — a hero waiting on it
 * here would sit at opacity 0 for good. `Section` is right for every other
 * band but carries the standard vertical rhythm, and an opener has to clear
 * the fixed header instead. `Scene` is scroll-driven and fires on creation
 * for anything already in view, so this arrives on load.
 */
export function AcademyOpener() {
  const { eyebrow, title, lead, cta } = academyPageContent;

  return (
    <section
      /* A band, so `SectionHandoff` hands it over to the next one. It is the
         first band on the page, which is what gives it the later exit window
         the home page's hero gets — right for an opener whose figures are the
         last thing to leave the frame. */
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
              className="display-hero mt-7 max-w-[20ch] text-blanco"
            >
              <SplitWords text={title} />
            </h1>
            <p
              data-anim="rise"
              className="mt-7 max-w-[58ch] text-base leading-7 text-on-detail sm:text-lg sm:leading-8"
            >
              {lead}
            </p>

            {/* When it runs. The page carried no dates at all — the reasoning
                was that a calendar goes stale when a cohort closes, which is
                true and was still the wrong call: someone deciding whether to
                apply needs to know if they can make the timeslot, and "32
                horas" answers neither that nor when it starts. One object in
                `academyProgram.edition`, so retiring an edition is one edit. */}
            <div data-anim="rise" className="mt-8 flex flex-wrap items-center gap-2">
              <span className="chip bg-celeste/15 text-celeste">
                {academyProgram.edition.label}
              </span>
              {academyProgram.edition.facts.map((fact) => (
                <span
                  key={fact.label}
                  className="chip chip-outline inline-flex items-center gap-2 text-celeste"
                >
                  <Icon name={fact.icon} size="micro" />
                  {fact.value}
                </span>
              ))}
            </div>
          </div>

          <div className="mt-16 grid gap-10 lg:mt-20 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end lg:gap-16">
            {/* The load, on the gradient, in the row the button closes. The
                figures live in `academyProgram.format.facts`, which is also
                what the hero's announcement strip reads — one source, no
                second copy of the numbers. */}
            <StatRow items={academyProgram.format.facts} />
            <div data-anim="rise" className="shrink-0">
              <ChipButton href={cta.href} variant="light">
                {cta.label}
              </ChipButton>
            </div>
          </div>
        </Container>
      </Scene>
    </section>
  );
}
