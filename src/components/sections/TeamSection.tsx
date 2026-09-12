import { ChipButton } from "@/components/ui/ChipButton";
import { Container } from "@/components/ui/Container";
import { Icon, type IconName } from "@/components/ui/Icon";
import { ReadingPanel } from "@/components/ui/ReadingPanel";
import { Scene } from "@/components/motion/Scene";
import { Section } from "@/components/ui/Section";
import { SectionIntro } from "@/components/ui/SectionIntro";
import { teamContent } from "@/content/site";

export function TeamSection() {
  return (
    <Section id="equipo">
      <Scene>
        <Container>
          <SectionIntro
            index={teamContent.index}
            eyebrow={teamContent.eyebrow}
            title={teamContent.title}
            aside={
              <ReadingPanel>
                <p className="text-base leading-7 text-texto">
                  {teamContent.description}
                </p>
                <div className="mt-7">
                  <ChipButton href={teamContent.careersCta.href} variant="dark">
                    {teamContent.careersCta.label}
                  </ChipButton>
                </div>
              </ReadingPanel>
            }
            below={
              <>
                <ul
                  data-anim-batch
                  className="grid gap-8 sm:grid-cols-2 sm:gap-12"
                >
                  {teamContent.founders.map((person) => (
                    <li key={person.name}>
                      <FounderEntry name={person.name} role={person.role} />
                    </li>
                  ))}
                </ul>

                <ul
                  data-anim-batch
                  className="mt-16 grid gap-8 lg:mt-20 md:grid-cols-2 lg:grid-cols-4"
                >
                  {teamContent.values.map((value) => (
                    <li key={value.title} className="h-full">
                      <ValueCard
                        title={value.title}
                        text={value.text}
                        icon={value.icon}
                      />
                    </li>
                  ))}
                </ul>
              </>
            }
          />
        </Container>
      </Scene>
    </Section>
  );
}

type FounderEntryProps = {
  name: string;
  role: string;
};

/**
 * Two names and two roles — which is all the content there is for the
 * founders, and nowhere near enough to fill the card this used to be: a 224px
 * panel of flat azul standing in for a portrait, then a `Dirección` chip
 * repeating what the role line said underneath it.
 *
 * A masthead entry is the honest shape for two lines. It also puts them on
 * the gradient, where two lines belong.
 */
function FounderEntry({ name, role }: FounderEntryProps) {
  return (
    <div>
      <span
        data-anim="bar"
        aria-hidden="true"
        className="mb-5 block h-px w-full bg-[linear-gradient(90deg,var(--celeste),transparent)]"
      />
      <div data-anim="rise">
        <p className="display-m text-blanco">{name}</p>
        <p className="mt-2 text-sm text-on-detail">{role}</p>
      </div>
    </div>
  );
}

type ValueCardProps = {
  title: string;
  text: string;
  icon: IconName;
};

/**
 * Four short statements, so they stay on the gradient and give it somewhere
 * to be seen between two light panels. The rule above each was an
 * azul-into-celeste gradient — a third gradient, which the system does not
 * have — and is now simply celeste.
 */
function ValueCard({ title, text, icon }: ValueCardProps) {
  return (
    <article className="h-full">
      <span
        data-anim="bar"
        aria-hidden="true"
        className="block h-0.5 w-full bg-celeste"
      />
      <div data-anim="rise">
        <h3 className="mt-5 flex items-center gap-2.5 text-lg font-bold text-blanco">
          <Icon name={icon} className="size-5 text-celeste" />
          {title}
        </h3>
        <p className="mt-3 text-sm leading-7 text-on-detail">{text}</p>
      </div>
    </article>
  );
}

/*
 * `AcademyBlock` used to live here — an aside at the foot of this section
 * under "marca empleadora", with the four figures and one paragraph. The
 * Academia is now the first section after the hero and carries the whole
 * programme; see `sections/AcademySection.tsx`. What stays here is the
 * Compañerismo value's line about it, which is the part that actually belongs
 * to a section about the team.
 */
