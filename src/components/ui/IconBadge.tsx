import { Icon, type IconName } from "@/components/ui/Icon";
import { cn } from "@/lib/cn";

type IconBadgeProps = {
  name: IconName;
  className?: string;
};

/**
 * An icon on a plate — the mark at the top of a card.
 *
 * It gives each card something to be recognised by before a word of it is read.
 * A grid of cards opening on text labels alone reads as an undifferentiated
 * wall: nothing tells one from another at a glance, so the reader has to start
 * reading to find out which is which.
 *
 * ## The badge's material, not the card's
 *
 * The plate used to be the card's own glass again — a white film at 7% on a
 * 25% white card — and a mark that is the same pane twice is a mark nobody
 * sees. It is `.icon-plate` now, the dark plate and celeste edge `Badge` is
 * made of (`styles/badge.css`), so the pill and the plate read as one family
 * and the celeste glyph has a ground it holds on.
 *
 * One treatment and no `tone` prop. There is nothing here for a caller to
 * choose.
 */
export function IconBadge({ name, className }: IconBadgeProps) {
  return (
    <span className={cn("icon-plate", className)}>
      <Icon name={name} size="badge" />
    </span>
  );
}
