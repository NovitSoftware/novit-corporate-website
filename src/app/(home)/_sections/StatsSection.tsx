import { Container } from "@/components/ui/Container";
import { CountUp } from "@/components/motion/CountUp";
import { Scene } from "@/components/motion/Scene";
import { Section } from "@/components/section/Section";
import { statsContent } from "@/content/home";

/**
 * La franja de datos: three figures across the full measure, with no heading
 * and no rail. The reference gives the strip no volanta and none is invented —
 * a figure over the sentence that scopes it needs no announcing.
 *
 * `dt` is the figure and `dd` the sentence, so a screen reader reads each pair
 * as the term and its definition. Quantities count up on arrival; 2015 is left
 * alone, which `CountUp` decides on its own.
 */
export function StatsSection() {
  return (
    <Section id={statsContent.id}>
      <Scene>
        <Container>
          <dl
            data-anim-batch
            className="grid gap-y-10 sm:grid-cols-3 sm:gap-x-8"
          >
            {statsContent.items.map((item) => (
              <div key={item.value}>
                <span
                  data-anim="bar"
                  aria-hidden="true"
                  className="mb-6 block h-px w-full bg-[linear-gradient(90deg,var(--celeste),transparent)]"
                />
                <div data-anim="rise">
                  <dt className="display-xl tabular-nums text-blanco">
                    <CountUp value={item.value} />
                  </dt>
                  <dd className="mt-4 max-w-[34ch] text-base leading-7 text-on-detail sm:text-lg sm:leading-8">
                    {item.text}
                  </dd>
                </div>
              </div>
            ))}
          </dl>
        </Container>
      </Scene>
    </Section>
  );
}
