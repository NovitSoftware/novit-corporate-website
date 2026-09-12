import { CaseCard } from "@/components/cards/CaseCard";
import { Container } from "@/components/ui/Container";
import { Scene } from "@/components/motion/Scene";
import { Section } from "@/components/ui/Section";
import { SectionIntro } from "@/components/ui/SectionIntro";
import { casesContent } from "@/content/site";

/**
 * The proof, placed straight after the services so the offer is answered by
 * four things that already run. Four cards on one row at desktop, because the
 * argument is that this is a set of four comparable first agents and not a
 * ranked list.
 *
 * Each card carries its own client's logo, so the separate "Confían en Novit"
 * strip that used to sit below the grid is gone — with the cases named it was
 * showing the same four marks twice.
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
              <div
                data-anim-batch
                className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
              >
                {casesContent.cases.map((study) => (
                  <div key={study.id} data-anim="card">
                    <CaseCard study={study} />
                  </div>
                ))}
              </div>
            }
          />
        </Container>
      </Scene>
    </Section>
  );
}
