import { Card } from "@/shared/cards/Card";
import { CardGrid } from "@/shared/cards/CardGrid";
import { CaseLogo } from "@/shared/cards/CaseLogo";
import { Container } from "@/shared/ui/Container";
import { IconLine } from "@/shared/ui/Icon";
import { Scene } from "@/shared/motion/Scene";
import { Section } from "@/shared/ui/Section";
import { SectionIntro } from "@/shared/ui/SectionIntro";
import { casesPageContent } from "../_content/casos-de-exito";

type WorkGroup = (typeof casesPageContent.work.groups)[number];

/**
 * The recorrido: nineteen projects, in three groups by what the work was.
 *
 * Three groups rather than one wall: a list of nineteen is scanned, not read,
 * and the grouping is the only thing that tells a reader whether their own
 * problem is in it. Each group takes the full measure and stacks under the
 * last, so the ten-card group is not a taller column beside a four-card one.
 *
 * The card is the one the whole site uses, with the client's mark in `media`
 * — a credential above the hairline, which is exactly what the slot is for —
 * the country as the label and the work as the title. No body and no footer:
 * the line *is* the card, and a paragraph repeating it would be filler.
 *
 * The closing line under them is the invitation the standing site ends this
 * page with, and it is deliberately not a button: the way in is the menu's
 * channels and the opener's, and a fourth ask at the foot of a list of work
 * reads as a sales page.
 */
export function CasesWork() {
  const { work, closing } = casesPageContent;

  return (
    <Section id={work.id}>
      <Scene>
        <Container>
          <SectionIntro
            eyebrow={work.eyebrow}
            title={work.title}
            aside={
              <p
                data-anim="rise"
                className="max-w-[52ch] text-base leading-7 text-on-detail sm:text-lg sm:leading-8"
              >
                {work.lead}
              </p>
            }
            below={
              <>
                <div className="grid gap-16 lg:gap-20">
                  {work.groups.map((group) => (
                    <WorkGroup key={group.id} group={group} />
                  ))}
                </div>

                <div data-anim-block className="mt-20 lg:mt-24">
                  <h3
                    data-anim="rise"
                    className="display-m max-w-[24ch] text-blanco"
                  >
                    {closing.title}
                  </h3>
                  <p
                    data-anim="rise"
                    className="mt-6 max-w-[46ch] text-base leading-7 text-on-detail sm:text-lg sm:leading-8"
                  >
                    {closing.description}
                  </p>
                </div>
              </>
            }
          />
        </Container>
      </Scene>
    </Section>
  );
}

/** A rule, a marked heading and the projects under it. The heading is the
 *  shape the Equipo band's values already use; what changed is what hangs off
 *  it, which is now cards rather than dashes. */
function WorkGroup({ group }: { group: WorkGroup }) {
  return (
    <div data-anim-block>
      <span
        data-anim="bar"
        aria-hidden="true"
        className="block h-0.5 w-full bg-celeste"
      />
      <h3 className="mt-5 flex items-start gap-2.5 text-lg font-bold text-blanco">
        <IconLine name={group.icon} size="heading" className="text-celeste" />
        {group.title}
      </h3>
      <CardGrid columns={3} className="mt-6">
        {group.items.map((item) => (
          <li key={item.logo.name} data-anim="card">
            <Card
              media={<CaseLogo logo={item.logo} />}
              label={item.country}
              title={item.description}
              size="base"
            />
          </li>
        ))}
      </CardGrid>
    </div>
  );
}
