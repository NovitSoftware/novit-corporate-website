import { CardGrid } from "@/shared/cards/CardGrid";
import { CaseCard } from "@/shared/cards/CaseCard";
import { Container } from "@/shared/ui/Container";
import { Scene } from "@/shared/motion/Scene";
import { Section } from "@/shared/ui/Section";
import { SectionIntro } from "@/shared/ui/SectionIntro";
import { casesContent } from "@/shared/content/cases";

/**
 * The cases band, straight after the services. One row at desktop — the cards
 * are peers, not a ranked list — from `casesContent`, which
 * `/inteligencia-artificial` renders too, under its own heading.
 *
 * Each card carries its own client's logo, so the separate "Confían en Novit"
 * strip that used to sit below the grid is gone.
 */
export function CasesSection() {
  return (
    <Section id="casos">
      <Scene>
        <Container>
          <SectionIntro
            index={casesContent.index}
            eyebrow={casesContent.eyebrow}
            title={casesContent.title}
            aside={
              <p
                data-anim="rise"
                className="max-w-[52ch] text-base leading-7 text-on-detail sm:text-lg sm:leading-8"
              >
                {casesContent.description}
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
