import type { ReactNode } from "react";
import type { IconName } from "@/components/ui/Icon";
import { IconBadge } from "@/components/ui/IconBadge";
import { cn } from "@/lib/cn";
import { variantClass } from "@/lib/variants";

/**
 * Celeste is the world — the market, the fact, what happened — and violet is
 * Novit speaking. That is the site's one colour rule and it is the only thing
 * a card gets to choose.
 */
const accentClass = {
  celeste: "card-celeste",
  voice: "card-voice",
} as const;

/**
 * The ink that goes with each accent — the title, the eyebrow, the takeaway,
 * and anything a caller draws in the body.
 *
 * Not the accent itself, and that is a contrast decision rather than a
 * stylistic one: on the card surface celeste measures 2.3:1 and cyan 2.9:1,
 * under AA for text and under the 3:1 a graphical object needs. So the accent
 * paints the rules, where contrast carries no meaning, and its readable
 * partner carries everything that has to be read — azul at 14.1:1 on the
 * celeste card, violet at 12.1:1 on the voice card.
 */
export const cardInk = {
  celeste: "text-azul",
  voice: "text-violeta-medio",
} as const;

/* The footer rule, as a gradient fading to nothing on the right — the same
   left-to-right gesture as every other rule on the site. */
const ruleTone = {
  celeste: "bg-[linear-gradient(90deg,var(--celeste),transparent)]",
  voice: "bg-[linear-gradient(90deg,var(--violeta-medio),transparent)]",
} as const;

const titleSize = {
  base: "text-lg leading-snug sm:text-xl",
  lg: "text-xl leading-snug sm:text-[1.375rem]",
  xl: "text-2xl leading-tight sm:text-[1.875rem]",
} as const;

export type CardAccent = keyof typeof accentClass;

type CardProps = {
  /** The heading. The point of the card, never the category it belongs to. */
  title: string;
  /**
   * The small uppercase eyebrow beside the mark: the area, the step number,
   * the category. It files the card; the title is what the card says.
   */
  label?: string;
  /** The mark. Optional, but every card in a given grid should agree. */
  icon?: IconName;
  /**
   * A picture at the very top, above everything: a client's logo, an
   * illustration. Whatever it is, it is a credential or an image — never the
   * card's argument — so a hairline always follows it.
   */
  media?: ReactNode;
  accent?: CardAccent;
  size?: keyof typeof titleSize;
  /**
   * The one line the card wants remembered, pinned to its foot behind a rule.
   * `rule` narrows or widens that rule, for the one band where the widths are
   * themselves the argument (`ServicesEvolution`).
   */
  footer?: { label?: string; text: string; rule?: string };
  className?: string;
  /** The body: a paragraph, a list, whatever this card is made of. */
  children?: ReactNode;
};

/**
 * Every card on the site.
 *
 * ## Why there is only one
 *
 * There were eight, and they were eight because each band wrote its own: the
 * highlights, the services, the cases, the four decisions, the four evolution
 * steps, the three offer lines, the three marking criteria, the security
 * pillars. No two agreed. Some put the eyebrow above the title and some below
 * it; some drew a rule across the head of the card, some down its left edge
 * and some nowhere; one had a hairline under its logo and the rest had no
 * hairline at all; two ended on a rule and a takeaway line and six just
 * stopped. Read down a page they looked like cards borrowed from four
 * different sites, which is exactly what a reader said.
 *
 * So the composition is fixed here and callers choose only what goes in it:
 *
 *     ━━━━━━━━━━━━━━  the accent rule, across the head
 *     [ media ]       a logo or an illustration, if the card has one
 *     ──────────────  hairline
 *     [▣]  LABEL      the mark and the eyebrow, on one line
 *     Title
 *     Body…
 *     ──────────────  the footer rule
 *     LABEL
 *     The takeaway
 *
 * Every rule in there earns its place: the head rule says which voice is
 * speaking and lines the row up across cards of unequal height, the hairline
 * separates what the card *is* from what it *claims*, and the footer rule sets
 * the one sentence worth keeping apart from the paragraph explaining it. A
 * card with no media has no hairline, and a card with nothing to leave behind
 * has no footer — the parts appear when there is something for them to do, and
 * never in a different order.
 *
 * ## What a caller may still change
 *
 * The accent, the title size, and the body. Nothing else, on purpose: padding,
 * the eyebrow's position, the rule weights and the hairline are decisions made
 * once. `className` is for the grid — height, span, the occasional two-column
 * body — not for restyling the card.
 */
export function Card({
  title,
  label,
  icon,
  media,
  accent = "celeste",
  size = "lg",
  footer,
  className,
  children,
}: CardProps) {
  /* Booleans, not the values: `media` is a ReactNode, and `node && "mt-5"`
     hands `cn` whatever falsy thing the node happened to be — `0` for an
     empty list, which is not a class name. */
  const hasMedia = Boolean(media);
  const hasHead = Boolean(icon) || Boolean(label);

  return (
    <article
      data-tone="light"
      className={cn(
        "card card-head h-full p-6 sm:p-7",
        variantClass(accentClass, accent),
        className,
      )}
    >
      {hasMedia ? (
        <>
          {media}
          <span
            aria-hidden="true"
            className="mt-5 block h-px w-full bg-gris-borde"
          />
        </>
      ) : null}

      {hasHead ? (
        <div className={cn("flex items-center gap-3", hasMedia && "mt-5")}>
          {icon ? (
            <IconBadge name={icon} tone={accent === "voice" ? "voice" : "cyan"} />
          ) : null}
          {label ? (
            <span
              className={cn(
                "text-[0.6875rem] font-bold uppercase tracking-[0.16em]",
                variantClass(cardInk, accent),
              )}
            >
              {label}
            </span>
          ) : null}
        </div>
      ) : null}

      <h3
        className={cn(
          "font-bold",
          (hasHead || hasMedia) && "mt-5",
          variantClass(titleSize, size),
          variantClass(cardInk, accent),
        )}
      >
        {title}
      </h3>

      {children ? <div className="mt-3">{children}</div> : null}

      {footer ? (
        <div className="mt-auto pt-6">
          <div
            aria-hidden="true"
            className={cn(
              "h-px",
              variantClass(ruleTone, accent),
              footer.rule ?? "w-full",
            )}
          />
          {footer.label ? (
            <span
              className={cn(
                "mt-4 block text-[0.6875rem] font-bold uppercase tracking-[0.16em]",
                variantClass(cardInk, accent),
              )}
            >
              {footer.label}
            </span>
          ) : null}
          {/* Two lines of room whether the line needs them or not. `mt-auto`
              above pins the block to the foot of the card, so a one-line
              takeaway beside a two-line one pushes its own rule 20px higher —
              which reads as four rules that missed each other, and on
              `ServicesEvolution` the rules are the argument. `lh` rather than a
              pixel guess, so it stays right if the size or leading changes;
              browsers without it fall back to the old ragged behaviour rather
              than to anything broken. */}
          <p
            className={cn(
              "min-h-[2lh] text-base font-bold leading-snug",
              footer.label ? "mt-1.5" : "mt-4",
              variantClass(cardInk, accent),
            )}
          >
            {footer.text}
          </p>
        </div>
      ) : null}
    </article>
  );
}

/**
 * The body most cards have: one paragraph, at the size and leading the card
 * grid is built around.
 *
 * Six bands were writing the same three utility classes, and two of them had
 * drifted — `leading-7` against `leading-relaxed`, which is a 1px difference
 * nobody chose and nobody can unsee once the cards are side by side.
 */
export function CardText({ children }: { children: ReactNode }) {
  return (
    <p className="text-[0.9375rem] leading-relaxed text-texto">{children}</p>
  );
}
