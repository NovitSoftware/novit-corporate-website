import { Icon, type IconName } from "@/components/ui/Icon";
import { cn } from "@/lib/cn";
import { variantClass } from "@/lib/variants";

/**
 * Cyan is the world, violet is Novit speaking — the same rule `PillarCard` and
 * `ReadingPanel` apply to an edge, applied to a tint.
 *
 * The glyph is azul, never cyan, and that is a contrast decision rather than a
 * stylistic one. `novit-design-system.md` cap. 01 measures cyan `#3398DC` at
 * 2.9:1 on the surface grey, and a graphical object needs 3:1 — so cyan does
 * the tint, where contrast carries no meaning, and azul (14.1:1) draws the
 * icon. On dark grounds the halo inverts to white-on-white-tint, where celeste
 * would be the failure case instead.
 */
const badgeTone = {
  cyan: "bg-cyan/12 text-azul",
  voice: "bg-violeta-medio/10 text-violeta-medio",
  dark: "bg-blanco/10 text-blanco",
} as const;

export type IconBadgeTone = keyof typeof badgeTone;

type IconBadgeProps = {
  name: IconName;
  tone?: IconBadgeTone;
  className?: string;
};

/**
 * An icon on its own tinted plate — the visual anchor at the top of a card.
 *
 * Every card on this site used to open with a text label, which is why a grid
 * of them read as one undifferentiated wall: at a glance nothing told the
 * risk card apart from the infrastructure card, so the reader had to start
 * reading to find out which was which. The badge is what gives each card
 * something to be recognised by before a word of it is read.
 *
 * It is one component rather than a span repeated in six card files because
 * the size, the radius, the tint and the glyph colour are one decision each.
 */
export function IconBadge({ name, tone = "cyan", className }: IconBadgeProps) {
  return (
    <span
      className={cn(
        "grid size-10 shrink-0 place-items-center rounded-card",
        variantClass(badgeTone, tone),
        className,
      )}
    >
      <Icon name={name} className="size-5" />
    </span>
  );
}
