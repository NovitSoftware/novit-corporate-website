import { CardText } from "@/components/cards/Card";
import { Container } from "@/components/ui/Container";
import { PanelRow } from "@/components/ui/PanelRow";
import { ReadingPanel } from "@/components/ui/ReadingPanel";
import { Scene } from "@/components/motion/Scene";
import { Section } from "@/components/ui/Section";
import { SectionIntro } from "@/components/ui/SectionIntro";
import { servicesPageContent } from "@/content/site";

/**
 * Six answers to the question in the heading: why not just hire the vendors.
 *
 * ## Violet, because the six are an argument
 *
 * Each heading is a subject and then the thing that goes wrong with it —
 * "Datos sensibles" / "fuera de control" — and the second half is set in
 * `violeta-medio`, with the mark and the rule to match. It was celeste, the
 * accent the page uses for everything neutral, which made six problems look
 * like six features. It was then briefly a red, which is what the brochure
 * does, and which on this page reads as orange — a colour from no system at
 * all. Violet is the right answer by the site's own rule rather than a
 * compromise: azul is the world and violet is Novit speaking, and these six
 * are not a neutral fact about the market, they are Novit's reading of what
 * buying agents one at a time leaves behind.
 *
 * ## On the reading surface, not on the gradient
 *
 * These were six bare columns on the gradient, on the argument that the risks
 * are the market's problem and the answers are Novit's, and that the surface
 * should carry that difference. It is a nice distinction and it cost the band
 * its legibility: six short paragraphs in white-at-82% over a moving gradient,
 * with no panel anywhere, is the one place on the site where long-ish copy sat
 * on the raw ground. The brochure sets them on the light panel. So does this.
 *
 * Six across three columns rather than six cards. They are one sentence each;
 * a card around each one would be six boxes of chrome around thirty words.
 *
 * Not numbered. There is no worst one and no first one — a company can be
 * living all six at once, which is the point.
 */
export function ServicesRisk() {
  const { risk } = servicesPageContent;

  return (
    <Section id={risk.id}>
      <Scene>
        <Container>
          <SectionIntro
            eyebrow={risk.eyebrow}
            title={risk.title}
            aside={
              <p
                data-anim="rise"
                className="max-w-[52ch] text-base leading-7 text-on-detail sm:text-lg sm:leading-8"
              >
                {risk.lead}
              </p>
            }
            below={
              <ReadingPanel as="section">
                <ul
                  data-anim-batch
                  className="grid gap-x-10 gap-y-9 sm:grid-cols-2 lg:grid-cols-3"
                >
                  {risk.items.map((item) => (
                    <li key={item.title}>
                      <span
                        data-anim="bar"
                        aria-hidden="true"
                        className="mb-4 block h-px w-full bg-[linear-gradient(90deg,var(--violeta-medio),transparent)]"
                      />
                      <div data-anim="rise">
                        {/* `titleAside` rather than markup inside one string:
                            the split is data (see `servicesPageContent.risk`)
                            so whoever rewrites the subject also sees which
                            words are the damage. */}
                        <PanelRow
                          icon={item.icon}
                          title={item.title}
                          titleAside={item.negative}
                        >
                          <CardText>{item.description}</CardText>
                        </PanelRow>
                      </div>
                    </li>
                  ))}
                </ul>
              </ReadingPanel>
            }
          />
        </Container>
      </Scene>
    </Section>
  );
}
