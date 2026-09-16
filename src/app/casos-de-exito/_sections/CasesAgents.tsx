import { CardGrid } from "@/shared/cards/CardGrid";
import { CaseCard } from "@/shared/cards/CaseCard";
import { Container } from "@/shared/ui/Container";
import { Scene } from "@/shared/motion/Scene";
import { Section } from "@/shared/ui/Section";
import { SectionIntro } from "@/shared/ui/SectionIntro";
import { casesContent } from "@/shared/content/cases";
import { casesPageContent } from "../_content/casos-de-exito";

/**
 * The two agents in production, from `casesContent` — the same cards the home
 * page and `/inteligencia-artificial` show, under this page's own heading.
 * They lead because they are the only cases published with a client name and
 * a result; everything under them is the recorrido, told without names.
 */
export function CasesAgents() {
  const { agents } = casesPageContent;

  return (
    <Section id={agents.id}>
      <Scene>
        <Container>
          <SectionIntro
            eyebrow={agents.eyebrow}
            title={agents.title}
            aside={
              <p
                data-anim="rise"
                className="max-w-[52ch] text-base leading-7 text-on-detail sm:text-lg sm:leading-8"
              >
                {agents.lead}
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
