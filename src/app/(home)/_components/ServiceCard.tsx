import type { Service } from "@/content/home";
import { Card, CardText } from "@/components/cards/Card";
import { CardList } from "@/components/cards/CardList";
import { IconLine } from "@/components/ui/Icon";

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
      label={service.label}
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
  layers: { top: string; base: readonly string[] };
}) {
  return (
    <div className="mt-6">
      <span className="eyebrow card-ink-voice inline-flex items-center gap-2">
        <IconLine name="agent" size="micro" />
        {layers.top}
      </span>
      {/* The separator trails its item rather than leading the next one: on a
          wrap a trailing middot reads as "continues below", a leading one as a
          stray mark in the margin. */}
      <ul className="card-divide mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 pt-3">
        {layers.base.map((item, index) => (
          <li
            key={item}
            className="eyebrow card-ink-body flex items-center gap-4"
          >
            {item}
            {index < layers.base.length - 1 ? (
              <span aria-hidden="true" className="opacity-40">
                ·
              </span>
            ) : null}
          </li>
        ))}
      </ul>
    </div>
  );
}
