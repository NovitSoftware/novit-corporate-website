import { Card, CardText } from "@/components/cards/Card";
import type { IconName } from "@/components/ui/Icon";

export type ServiceItem = {
  title: string;
  description: string;
  /** The one-phrase answer to "what is this", read before the paragraph. */
  meta?: string;
  icon?: IconName;
  variant?: "default" | "featured";
};

type ServiceCardProps = {
  service: ServiceItem;
  className?: string;
};

/**
 * What Novit does, stated plainly.
 *
 * These cards used to open with a graphic panel holding the top two thirds —
 * up to 288px of flat `azul` with the bar field at 90% over it. A large flat
 * fill in the brand blue is the one surface treatment the system rules out,
 * because that colour is meant to arrive as a gradient; the isotipo grid is
 * specified as a watermark at 7–8%, bled off an edge and never the
 * protagonist, and at 90% across a third of the card it was the protagonist.
 *
 * What replaced it is the badge and the `meta` eyebrow, which is the least
 * decoration that does the job the panel was trying to do: five cards that all
 * opened with a bold title and a paragraph were indistinguishable until read.
 *
 * The featured card is Novit's own positioning rather than one more service,
 * and it says so by running the full width of the grid at the larger title
 * size. It used to say so in violet as well, on the argument that violet is
 * the mark for where Novit speaks. That is the right rule read one level too
 * high: cap. 01 puts violet on *the comment inside a ficha*, not on the ficha,
 * and a violet card claims the fact itself is Novit's. Scale is the difference
 * now, which is also the difference a reader can see from the side of the
 * page. It used to set the title against the description in two columns, which
 * no other card on the site did; the size does that work now, and the row
 * reads as one family.
 */
export function ServiceCard({ service, className }: ServiceCardProps) {
  const featured = service.variant === "featured";

  return (
    <Card
      icon={service.icon}
      label={service.meta}
      title={service.title}
      size={featured ? "xl" : "lg"}
      className={className}
    >
      <CardText>{service.description}</CardText>
    </Card>
  );
}
