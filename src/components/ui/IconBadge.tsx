import { Icon, type IconName } from "@/components/ui/Icon";
import { cn } from "@/lib/cn";

type IconBadgeProps = {
  name: IconName;
  className?: string;
};

/**
 * An icon on a tinted plate — the mark at the top of a card.
 *
 * Every card on this site used to open with a text label, which is why a grid
 * of them read as one undifferentiated wall: at a glance nothing told the risk
 * card apart from the infrastructure card, so the reader had to start reading
 * to find out which was which. The badge is what gives each card something to
 * be recognised by before a word of it is read.
 *
 * ## Cyan plate, azul glyph
 *
 * Cyan `#3398DC` is the accent `novit-design-system.md` cap. 01 assigns to
 * light grounds, and this plate only ever sits on one. The glyph inside is
 * azul, and that is a contrast decision rather than a stylistic one: the same
 * chapter measures cyan at 2,9:1 on the surface grey where a graphical object
 * needs 3:1, so cyan does the tint — where contrast carries no meaning — and
 * azul (14,1:1) draws the icon.
 *
 * 12% is as far as the tint goes: the plate has to read as an object sitting
 * on the card, and the card's surface is the only ground it sits on.
 *
 * ## One treatment, no `tone` prop
 *
 * There were three: `cyan`, `voice` and a `dark` that never had a consumer.
 * `voice` existed for the violet card, and there is no violet card any more —
 * violet marks Novit's comment in the footer, not the whole object. See
 * `Card`. One plate, one tint, nothing to choose.
 */
export function IconBadge({ name, className }: IconBadgeProps) {
  return (
    <span
      className={cn(
        "grid size-10 shrink-0 place-items-center rounded-card bg-cyan/12 text-azul",
        className,
      )}
    >
      <Icon name={name} size="badge" />
    </span>
  );
}
