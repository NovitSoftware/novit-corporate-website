import { CardText } from "@/components/cards/Card";
import {
  InstagramIcon,
  LinkedInIcon,
  MailIcon,
} from "@/components/ui/ContactIcons";
import { Container } from "@/components/ui/Container";
import { PanelRow } from "@/components/ui/PanelRow";
import { PinnedIntro } from "@/components/ui/PinnedIntro";
import { ReadingPanel } from "@/components/ui/ReadingPanel";
import { Scene } from "@/components/motion/Scene";
import { Section } from "@/components/ui/Section";
import { academyPageContent } from "@/content/site";

/**
 * Where to write about the Academia, and where its editions are announced.
 *
 * ## There is no form here, and none is promised
 *
 * There was one: four fields, validation, a submit button — and no endpoint,
 * so a postulación went nowhere and the page admitted it in small print
 * underneath. What replaced it was a date and a channel list that put "Esta
 * página" first, which committed this site to publishing each edition's
 * opening, closing and cupo. Both are out. Novit announces editions on its own
 * accounts; this band says so and gives the address where a question is
 * answered.
 *
 * Do not reintroduce a form, and do not reintroduce a date. `useUnsentForm`
 * and `FormField` are still in use by the contact section if the first one is
 * ever confirmed.
 *
 * ## Three rows in a two-column grid, and the first one spans it
 *
 * The inbox, then the two accounts. Three items in a two-up grid otherwise
 * leave a hole the width of a card in the bottom right, and the one that
 * should take the full measure is the one the band is about: the address runs
 * the width of the panel, the two accounts share the row under it. That is the
 * hierarchy as well as the fix — write here, and watch those.
 *
 * Every row is a link now. The previous version had one channel that was
 * somewhere to go and one that was not, which is what the `"href" in channel`
 * test was for; with all three linked the row takes an anchor unconditionally.
 *
 * The aside under the rule went with the date: it read "¿Consultas sobre la
 * cursada antes de que abra?" over an "Escribinos" chip, which is the
 * exception to a rule the band no longer has. The inbox is the instruction
 * now, so it is the first row rather than a footnote under the last one.
 *
 * Last on the page, which is deliberate and also structural: `SectionHandoff`
 * excludes the final band from the exit fade, so the address is at full
 * strength when the page bottoms out instead of sitting dimmed under the
 * footer.
 */
/** Keyed on the channel's own `id`, so a row gets its mark by naming itself.
 *  Same convention as `SOCIAL_ICONS` in the footer. */
const CHANNEL_MARKS = {
  correo: MailIcon,
  instagram: InstagramIcon,
  linkedin: LinkedInIcon,
} as const;

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
                  {registration.channels.map((channel, index) => {
                    const Mark = CHANNEL_MARKS[channel.id];

                    return (
                    <li
                      key={channel.id}
                      data-anim="rise"
                      className={index === 0 ? "sm:col-span-2" : undefined}
                    >
                      <PanelRow
                        mark={<Mark className="size-[1.125rem]" />}
                        title={
                          <a
                            href={channel.href}
                            /* The two social accounts open away from the site;
                               a `mailto:` has no document to open, and a tab
                               target on one is either ignored or leaves an
                               empty tab behind. */
                            {...(channel.href.startsWith("mailto:")
                              ? {}
                              : { target: "_blank", rel: "noreferrer" })}
                            className="link-rule"
                          >
                            {channel.label}
                          </a>
                        }
                      >
                        <CardText>{channel.detail}</CardText>
                      </PanelRow>
                    </li>
                    );
                  })}
                </ul>
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
