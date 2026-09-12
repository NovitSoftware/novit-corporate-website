import { Card, CardText } from "@/components/cards/Card";
import { Container } from "@/components/ui/Container";
import { PinnedIntro } from "@/components/ui/PinnedIntro";
import { Scene } from "@/components/motion/Scene";
import { Section } from "@/components/ui/Section";
import { servicesPageContent } from "@/content/site";

/**
 * The four decisions a partner is hired for: stack, measurement, security,
 * suppliers.
 *
 * Violet, because this is the one band on the page where Novit describes its
 * own role — everything around it describes the world. Same rule as every
 * other violet on the site.
 *
 * ## Two up, not four down
 *
 * They were a single column of four full-width cards, which turned four short
 * answers into four wide banners and ran the band to two full screens. Two up
 * is how the brochure sets them and it is the right shape for the content: the
 * four are held at once, not worked through, and a 2×2 is the only arrangement
 * that says so. Nothing is numbered for the same reason.
 *
 * The card leads with the decision and files it under the area — "Qué
 * construir y sobre qué base", labelled "Stack" — rather than the other way
 * round. See `servicesPageContent.partner`.
 *
 * Pinned: the statement holds while the four go past. It earns the pinning
 * here because the claim above them is what they are all evidence for.
 */
export function ServicesRole() {
  const { partner } = servicesPageContent;

  return (
    <Section id={partner.id}>
      <Scene>
        <Container>
          <PinnedIntro
            eyebrow={partner.eyebrow}
            title={partner.title}
            beside={
              <ul data-anim-batch className="grid gap-4 sm:grid-cols-2">
                {partner.items.map((item) => (
                  <li key={item.title} data-anim="card">
                    <Card
                      icon={item.icon}
                      label={item.label}
                      title={item.title}
                      accent="voice"
                    >
                      <CardText>{item.description}</CardText>
                    </Card>
                  </li>
                ))}
              </ul>
            }
          >
            <p
              data-anim="rise"
              className="max-w-[46ch] text-base leading-7 text-on-detail sm:text-lg sm:leading-8"
            >
              {partner.lead}
            </p>
          </PinnedIntro>
        </Container>
      </Scene>
    </Section>
  );
}
