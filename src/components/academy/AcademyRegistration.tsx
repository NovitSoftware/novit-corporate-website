import { ChipButton } from "@/components/ui/ChipButton";
import { Container } from "@/components/ui/Container";
import { Icon } from "@/components/ui/Icon";
import { PinnedIntro } from "@/components/ui/PinnedIntro";
import { ReadingPanel } from "@/components/ui/ReadingPanel";
import { Scene } from "@/components/motion/Scene";
import { Section } from "@/components/ui/Section";
import { academyPageContent } from "@/content/site";

/**
 * When registration opens, and where the announcement will be.
 *
 * ## There is no form here any more
 *
 * There was one: four fields, validation, a submit button — and no endpoint,
 * so a postulación went nowhere and the page admitted it in small print
 * underneath. That is a bad trade on any page and a worse one here, because
 * what a reader of a course page actually needs is two facts, and both of
 * them are sentences: it opens on 22 September, and the announcement lands on
 * this page and on Instagram. Nothing about that needs a text input.
 *
 * The form is not commented out anywhere — `useUnsentForm` and `FormField`
 * are still in use by the contact section, so when the endpoint exists this
 * band is four `FormField`s away from having one again.
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
              <ReadingPanel voice as="div">
                <ul data-anim-batch className="grid gap-6 sm:grid-cols-2">
                  {registration.channels.map((channel) => (
                    <li key={channel.id} data-anim="rise">
                      <h3 className="flex items-center gap-2.5 text-[1.0625rem] font-bold leading-snug text-azul">
                        <Icon
                          name={channel.icon}
                          className="size-5 shrink-0 text-violeta-medio"
                        />
                        {/* `in` rather than an optional property, so the
                            content stays a plain `as const` object and the
                            icon names keep their literal types. Only one of
                            the two channels is somewhere to go. */}
                        {"href" in channel ? (
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
                        )}
                      </h3>
                      <p className="mt-2 text-[0.9375rem] leading-relaxed text-texto">
                        {channel.detail}
                      </p>
                    </li>
                  ))}
                </ul>

                {/* For the reader who has a question now and is not going to
                    wait three weeks to ask it. Below the rule because it is
                    the exception, not the instruction. */}
                <div
                  data-anim="rise"
                  className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-4 border-t border-t-gris-borde pt-7"
                >
                  <p className="text-[0.9375rem] leading-relaxed text-texto">
                    {registration.aside.text}
                  </p>
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
