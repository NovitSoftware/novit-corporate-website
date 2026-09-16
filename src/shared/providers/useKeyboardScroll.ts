/* Keyboard scrolling, which the browser can no longer offer: arrows, page keys, space, Home and End. */

import { useEffect } from "react";
import type Lenis from "lenis";
import { easeOutExpo } from "@/shared/lib/motion";

/** One arrow-key press, in pixels. Matches a browser's own line step. */
const ARROW_STEP = 110;
/** Page keys and space move just under a screen, so context is kept. */
const PAGE_FRACTION = 0.9;

/**
 * Arrows, Page keys, space, Home and End. The browser hands these to the
 * document, which is pinned, so without this the shell would be reachable by
 * wheel and touch only — the scroll equivalent of a keyboard trap.
 *
 * Anything the key already means something to keeps it: typing in a field,
 * space on a control, and any inner scroller marked `data-lenis-prevent`.
 */
export function useKeyboardScroll(lenis: Lenis | undefined, reduced: boolean) {
  useEffect(() => {
    if (!lenis) {
      return;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (
        event.defaultPrevented ||
        event.metaKey ||
        event.ctrlKey ||
        event.altKey
      ) {
        return;
      }

      const target = event.target;
      if (target instanceof Element && ownsTheKey(target, event.key)) {
        return;
      }

      const options = {
        duration: reduced ? 0 : 0.7,
        immediate: reduced,
        easing: easeOutExpo,
      };

      if (event.key === "Home" || event.key === "End") {
        event.preventDefault();
        lenis.scrollTo(event.key === "Home" ? 0 : lenis.limit, options);
        return;
      }

      const delta = keyDelta(event, lenis.rootElement.clientHeight);
      if (delta !== 0) {
        event.preventDefault();
        lenis.scrollTo(lenis.scroll + delta, options);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [lenis, reduced]);
}

const TYPING =
  "input, textarea, select, [contenteditable]:not([contenteditable=false])";
const ACTIVATABLE = "a[href], button, summary, [role=button]";

function ownsTheKey(target: Element, key: string): boolean {
  if (target.closest(TYPING) || target.closest("[data-lenis-prevent]")) {
    return true;
  }
  // Space activates whatever is focused; the arrows and page keys do not.
  return key === " " && target.closest(ACTIVATABLE) !== null;
}

function keyDelta(event: KeyboardEvent, viewport: number): number {
  const page = viewport * PAGE_FRACTION;

  switch (event.key) {
    case "ArrowDown":
      return ARROW_STEP;
    case "ArrowUp":
      return -ARROW_STEP;
    case "PageDown":
      return page;
    case "PageUp":
      return -page;
    case " ":
      return event.shiftKey ? -page : page;
    default:
      return 0;
  }
}
