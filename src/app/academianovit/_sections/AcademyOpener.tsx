import { Badge } from "@/components/ui/Badge";
import { ChipButton } from "@/components/ui/ChipButton";
import { Container } from "@/components/ui/Container";
import { Scene } from "@/components/motion/Scene";
import { SectionLabel } from "@/components/section/SectionLabel";
import { SplitWords } from "@/components/motion/SplitWords";
import { StatRow } from "@/components/section/StatRow";
import { academyPageContent, academyProgram } from "@/content/academianovit";
import { OpenerFigure } from "@/components/layout/PageOpener";
import { AcademyBoard } from "../_components/AcademyBoard";

/**
 * The page's opener, and the one place on it that raises its voice.
 *
 * Label, title, one paragraph, the edition, the load, one button — and beside
 * them the board, which draws the architecture the cursada builds. This used
 * to lead with a funnel — the admissions figures, at display scale — but those
 * are gone along with the rest of the Academia's selectivity stats.
 *
 * Not `HeroScene`, and not `Section`. `HeroScene` is choreographed for the
 * home hero's own parts. `Section` is right for every other band but carries
 * the standard vertical rhythm, and an opener has to clear the fixed header
 * instead. `Scene` plays anything already in view as one entrance when the
 * page curtain opens, so this arrives with the page.
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
          {/* The copy and the board share the band, the way the other
              openers share it with their art — the headline included, so
              the board stands beside the claim it illustrates rather than
              under it. The board is the wider of the two: its labels are set
              at reading size and it cannot go below about 640px without them
              going below it. The headline steps down to fit its column there
              and breaks into three even lines.

              The board is the taller of the two, so the copy starts level
              with its top edge and stays in view while the board scrolls
              past, rather than floating at its middle.

              Below `xl` the board follows the copy at full width, and on a
              phone it becomes the ground behind the copy, as every opener's
              figure does: at that width it would be a picture of labels too
              small to read. */}
          <div className="xl:grid xl:grid-cols-[minmax(0,1fr)_minmax(0,1.25fr)] xl:items-start xl:gap-12">
            <div
              data-anim-block
              className="relative z-[1] xl:sticky xl:top-[calc(var(--header-height)+2.5rem)] xl:self-start"
            >
              <SectionLabel name={eyebrow} />
              <h1
                data-anim="words"
                className="display-hero mt-7 max-w-[20ch] text-balance text-blanco xl:text-[clamp(3.25rem,4.6vw,4.5rem)]"
              >
                <SplitWords text={title} />
              </h1>
              <p
                data-anim="rise"
                className="mt-7 max-w-[58ch] text-base leading-7 text-on-detail sm:text-lg sm:leading-8"
              >
                {lead}
              </p>

              {/* When it runs. The page carried no dates at all — the
                  reasoning was that a calendar goes stale when a cohort
                  closes, which is true and was still the wrong call: someone
                  deciding whether to apply needs to know if they can make the
                  timeslot, and "32 horas" answers neither that nor when it
                  starts. One object in `academyProgram.edition`, so retiring
                  an edition is one edit. */}
              <div data-anim="rise" className="mt-8 flex flex-wrap items-center gap-2">
                <Badge icon={academyProgram.edition.icon}>
                  {academyProgram.edition.label}
                </Badge>
                {academyProgram.edition.facts.map((fact) => (
                  <Badge key={fact.label} icon={fact.icon}>
                    {fact.value}
                  </Badge>
                ))}
              </div>
            </div>

            <OpenerFigure>
              <AcademyBoard />
            </OpenerFigure>
          </div>

          {/* The load, across the band under both, in the row the button
              closes — as the home hero's pillars run under its copy.
              The figures live in `academyProgram.format.facts`, which is also
              what the hero's announcement strip reads: one source, no second
              copy of the numbers. */}
          <div className="mt-16 grid gap-10 lg:mt-20 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end lg:gap-16">
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
