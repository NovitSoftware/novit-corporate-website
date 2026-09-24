import { casesContent, type CaseStudy } from "@/content/cases";
import { Card, CardText } from "@/components/cards/Card";
import { CaseLogo } from "@/components/cards/CaseLogo";

type CaseCardProps = {
  study: CaseStudy;
  className?: string;
};

/**
 * One agent in production, for one named client.
 *
 * The logo goes in the card's `media` slot, which is what the slot is for: a
 * credential, above the hairline, separate from the claim. The result is the
 * reason the card exists, so it takes the footer — the paragraph is how it was
 * done, the footer line is the argument.
 *
 * Both pages that name a client use this card now. `/inteligencia-artificial`
 * used to arrange the same four as full-measure rows with the result set large
 * in a third column, on the reasoning that the home page asks *who trusts
 * Novit* and that page asks *what came out of it*. Two layouts for four
 * objects was not worth the distinction, and the brochure sets them as a 2×2
 * of cards anyway.
 */
export function CaseCard({ study, className }: CaseCardProps) {
  return (
    <Card
      media={<CaseLogo logo={study.logo} />}
      icon={study.icon}
      label={study.area}
      title={study.title}
      footer={{
        label: casesContent.resultLabel,
        icon: "metric",
        text: study.result,
      }}
      className={className}
    >
      <CardText>{study.description}</CardText>
    </Card>
  );
}
