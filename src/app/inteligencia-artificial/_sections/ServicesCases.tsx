import { CardGrid } from "@/shared/cards/CardGrid";
import { CaseCard } from "@/shared/cards/CaseCard";
import { Container } from "@/shared/ui/Container";
import { Scene } from "@/shared/motion/Scene";
import { Section } from "@/shared/ui/Section";
import { SectionIntro } from "@/shared/ui/SectionIntro";
import { casesContent } from "@/shared/content/cases";
import { servicesPageContent } from "../_content/inteligencia-artificial";

/**
 * The agents in production, from `casesContent` — the same cards the home
 * page shows, under this page's own heading and lead. `CaseCard` rather than
 * a layout of its own: one card, two callers.
 *
 * The band sits directly above Evolución, whose lead opens "ninguna de estas
 * empresas…" and needs these cards to have been shown already.
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
