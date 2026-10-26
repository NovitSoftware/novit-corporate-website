import { Card, CardText } from "@/components/cards/Card";
import { CardGrid } from "@/components/cards/CardGrid";
import { CardList } from "@/components/cards/CardList";
import { Container } from "@/components/ui/Container";
import { Emphasis } from "@/components/ui/Emphasis";
import { Icon } from "@/components/ui/Icon";
import { Image } from "@/components/ui/Image";
import { ReadingPanel } from "@/components/section/ReadingPanel";
import { Scene } from "@/components/motion/Scene";
import { Section } from "@/components/section/Section";
import { SectionIntro } from "@/components/section/SectionIntro";
import { developmentPageContent } from "@/content/desarrollo-y-consultoria";

/**
 * The three stages of a project, each one contractable on its own.
 *
 * Numbered, because this is a sequence and the standing site sells it as one:
 * each stage hands its deliverables to the next.
 *
 * The deliverables are Discovery's and take a panel of their own under the
 * three. Inside the first card they left the other two with a 250px hole —
 * and they read better as a list at the measure than as a column of five in a
 * third of it.
 */
export function DevelopmentStages() {
  const { build } = developmentPageContent;

  return (
    <Section id={build.id}>
      <Scene>
        <Container>
          <SectionIntro
            eyebrow={build.eyebrow}
            icon={build.icon}
            title={build.title}
            aside={
              <p
                data-anim="rise"
                className="max-w-[52ch] text-base leading-7 text-on-detail sm:text-lg sm:leading-8"
              >
                <Emphasis text={build.lead} />
              </p>
            }
            below={
              <>
                <CardGrid as="ol" columns={3}>
                  {build.stages.map((stage) => (
                    <li key={stage.id} data-anim="card">
                      <Card
                        icon={stage.icon}
                        label={stage.label}
                        title={stage.title}
                      >
                        <CardText>{stage.description}</CardText>
                      </Card>
                    </li>
                  ))}
                </CardGrid>

                {/* The team the second stage names, at work: the photographs
                    are the office's own, framed as the home page's Equipo. */}
                <ul
                  data-anim-batch
                  className="mt-4 grid gap-3 sm:grid-cols-3 sm:gap-4"
                >
                  {build.photos.map((photo, index) => (
                    <li
                      key={photo.src}
                      data-anim="card"
                      className={
                        index === 0
                          ? "team-photo aspect-[2/1] sm:col-span-2"
                          : "team-photo aspect-[4/3] sm:aspect-auto"
                      }
                    >
                      <Image
                        src={photo.src}
                        alt={photo.alt}
                        fill
                        sizes={
                          index === 0
                            ? "(min-width: 640px) 760px, 100vw"
                            : "(min-width: 640px) 380px, 100vw"
                        }
                        className="object-cover"
                      />
                    </li>
                  ))}
                </ul>

                <ReadingPanel as="section" data-anim-block className="mt-4">
                  <h3 className="card-ink-voice eyebrow flex items-center gap-2">
                    <Icon name="document" size="micro" />
                    {build.deliverablesLabel}
                  </h3>
                  <CardList
                    items={build.deliverables}
                    reveal
                    className="mt-6 sm:grid-cols-2 sm:gap-x-10"
                  />
                </ReadingPanel>
              </>
            }
          />
        </Container>
      </Scene>
    </Section>
  );
}
