import { CardText } from "@/components/cards/Card";
import { Container } from "@/components/ui/Container";
import { PanelRow } from "@/components/section/PanelRow";
import { ReadingPanel } from "@/components/section/ReadingPanel";
import { Scene } from "@/components/motion/Scene";
import { Section } from "@/components/section/Section";
import { SectionIntro } from "@/components/section/SectionIntro";
import { servicesPageContent } from "@/content/inteligencia-artificial";

/**
 * The diagram: four agents, one platform under all of them.
 *
 * ## Why it is drawn this way
 *
 * This is the claim the whole page rests on — each new agent costs less than
 * the last — and it is the one thing a director cannot be told, only shown.
 * The brochure draws it as three stacked parts and so does this:
 *
 *   1. the agents, as four equal boxes on the gradient — light, separable,
 *      replaceable, and deliberately not cards;
 *   2. a rule with the join written on it, "todos consumen los mismos
 *      servicios", which is the sentence the picture exists to make;
 *   3. the platform, as one solid panel holding the four shared services.
 *
 * The surfaces carry the argument and no new colour is needed to say it. The
 * agents float; the platform is the only solid thing in the frame. Swap those
 * two treatments and the diagram says the opposite.
 *
 * ## What it replaces
 *
 * A `<figure>` at the foot of `ServicesOpener` with the same three parts and
 * no heading over them, arriving before the reader had been given a reason to
 * care about a shared architecture. The parts were legible; the band was not.
 * The fix was position and a title, not more drawing.
 *
 * The caption sits on the rule rather than under the panel. It was a
 * `<figcaption>` at the very bottom, which meant the label naming the whole
 * picture arrived after the picture had finished — and in the reveal it
 * animated ahead of the four cells it captions, because `closest()` put it in
 * the figure's own block.
 */
export function ServicesArchitecture() {
  const { architecture } = servicesPageContent;

  return (
    <Section id={architecture.id}>
      <Scene>
        <Container>
          <SectionIntro
            eyebrow={architecture.eyebrow}
            title={architecture.title}
            aside={
              <p
                data-anim="rise"
                className="max-w-[52ch] text-base leading-7 text-on-detail sm:text-lg sm:leading-8"
              >
                {architecture.lead}
              </p>
            }
            below={
              <figure data-anim-block>
                <p className="text-[0.625rem] font-bold uppercase tracking-[0.18em] text-on-label">
                  {architecture.agentsLabel}
                </p>

                {/* Equal boxes on a four-track grid: they are peers, and a
                    row of pills sized by their own labels reads as a set of
                    tags instead of as four things standing on one thing. */}
                <ul
                  data-anim="rise"
                  className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4"
                >
                  {architecture.agents.map((agent) => (
                    <li
                      key={agent}
                      className="rounded-card border border-blanco/25 bg-blanco/[0.06] px-4 py-3.5 text-sm font-bold leading-snug text-blanco"
                    >
                      {agent}
                    </li>
                  ))}
                </ul>

                {/* The join. The rule draws itself in from the left like every
                    other rule on the site, and the caption rides on it. */}
                <div className="mt-8 flex items-center gap-5">
                  <span
                    data-anim="bar"
                    aria-hidden="true"
                    className="block h-0.5 min-w-0 flex-1 bg-celeste"
                  />
                  <figcaption
                    data-anim="rise"
                    className="shrink-0 text-[0.625rem] font-bold uppercase tracking-[0.18em] text-celeste"
                  >
                    {architecture.sharedLabel}
                  </figcaption>
                  <span
                    aria-hidden="true"
                    className="hidden h-0.5 min-w-0 flex-1 bg-celeste sm:block"
                  />
                </div>

                {/* The platform: one solid block, which is the whole point
                    of the drawing — the agents above it float, this does not.

                    It carried the violet card rule, because this is the part
                    Novit builds and owns. That rule is gone site-wide (violet
                    marks Novit's *comment*, never a whole object — see
                    `cards/Card.tsx`); the violet label inside it still says
                    whose platform it is. */}
                <ReadingPanel data-anim="card" className="mt-6">
                  <p className="card-ink-voice text-[0.625rem] font-bold uppercase tracking-[0.18em]">
                    {architecture.platformLabel}
                  </p>
                  <ul className="mt-6 grid gap-x-8 gap-y-7 sm:grid-cols-2 lg:grid-cols-4">
                    {architecture.shared.map((service) => (
                      <li key={service.title}>
                        <PanelRow icon={service.icon} title={service.title}>
                          <CardText>{service.detail}</CardText>
                        </PanelRow>
                      </li>
                    ))}
                  </ul>
                </ReadingPanel>
              </figure>
            }
          />
        </Container>
      </Scene>
    </Section>
  );
}
