import type { ReactNode, SVGProps } from "react";
import { cn } from "@/lib/cn";

/**
 * The icon set.
 *
 * ## Why these are drawn here and not loaded
 *
 * Material Symbols is the obvious source and it ships as an icon font. This
 * project cannot use it that way: `novit-design-system.md` cap. 02 documents
 * exactly how that fails here — Google Fonts served Lato without the `→`
 * glyph, the browser substituted Arial, and the piece went out wrong for
 * months because **a missing glyph does not raise an error, it substitutes**.
 * An icon font has that failure mode for every glyph in it, and the document's
 * own conclusion was to draw the arrow as SVG instead. This is the same
 * conclusion applied to the rest of the set.
 *
 * So these are inline SVG on a 24-unit grid, round caps and joins — the
 * Material Symbols Outlined idiom, drawn rather than copied. The stroke is not
 * a constant: see `iconSize` below, which pairs each size with the width that
 * holds apparent weight even across the set. One flat `currentColor`, which is
 * the convention `ContactIcons` already established: an icon inherits the
 * colour of the text it labels, so it works on the gradient, on a light plate
 * and inside a chip without a variant each.
 *
 * ## Why one registry
 *
 * A component per icon means a card has to import and thread a component
 * through every layer between the content and the render. With a registry the
 * content layer names an icon as a string — `icon: "shield"` sits in
 * `site.ts` next to the words it belongs to — and the card takes a name.
 * Adding an icon is one entry here and one string there.
 */
const ICONS = {
  /** A flag on a route. Strategy, the decision about where to go. */
  strategy: (
    <>
      <path d="M6 21V4" />
      <path d="M6 5h11l-2 4 2 4H6" />
    </>
  ),
  /** Stacked planes. Shared infrastructure everything else stands on. */
  layers: (
    <>
      <path d="m12 2 9 5-9 5-9-5 9-5Z" />
      <path d="m3 12 9 5 9-5" />
      <path d="m3 17 9 5 9-5" />
    </>
  ),
  /** A bot. An agent in production. */
  agent: (
    <>
      <rect x="4" y="8" width="16" height="12" rx="3" />
      <path d="M12 8V4.5" />
      <circle cx="12" cy="3" r="1.2" />
      <circle cx="9.5" cy="13.5" r="1" />
      <circle cx="14.5" cy="13.5" r="1" />
    </>
  ),
  /** Security and governance. */
  shield: <path d="M12 3l7 3v5c0 4.5-3 8-7 10-4-2-7-5.5-7-10V6l7-3Z" />,
  /** Bars. Measurement, KPI, what got better. */
  metric: (
    <>
      <path d="M3 20h18" />
      <path d="M6.5 20v-5.5" />
      <path d="M12 20V7" />
      <path d="M17.5 20v-9" />
    </>
  ),
  /** A database. Indexed corporate knowledge. */
  database: (
    <>
      <ellipse cx="12" cy="6" rx="7" ry="3" />
      <path d="M5 6v6c0 1.66 3.13 3 7 3s7-1.34 7-3V6" />
      <path d="M5 12v6c0 1.66 3.13 3 7 3s7-1.34 7-3v-6" />
    </>
  ),
  /** A checked clipboard. What to require of a third party. */
  clipboardCheck: (
    <>
      <rect x="5" y="4" width="14" height="17" rx="2" />
      <path d="M9.5 4V2.8h5V4" />
      <path d="m9.5 12.5 2.3 2.3 4.2-4.2" />
    </>
  ),
  /** Discovery: understanding the process before writing code. */
  search: (
    <>
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-4.6-4.6" />
    </>
  ),
  /** A document. Comex paperwork, invoices, certificates. */
  document: (
    <>
      <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8l-5-5Z" />
      <path d="M14 3v5h5" />
    </>
  ),
  /** A conversation handled by an assistant. */
  chat: (
    <path d="M20 11.5a7.5 7.5 0 0 1-7.5 7.5H9l-4 3v-4.4A7.5 7.5 0 0 1 12.5 4 7.5 7.5 0 0 1 20 11.5Z" />
  ),
  /** Custom software. */
  code: (
    <>
      <path d="m8 7-5 5 5 5" />
      <path d="m16 7 5 5-5 5" />
      <path d="m13.5 4.5-3 15" />
    </>
  ),
  /** People. Células ágiles, the team, the cohort. */
  team: (
    <>
      <circle cx="9" cy="8" r="3.5" />
      <path d="M2.5 20a6.5 6.5 0 0 1 13 0" />
      <path d="M16 5.2a3.5 3.5 0 0 1 0 5.6" />
      <path d="M17.6 14.3A6.5 6.5 0 0 1 21.5 20" />
    </>
  ),
  /** Something met, approved, delivered. */
  check: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="m8 12.5 2.7 2.7 5.3-5.4" />
    </>
  ),
  /** Dates: a cohort, an edition. */
  calendar: (
    <>
      <rect x="3.5" y="5" width="17" height="16" rx="2" />
      <path d="M8 3v4" />
      <path d="M16 3v4" />
      <path d="M3.5 10.5h17" />
    </>
  ),
  /** Hours: course load, time to answer. */
  clock: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5.4l3.6 2.1" />
    </>
  ),
  /** A mortarboard. The Academia. */
  academy: (
    <>
      <path d="m2.5 8.5 9.5-4.5 9.5 4.5-9.5 4.5-9.5-4.5Z" />
      <path d="M6.5 10.6V16c0 1.7 2.5 3 5.5 3s5.5-1.3 5.5-3v-5.4" />
    </>
  ),
  /** A link. The integration layer, one way in to the core systems. */
  link: (
    <>
      <path d="M10.2 13.8a4 4 0 0 1 0-5.7l2.5-2.5a4 4 0 0 1 5.7 5.7l-1.2 1.2" />
      <path d="M13.8 10.2a4 4 0 0 1 0 5.7l-2.5 2.5a4 4 0 0 1-5.7-5.7l1.2-1.2" />
    </>
  ),
  /** A key. Identity, SSO, permissions per user. */
  key: (
    <>
      <circle cx="8" cy="16" r="4" />
      <path d="m10.9 13.1 6.1-6.1" />
      <path d="m14.6 9.4 2 2" />
      <path d="m17 7 2.5 2.5" />
    </>
  ),
  /** A spark. Models: reasoning, embeddings, OCR. */
  spark: (
    <path d="M12 3l1.9 5.6L19.5 10l-5.6 1.9L12 17.5l-1.9-5.6L4.5 10l5.6-1.4L12 3Z" />
  ),
  /** The risk band: what is left when every vendor has gone. */
  alert: (
    <>
      <path d="M12 4 2.8 20h18.4L12 4Z" />
      <path d="M12 10.5v4" />
      <path d="M12 17.3h.01" />
    </>
  ),
  /** A padlock. Processing inside the client's private network. */
  lock: (
    <>
      <rect x="4.5" y="10.5" width="15" height="10.5" rx="2" />
      <path d="M8 10.5V8a4 4 0 0 1 8 0v2.5" />
    </>
  ),
  /** A target. The first case, with an owner and a metric. */
  target: (
    <>
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="4.6" />
      <circle cx="12" cy="12" r="1.1" />
    </>
  ),
  /** A globe. Active projects across five countries. */
  globe: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18" />
      <path d="M12 3c2.4 2.5 3.7 5.6 3.7 9s-1.3 6.5-3.7 9c-2.4-2.5-3.7-5.6-3.7-9S9.6 5.5 12 3Z" />
    </>
  ),
  /** An eye. Observability: the decision logged, not just the answer. */
  eye: (
    <>
      <path d="M2.5 12S6 6 12 6s9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z" />
      <circle cx="12" cy="12" r="3" />
    </>
  ),
  /** A coin. Cost per resolution, the fee that never stops. */
  coin: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M14.8 9.3a3 3 0 0 0-2.8-1.5c-1.7 0-3 .9-3 2.1 0 1.3 1.2 1.8 3 2.2s3 .9 3 2.2c0 1.2-1.3 2.1-3 2.1a3 3 0 0 1-2.8-1.5" />
      <path d="M12 6v12" />
    </>
  ),
} as const satisfies Record<string, ReactNode>;

export type IconName = keyof typeof ICONS;

/**
 * Four sizes, each paired with the text size it labels — and each carrying the
 * `strokeWidth` that keeps its *apparent* weight identical to the others.
 *
 * ## Why the stroke changes with the size
 *
 * `strokeWidth` is in viewBox units, and the viewBox is a fixed 24, so the
 * stroke scales with the box: one hardcoded `1.75` rendered at 1.02px inside a
 * 14px icon and 1.46px inside a 20px one. That is a 43% spread in weight
 * between two icons a reader sees in the same scroll, which is why the set
 * never looked like a set. Worse, not one of those values landed on a whole
 * pixel, so every icon on the site was a blurred sub-pixel line at 1×.
 *
 * Apparent stroke in CSS pixels is `strokeWidth × size / 24`. Solving that for
 * a constant 1.25px at each size gives the table below. 1.25 rather than 1 or
 * 1.5 because it sits right against Lato's bold stems at these sizes; 18px is
 * off Tailwind's scale but it is declared once, here, instead of being written
 * as an arbitrary value at call sites.
 */
const iconSize = {
  /** 14px, beside a 10px uppercase micro-label. `StatRow`. */
  micro: { className: "size-3.5", strokeWidth: 2.143 },
  /** 16px, beside body copy. Checklists, list items. */
  inline: { className: "size-4", strokeWidth: 1.875 },
  /** 18px, beside a card or row title. */
  heading: { className: "size-[1.125rem]", strokeWidth: 1.667 },
  /** 20px, inside `IconBadge`'s 40px plate. */
  badge: { className: "size-5", strokeWidth: 1.5 },
} as const;

export type IconSize = keyof typeof iconSize;

type IconProps = Omit<SVGProps<SVGSVGElement>, "children"> & {
  name: IconName;
  size?: IconSize;
};

/**
 * Coloured by the text around it, sized by its job. Always `aria-hidden`:
 * every icon on this site labels a heading that is already beside it, so
 * announcing it would read the same thing twice.
 *
 * `className` is for colour and position. The size comes from `size`, so that
 * a call site cannot pick a width without also picking the stroke that goes
 * with it — which is exactly how the set drifted to four weights.
 */
export function Icon({ name, size = "inline", className, ...props }: IconProps) {
  const { className: sizeClass, strokeWidth } = iconSize[size];

  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      className={cn("shrink-0", sizeClass, className)}
      {...props}
    >
      {ICONS[name]}
    </svg>
  );
}

/**
 * An icon that sits beside text, centred on the text's **first line**.
 *
 * ## Why this exists
 *
 * Three call sites used to correct this by hand, with three different
 * mechanisms — `mt-1`, `mt-0.5` and `translate-y-0.5` — against three
 * different parent alignments (`items-start`, `items-start`,
 * `items-baseline`). Every one of those numbers was fitted to one type size
 * and one leading, so any change to either broke all three silently and
 * independently. Two of them already disagreed by 2px for no reason anyone
 * could state.
 *
 * The fix is to stop guessing. `h-[1lh]` is *the adjacent text's own line
 * height*, so an icon centred in that box is centred on the first line by
 * construction, at any size, any leading, forever. `items-center` would centre
 * it on the whole paragraph — fine for one line, wrong for two. `items-baseline`
 * aligns a replaced element by its bottom margin edge, which is why it needed
 * a correction on top of a correction.
 *
 * Use it inside `flex items-start gap-2.5`. Where the text is guaranteed to be
 * one line a bare `<Icon>` in an `items-center` row is equivalent — but it
 * stops being equivalent the moment the text wraps, so prefer this.
 */
export function IconLine({
  name,
  size = "heading",
  className,
}: {
  name: IconName;
  size?: IconSize;
  className?: string;
}) {
  return (
    <span className={cn("flex h-[1lh] shrink-0 items-center", className)}>
      <Icon name={name} size={size} />
    </span>
  );
}
