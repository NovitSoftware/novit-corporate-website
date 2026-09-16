import { Container } from "@/shared/ui/Container";
import { ReadingPanel } from "@/shared/ui/ReadingPanel";
import { Scene } from "@/shared/motion/Scene";
import { Section } from "@/shared/ui/Section";
import { SectionIntro } from "@/shared/ui/SectionIntro";
import { StatRow } from "@/shared/ui/StatRow";
import { aboutContent, partnersContent } from "../_content/home";
import { cn } from "@/shared/lib/cn";

/**
 * The longest reading on the page — two paragraphs of real history — so this
 * is the section that most needed the light surface. It used to be set in
 * white directly on the gradient, beside a 4:5 decorative panel that layered
 * a multiply wash, a screen-blend celeste radial and a drifting grid over the
 * bar field: four treatments imitating the ground behind them, which is what
 * made the ground stop reading as one atmosphere.
 *
 * What replaces the panel is the one gesture the system actually specifies
 * for this: the isotipo, bled off the edge, at 8%.
 */
/**
 * The argument pins and the band travels past it, the way Seguridad does.
 *
 * The opener used to run down the middle: title, statement and reading panel
 * stacked in one column, with the right half of the measure empty for the
 * whole height of the band. The label hung in the rail and stuck, but it was
 * sticking beside nothing.
 */
export function AboutSection() {
  return (
    <Section id="nosotros">
      <Scene>
        <Container className="relative">
          <div className="grid gap-16 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:items-start lg:gap-20">
            <div className="lg:sticky lg:top-[calc(var(--header-height)+4rem)]">
              <SectionIntro
                index={aboutContent.index}
                eyebrow={aboutContent.eyebrow}
                title={aboutContent.title}
                layout="stacked"
              >
                <div data-anim-block>
                  <p
                    data-anim="rise"
                    className="display-m max-w-[26ch] text-blanco"
                  >
                    {aboutContent.statement}
                  </p>
                </div>
              </SectionIntro>
            </div>

            <div className="grid gap-16 lg:gap-20">
              <ReadingPanel>
                {aboutContent.paragraphs.map((paragraph, index) => (
                  <p
                    key={paragraph.slice(0, 24)}
                    className={cn(
                      "card-ink-body text-base leading-7",
                      index > 0 && "mt-5",
                    )}
                  >
                    {paragraph}
                  </p>
                ))}
              </ReadingPanel>

              <ActiveMarkets />

              <Relationships />
            </div>
          </div>

          <StatRow items={aboutContent.facts} className="mt-20 lg:mt-28" />
        </Container>
      </Scene>
    </Section>
  );
}

/**
 * The five countries, with the historical three under them. Both lists belong
 * to the same fact — where Novit works — and the note keeps the "hemos
 * trabajado en" label the brand data table requires for the past three. That
 * distinction is the whole reason both lists exist.
 */
function ActiveMarkets() {
  return (
    <div data-anim-block>
      <ul data-anim="rise" className="flex flex-wrap gap-x-8 gap-y-3">
        {partnersContent.activeMarkets.map((market) => (
          <li key={market} className="display-m text-blanco">
            {market}
          </li>
        ))}
      </ul>
      <p data-anim="rise" className="mt-5 text-sm leading-7 text-on-label">
        {partnersContent.historicalNote}
      </p>
    </div>
  );
}

/**
 * How Novit measures a client relationship. This was a numbered band of its
 * own — `05 · Relaciones` — carrying one paragraph and five country names,
 * which is not a section's worth of anything, and it was making the same case
 * as the reading above it. So it moved in here.
 *
 * The countries are not in it any more either: they answer *where*, and this
 * block answers *for how long*. Standing side by side they read as one
 * cramped thing making two unrelated claims.
 */
function Relationships() {
  return (
    <div data-anim-block>
      <span
        data-anim="bar"
        aria-hidden="true"
        className="block h-0.5 w-6 bg-celeste"
      />
      <p data-anim="chip" className="mt-4 eyebrow text-on-eyebrow">
        {partnersContent.eyebrow}
      </p>
      <h3 data-anim="rise" className="display-m mt-3 max-w-[22ch] text-blanco">
        {partnersContent.title}
      </h3>
      <p
        data-anim="rise"
        className="mt-7 max-w-[46ch] text-base leading-7 text-on-detail sm:text-lg sm:leading-8"
      >
        {partnersContent.description}
      </p>
    </div>
  );
}

