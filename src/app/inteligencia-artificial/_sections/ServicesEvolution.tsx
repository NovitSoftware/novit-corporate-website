import { CardGrid } from "@/components/cards/CardGrid";
import { Card, CardText } from "@/components/cards/Card";
import { Container } from "@/components/ui/Container";
import { Scene } from "@/components/motion/Scene";
import { Section } from "@/components/section/Section";
import { SectionIntro } from "@/components/section/SectionIntro";
import { servicesPageContent } from "@/content/inteligencia-artificial";

/**
 * How a company gets from one agent to a strategy, in the four steps it
 * actually happens in.
 *
 * The only numbered thing on the page, and the only thing on it that is a real
 * sequence: the infrastructure has to exist before the second agent can be
 * cheaper than the first. Every other set here is held at once — six risks,
 * four decisions, three offer lines — and numbering any of them would promise
 * an order the content does not have.
 *
 * ## The rules are the argument
 *
 * Each footer rule is longer than the last, so the row draws what the steps
 * describe: something is left installed each time, and the fourth stands on
 * all of it. This is the one place on the site where a caller is allowed to
 * change a card's rule width, and `Card`'s `footer.rule` exists for it.
 *
 * The step number is the card's eyebrow. It is violet because this is Novit
 * describing its own method, and it is the only genuine sequence on the page —
 * everything else here is held at once.
 */
export function ServicesEvolution() {
  const { evolution } = servicesPageContent;
  /* 28 → 52 → 76 → 100. Even steps, and the first one wide enough to still
     read as a rule rather than as a dash. */
  const RULE_WIDTH = ["28%", "52%", "76%", "100%"];

  return (
    <Section id={evolution.id}>
      <Scene>
        <Container>
          <SectionIntro
            eyebrow={evolution.eyebrow}
            title={evolution.title}
            aside={
              <p
                data-anim="rise"
                className="max-w-[52ch] text-base leading-7 text-on-detail sm:text-lg sm:leading-8"
              >
                {evolution.lead}
              </p>
            }
            below={
              <CardGrid as="ol" columns={4}>
                {evolution.steps.map((step, index) => (
                  <li key={step.title} data-anim="card">
                    <Card
                      icon={step.icon}
                      label={String(index + 1).padStart(2, "0")}
                      title={step.title}
                      size="base"
                      footer={{
                        label: "Deja instalado",
                        icon: "check",
                        text: step.leaves,
                        ruleWidth: RULE_WIDTH[index],
                        /* The one band that asks for the reserved second
                           line. The four rules only draw the argument if
                           they sit at the same height across the row, and
                           two of the four takeaways wrap. */
                        minLines: 2,
                      }}
                    >
                      <CardText>{step.description}</CardText>
                    </Card>
                  </li>
                ))}
              </CardGrid>
            }
          />
        </Container>
      </Scene>
    </Section>
  );
}
