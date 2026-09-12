import type { Highlight } from "@/content/site";
import { Card, CardText } from "@/components/cards/Card";
import { Illustration } from "@/components/ui/Illustration";

type HighlightCardProps = {
  highlight: Highlight;
  className?: string;
};

/**
 * The three arguments that lead into the services: the risk, the
 * infrastructure, the method. They state the market's problem, not Novit's
 * answer, so they stay celeste — the answer, and the violet, comes with the
 * services below.
 *
 * This was a kicker, a heading and a paragraph, and the paragraph carried
 * everything: three of them side by side gave the reader three walls of
 * equal-looking grey text. The card leads with a picture and a mark and ends
 * with the one line it wants remembered, which is `Card`'s whole shape — the
 * illustration is what catches an eye scrolling past, the badge tells the
 * three apart at a glance, and the takeaway is the claim set apart from the
 * paragraph that explains it.
 *
 * The plate is square because the three drawings are. `object-contain`
 * letterboxes whatever does not fit, so a 16/10 plate turned two near-square
 * drawings into 138px slivers with 70px of white either side — the ratio of
 * the art decides the ratio of the plate, not the other way round.
 */
export function HighlightCard({ highlight, className }: HighlightCardProps) {
  return (
    <Card
      media={
        <Illustration
          name={highlight.illustration}
          className="aspect-square w-full"
          sizes="(max-width: 640px) 88vw, (max-width: 1024px) 44vw, 340px"
        />
      }
      icon={highlight.icon}
      label={highlight.kicker}
      title={highlight.title}
      footer={{ text: highlight.takeaway }}
      className={className}
    >
      <CardText>{highlight.description}</CardText>
    </Card>
  );
}
