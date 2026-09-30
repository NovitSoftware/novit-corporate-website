import type { Service } from "@/content/home";
import { Card, CardText } from "@/components/cards/Card";
import { CardList } from "@/components/cards/CardList";
import { Icon, IconLine, type IconName } from "@/components/ui/Icon";
import { KeepCase } from "@/components/ui/KeepCase";

type ServiceCardProps = {
  service: Service;
  className?: string;
};

/**
 * One line of work: the volanta files it, the título is what it says, and the
 * body is whichever shape the reference wrote it in — a paragraph, or the
 * points as a marked list.
 *
 * All four are the same card. The only difference a caller can produce is how
 * much body there is.
 */
export function ServiceCard({ service, className }: ServiceCardProps) {
  return (
    <Card
      icon={service.icon}
      label={<KeepCase text={service.label} />}
      title={service.title}
      className={className}
    >
      {"description" in service ? (
        <CardText>{service.description}</CardText>
      ) : null}
      {"points" in service ? <CardList items={service.points} /> : null}
      {"layers" in service ? <ServiceLayers layers={service.layers} /> : null}
    </Card>
  );
}

/**
 * The agents, and the four capabilities they run on.
 *
 * The stack is the point: the reference asks for it to be visible that the
 * agents are mounted on what is underneath them, so the top layer stands
 * alone above the hairline and the base reads as one row of ground beneath it.
 */
function ServiceLayers({
  layers,
}: {
  layers: {
    top: string;
    base: readonly { label: string; icon: IconName }[];
  };
}) {
  return (
    <div className="@container mt-6">
      <span className="eyebrow card-ink-voice inline-flex items-center gap-2">
        <IconLine name="agent" size="micro" />
        {layers.top}
      </span>
      {/* Each capability leads with its mark, which is also what separates it
          from the one before: the middots that did that went with the icons.
          Two by two, because with the marks the four no longer fit one line
          of the card, and a wrapped row left one of them alone under three.
          The pair needs about 17.5rem; in a narrower card — a 320px phone,
          either column of the grid just past 640px — the tracks cannot shrink
          and pushed the card past its column, so there they stack in one. */}
      <ul className="card-divide mt-3 grid grid-cols-1 gap-x-6 gap-y-2.5 pt-3 @2xs:grid-cols-[repeat(2,max-content)]">
        {layers.base.map((item) => (
          <li
            key={item.label}
            className="eyebrow card-ink-body flex items-center gap-2"
          >
            <Icon name={item.icon} size="micro" />
            {item.label}
          </li>
        ))}
      </ul>
    </div>
  );
}
