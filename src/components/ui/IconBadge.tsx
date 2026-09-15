import { Icon, type IconName } from "@/components/ui/Icon";
import { cn } from "@/lib/cn";

type IconBadgeProps = {
  name: IconName;
  className?: string;
};

/**
 * An icon on a tinted plate — the mark at the top of a card.
 *
 * It gives each card something to be recognised by before a word of it is read.
 * A grid of cards opening on text labels alone reads as an undifferentiated
 * wall: nothing tells one from another at a glance, so the reader has to start
 * reading to find out which is which.
 *
 * ## A thinner pane on the pane
 *
 * The plate is the same material as the card — a white film at 7% behind a 12%
 * edge — so it reads as a chip of the same glass sitting on it rather than as a
 * colour field. A solid accent plate would be invisible on glass.
 *
 * The glyph takes `--card-ink`, the title's ink rather than the label's: the
 * mark and the heading it stands beside are one object, so they move together
 * and neither is named at this call site.
 *
 * One treatment and no `tone` prop. There is nothing here for a caller to
 * choose.
 */
export function IconBadge({ name, className }: IconBadgeProps) {
  return (
    <span
      className={cn(
        "card-ink grid size-10 shrink-0 place-items-center rounded-card border border-blanco/12 bg-blanco/[0.07]",
        className,
      )}
    >
      <Icon name={name} size="badge" />
    </span>
  );
}
