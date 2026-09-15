import { cardCopy } from "@/components/cards/Card";
import { IconLine } from "@/components/ui/Icon";
import { cn } from "@/lib/cn";

/**
 * What stands at the head of each row, and the gap it takes.
 *
 * `check` is a 16px tick — what is included, what the line covers. `rule` is a
 * 2px dash in the voice ink, for a list nobody ticks off: a tick beside one of
 * the Academia's conditions implies the reader has met it.
 *
 * The gap is part of the marker and not one value for both: the dash is 16px
 * of solid ink where the tick is a 16px box of mostly air, so at the tick's
 * 10px the dash crowds the text it marks.
 */
const marker = {
  check: {
    gap: "gap-2.5",
    glyph: <IconLine name="check" size="inline" className="card-ink-label" />,
  },
  rule: {
    gap: "gap-4",
    glyph: (
      <span aria-hidden="true" className="flex h-[1lh] shrink-0 items-center">
        <span className="block h-0.5 w-4 bg-voz-suave" />
      </span>
    ),
  },
} as const;

type CardListProps = {
  items: readonly string[];
  kind?: keyof typeof marker;
  /**
   * A hairline between rows, and the room on either side of it that a rule
   * needs to read as a division rather than as a strikethrough. For rows that
   * each say something on their own; a list of things covered by one sentence
   * above it stays undivided and tight.
   */
  divided?: boolean;
  /**
   * Reveal the rows one at a time on scroll.
   *
   * Off by default, and that is the point: a list inside a `Card` is already
   * inside something that reveals — `CardGrid` batches the cards themselves —
   * and `Scene` gives every `[data-anim]` its own trigger under the nearest
   * batch, so a list that tagged its own rows would animate them separately
   * from the card they sit in. Only a list that is the whole of its own panel
   * asks for this.
   */
  reveal?: boolean;
  /** The list's place in the layout around it — margins, a column span. */
  className?: string;
};

/**
 * A list inside a card or a reading panel: a marked row, one line or three,
 * at the body size.
 *
 * ## Why this exists
 *
 * Two bands wrote this shape and the two disagreed about all of it — the
 * marker, the gap, the row rhythm, and whether the text was a `<span>` at
 * 15px `leading-relaxed` or the same thing spelled out again. They are the
 * same object: `ServicesCapabilities` lists what is inside a service line,
 * `AcademyAudience` lists what the course takes for granted.
 *
 * The split is the one `PanelRow` already draws: this owns the marker, the row
 * typography and the rhythm between rows; the caller owns where the list sits
 * and how wide it runs, because that is the part that genuinely differs — the
 * featured service line runs its list beside its description in two columns,
 * and the Academia's runs the full width of a panel.
 */
export function CardList({
  items,
  kind = "check",
  divided = false,
  reveal = false,
  className,
}: CardListProps) {
  const { gap, glyph } = marker[kind];

  return (
    <ul
      data-anim-batch={reveal ? "" : undefined}
      className={cn("grid", divided ? "gap-px" : "gap-2.5", className)}
    >
      {items.map((item) => (
        <li
          key={item}
          data-anim={reveal ? "rise" : undefined}
          className={cn(
            "flex items-start",
            gap,
            cardCopy,
            /* A shared hairline between rows rather than a border on each:
               four bordered rows read as four fields in a form. */
            divided && "card-divide py-4 first:border-t-0 first:pt-0",
          )}
        >
          {glyph}
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}
