import { CardGrid } from "@/components/cards/CardGrid";
import { CaseCard } from "@/components/cards/CaseCard";
import { Container } from "@/components/ui/Container";
import { Scene } from "@/components/motion/Scene";
import { Section } from "@/components/ui/Section";
import { SectionIntro } from "@/components/ui/SectionIntro";
import { casesContent, servicesPageContent } from "@/content/site";

/**
 * The four agents in production, and what each one left behind.
 *
 * ## Why this is `CaseCard` and not a layout of its own
 *
 * It was four full-measure rows inside one panel — logo, then the copy, then
 * the result set large in a third column — on the argument that the home page
 * asks *who trusts Novit* and this page asks *what came out of it*, so the
 * same four clients should be arranged for the opposite emphasis. The
 * brochure does not agree: slide 04 is a 2×2 of cards, logo at the head of
 * each, the result behind a rule at the foot. That is `CaseCard`, exactly, and
 * it was already built.
 *
 * So the two bands share the card and differ where they should — in the
 * heading and the lead above it. The rows were a second layout maintained for
 * the same four objects, and the emphasis they bought was not worth it: at
 * full measure the result ended up in a column so far right of the client's
 * name that the two stopped reading as one claim.
 *
 * The band sits directly above Evolución, which opens "ninguna de estas
 * empresas…". That is the order the brochure uses and the reason for it: the
 * pronoun needs these four to have been shown already.
 */
export function ServicesCases() {
  const { cases } = servicesPageContent;

  return (
    <Section id={cases.id}>
      <Scene>
        <Container>
          <SectionIntro
            eyebrow={cases.eyebrow}
            title={cases.title}
            aside={
              <p
                data-anim="rise"
                className="max-w-[52ch] text-base leading-7 text-on-detail sm:text-lg sm:leading-8"
              >
                {cases.lead}
              </p>
            }
            below={
              <CardGrid columns={2}>
                {casesContent.cases.map((study) => (
                  <li key={study.id} data-anim="card">
                    <CaseCard study={study} />
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
