import { Container } from "@/components/ui/Container";
import { IconLine, type IconName } from "@/components/ui/Icon";
import { Scene } from "@/components/motion/Scene";
import { Section } from "@/components/ui/Section";
import { SectionIntro } from "@/components/ui/SectionIntro";
import { casesPageContent } from "@/content/site";

/**
 * The recorrido: what the work was, in three groups.
 *
 * On the gradient rather than in cards. A card is a claim with a heading, a
 * paragraph and a takeaway; these are inventories — ten lines, then four, then
 * five — and putting them in three boxes of wildly different heights would
 * make the longest group look like the most important one rather than the
 * broadest.
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
                <div className="grid gap-12 lg:grid-cols-3 lg:gap-10">
                  {work.groups.map((group) => (
                    <WorkGroup
                      key={group.id}
                      icon={group.icon}
                      title={group.title}
                      items={group.items}
                    />
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

type WorkGroupProps = {
  icon: IconName;
  title: string;
  items: readonly string[];
};

/** A rule, a marked heading and the list under it — the shape the Equipo
 *  band's values already use, which is what a set of short statements on the
 *  gradient looks like here. */
function WorkGroup({ icon, title, items }: WorkGroupProps) {
  return (
    <div data-anim-block>
      <span
        data-anim="bar"
        aria-hidden="true"
        className="block h-0.5 w-full bg-celeste"
      />
      <div data-anim="rise">
        <h3 className="mt-5 flex items-start gap-2.5 text-lg font-bold text-blanco">
          <IconLine name={icon} size="heading" className="text-celeste" />
          {title}
        </h3>
        <ul className="mt-5 grid gap-4">
          {items.map((item) => (
            <li
              key={item}
              className="text-sm leading-7 text-on-detail before:mr-3 before:inline-block before:h-px before:w-3 before:translate-y-[-0.3em] before:bg-celeste/60 before:align-middle"
            >
              {item}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
