import { CardText } from "@/components/cards/Card";
import { ChipButton } from "@/components/ui/ChipButton";
import { Container } from "@/components/ui/Container";
import { PanelRow } from "@/components/ui/PanelRow";
import { PinnedIntro } from "@/components/ui/PinnedIntro";
import { ReadingPanel } from "@/components/ui/ReadingPanel";
import { Scene } from "@/components/motion/Scene";
import { Section } from "@/components/ui/Section";
import { academyPageContent } from "@/content/site";

/**
 * When registration opens, and where the announcement will be.
 *
 * ## There is no form here, and none is promised
 *
 * There was one: four fields, validation, a submit button — and no endpoint,
 * so a postulación went nowhere and the page admitted it in small print
 * underneath. That is a bad trade on any page and a worse one here, because
 * what a reader of a course page actually needs is two facts, and both of
 * them are sentences: it opens on 22 September, and the announcement lands on
 * this page and on Instagram. Nothing about that needs a text input.
 *
 * The copy that replaced the form then promised one anyway — "el formulario
 * aparece acá el 22 de septiembre" — which is the same commitment moved into
 * a caption. Whether registration is taken by form has not been decided, so
 * both channels now describe the announcement and neither describes how to
 * sign up. Do not reintroduce a mechanism here before it is confirmed.
 *
 * Nothing is commented out: `useUnsentForm` and `FormField` are still in use
 * by the contact section, so if a form is confirmed this band is four
 * `FormField`s away from having one.
 *
 * Last on the page, which is deliberate and also structural: `SectionHandoff`
 * excludes the final band from the exit fade, so the date is at full strength
 * when the page bottoms out instead of sitting dimmed under the footer.
 */
export function AcademyRegistration() {
  const { registration } = academyPageContent.sections;

  return (
    <Section id={registration.id}>
      <Scene>
        <Container>
          <PinnedIntro
            eyebrow={registration.eyebrow}
            title={registration.title}
            beside={
              <ReadingPanel as="div">
                <ul data-anim-batch className="grid gap-6 sm:grid-cols-2">
                  {registration.channels.map((channel) => (
                    <li key={channel.id} data-anim="rise">
                      <PanelRow
                        icon={channel.icon}
                        title={
                          /* `in` rather than an optional property, so the
                             content stays a plain `as const` object and the
                             icon names keep their literal types. Only one of
                             the two channels is somewhere to go. */
                          "href" in channel ? (
                            <a
                              href={channel.href}
                              target="_blank"
                              rel="noreferrer"
                              className="link-rule"
                            >
                              {channel.label}
                            </a>
                          ) : (
                            channel.label
                          )
                        }
                      >
                        <CardText>{channel.detail}</CardText>
                      </PanelRow>
                    </li>
                  ))}
                </ul>

                {/* For the reader who has a question now and is not going to
                    wait three weeks to ask it. Below the rule because it is
                    the exception, not the instruction. */}
                <div
                  data-anim="rise"
                  className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-4 border-t border-t-gris-borde-suave pt-7"
                >
                  <CardText>{registration.aside.text}</CardText>
                  <ChipButton href={registration.aside.cta.href}>
                    {registration.aside.cta.label}
                  </ChipButton>
                </div>
              </ReadingPanel>
            }
          >
            <p
              data-anim="rise"
              className="max-w-[46ch] text-base leading-7 text-on-detail sm:text-lg sm:leading-8"
            >
              {registration.lead}
            </p>
          </PinnedIntro>
        </Container>
      </Scene>
    </Section>
  );
}
