import { cn } from "@/lib/cn";

/** The reading ring around the control: radius and circumference, in px. */
const RING_RADIUS = 21;
export const RING_LENGTH = 2 * Math.PI * RING_RADIUS;

type ScrollTopButtonProps = {
  /** The ring's own circle, written to directly on scroll. */
  progressRef: React.Ref<SVGCircleElement>;
  onClick: () => void;
};

/**
 * The way back to the top: a tracked word that names the action, a round glyph
 * that fills with celeste on hover, and the reading ring drawn on its edge.
 *
 * ## It used to open a menu
 *
 * Same control, same ring, same two-part lockup — the word and the mark. What
 * changed is what it does, and the ring is better for it: on a menu button the
 * progress read as a stray flourish, and on this one it is the measure of the
 * thing the button undoes.
 *
 * With no ground under the header and no scrollbar on the page, that ring is
 * the only reading indicator the site has, so it stays on the one control that
 * is always there.
 *
 * Hidden inside the first screen — `data-at-top` on the header, set from the
 * same scroll subscription that hides the header itself. A "back to top" on
 * top of the page is a control that does nothing, and the arrow appearing as
 * the page moves is how a reader learns it is there.
 */
export function ScrollTopButton({
  progressRef,
  onClick,
}: ScrollTopButtonProps) {
  return (
    <button
      type="button"
      aria-label="Volver arriba"
      onClick={onClick}
      className={cn(
        "group/top pointer-events-auto inline-flex items-center gap-3 text-blanco",
        "transition-[opacity,transform,visibility] duration-500",
        "ease-[var(--ease-out-expo)] focus-visible:outline-offset-4",
        /* `invisible`, not just `opacity-0`: visibility takes it out of the
           tab order too, so nobody tabs into a control they cannot see. A
           transition that lists `visibility` defers the hide to the end of
           the fade, so it still leaves rather than blinks out. */
        "group-data-[at-top=true]/header:invisible",
        "group-data-[at-top=true]/header:translate-y-1",
        "group-data-[at-top=true]/header:opacity-0",
      )}
    >
      {/* Decorative: the button is named above, so this is not announced
          twice. */}
      <span
        aria-hidden="true"
        /* The micro-label, tracked a step wider than the rest: five letters
           standing alone over a 44px circle read as a word, not a label,
           unless the spacing says otherwise. */
        className="eyebrow leading-4 tracking-[0.2em]"
      >
        Subir
      </span>
      <span
        aria-hidden="true"
        className={cn(
          "relative inline-flex size-11 items-center justify-center rounded-full border",
          "border-blanco/30 transition-[border-color,color] duration-500 ease-[var(--ease-out-expo)]",
          "group-hover/top:border-celeste group-hover/top:text-celeste",
        )}
      >
        <span
          className={cn(
            "absolute inset-0 scale-0 rounded-full bg-celeste/15",
            "transition-transform duration-500 ease-[var(--ease-out-expo)]",
            "group-hover/top:scale-100 group-focus-visible/top:scale-100",
          )}
        />
        {/* Reading position, drawn on the button's own edge. */}
        <svg
          viewBox="0 0 44 44"
          className="absolute inset-0 -rotate-90 text-celeste"
          focusable="false"
        >
          <circle
            ref={progressRef}
            cx="22"
            cy="22"
            r={RING_RADIUS}
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeDasharray={RING_LENGTH}
            strokeDashoffset={RING_LENGTH}
          />
        </svg>
        {/* The arrow lifts on hover, which is the gesture the button
            performs. */}
        <svg
          viewBox="0 0 24 24"
          aria-hidden="true"
          className={cn(
            "size-5 transition-transform duration-500 ease-[var(--ease-out-expo)]",
            "group-hover/top:-translate-y-0.5",
          )}
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 19V5M5 12l7-7 7 7" />
        </svg>
      </span>
    </button>
  );
}
