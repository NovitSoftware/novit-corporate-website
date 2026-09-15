import { ChipButton } from "@/components/ui/ChipButton";
import { Container } from "@/components/ui/Container";
import { Divider } from "@/components/ui/Divider";
import { ReadingPanel } from "@/components/ui/ReadingPanel";
import { Scene } from "@/components/motion/Scene";
import { Section } from "@/components/ui/Section";
import { SectionIntro } from "@/components/ui/SectionIntro";
import { StatRow } from "@/components/ui/StatRow";
import { aboutContent, partnersContent } from "@/content/site";
import { cn } from "@/lib/cn";

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
export function AboutSection() {
  return (
    <Section id="nosotros">
      <Scene>
        <Container className="relative">
          <SectionIntro
            index={aboutContent.index}
            eyebrow={aboutContent.eyebrow}
            title={aboutContent.title}
          >
            <div data-anim-block>
              <p data-anim="rise" className="display-m max-w-[44ch] text-blanco">
                {aboutContent.statement}
              </p>

              <ReadingPanel className="mt-10 max-w-[72ch]">
                {aboutContent.paragraphs.map((paragraph, index) => (
                  <p
                    key={paragraph.slice(0, 24)}
                    className={cn(
                      "card-ink-body max-w-[68ch] text-base leading-7",
                      index > 0 && "mt-5",
                    )}
                  >
                    {paragraph}
                  </p>
                ))}

                <Divider tone="light" className="my-7" />

                <ChipButton href={aboutContent.cta.href} variant="dark">
                  {aboutContent.cta.label}
                </ChipButton>
              </ReadingPanel>
            </div>
            <StatRow items={aboutContent.facts} className="mt-20 lg:mt-28" />

            <Relationships />
          </SectionIntro>
        </Container>
      </Scene>
    </Section>
  );
}

/**
 * Where Novit works, and the argument about what that is worth. This was a
 * numbered band of its own — `05 · Relaciones` — carrying one three-line
 * paragraph and five country names, which is not a section's worth of
 * anything, and it was making the same case as the two paragraphs above it:
 * who we are, and that the measure is how long clients stay. So it moved in
 * here.
 *
 * The historical three keep the "hemos trabajado en" label the brand data
 * table requires for them; the present five are stated flatly. That
 * distinction is the whole reason both lists exist.
 */
function Relationships() {
  return (
    <div className="mt-24 grid gap-12 lg:mt-32 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.8fr)] lg:gap-16">
      <div data-anim-block>
        <span
          data-anim="bar"
          aria-hidden="true"
          className="block h-0.5 w-6 bg-celeste"
        />
        <p
          data-anim="chip"
          className="mt-4 eyebrow text-on-eyebrow"
        >
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
        <p
          data-anim="rise"
          className="mt-6 max-w-[46ch] text-sm leading-7 text-on-label"
        >
          {partnersContent.historicalNote}
        </p>
      </div>

      <div data-anim-block>
        <p className="eyebrow text-on-eyebrow">
          Donde trabajamos hoy
        </p>
        <ul data-anim="rise" className="mt-6 flex flex-wrap gap-x-8 gap-y-3">
          {partnersContent.activeMarkets.map((market) => (
            <li key={market} className="display-m text-blanco">
              {market}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

