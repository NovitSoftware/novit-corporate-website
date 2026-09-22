/* In-page navigation, once the document itself stopped scrolling: deep links on arrival, and anchor clicks. */

import { useEffect, useRef } from "react";
import type Lenis from "lenis";
import { easeOutExpo } from "@/lib/motion";

/**
 * A link into the middle of the page — someone else's `#seguridad`, or a
 * reload on one — lands on the document, which no longer moves. The jump is
 * ours to make, once, on arrival.
 */
export function useInitialHash(lenis: Lenis | undefined) {
  const jumped = useRef(false);

  useEffect(() => {
    const hash = window.location.hash;
    if (!lenis || jumped.current || hash.length < 2) {
      return;
    }

    const section = document.getElementById(decodeURIComponent(hash.slice(1)));
    if (!section) {
      return;
    }

    jumped.current = true;

    // After layout, and `force` because the intro holds the scroll while it
    // plays — the visitor should be at the section when the curtain lifts.
    requestAnimationFrame(() => {
      lenis.resize();
      lenis.scrollTo(section, { immediate: true, force: true });
    });
  }, [lenis]);
}

/**
 * Takes over in-page links so they glide to their section, update the address
 * bar, and still hand focus to the destination the way a native jump would.
 *
 * Where they stop is the section’s own `scroll-mt-anchor`, which Lenis reads
 * off the target — the same value a browser would use for a plain anchor jump
 * with no scripts running.
 */
export function useAnchorNavigation(lenis: Lenis | undefined, reduced: boolean) {
  useEffect(() => {
    if (!lenis) {
      return;
    }

    const onClick = (event: MouseEvent) => {
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      ) {
        return;
      }

      const target = event.target;
      if (!(target instanceof Element)) {
        return;
      }

      const link = target.closest<HTMLAnchorElement>('a[href^="#"]');
      const hash = link?.getAttribute("href");
      if (!link || !hash || hash === "#") {
        return;
      }

      const section = document.getElementById(
        decodeURIComponent(hash.slice(1)),
      );
      if (!section) {
        return;
      }

      event.preventDefault();
      window.history.pushState(null, "", hash);

      /**
       * Two frames before moving, and `force` on the tween. Both are here
       * because a click can land in the same frame as a React state change
       * that holds or re-lays-out the scroller — the intro releasing, a
       * section mounting — and Lenis reads its limits once per tween.
       */
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          lenis.resize();
          lenis.scrollTo(section, {
            duration: reduced ? 0 : 1.2,
            immediate: reduced,
            easing: easeOutExpo,
            force: true,
            onComplete: () => handOverFocus(section),
          });
        });
      });
    };

    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, [lenis, reduced]);
}

function handOverFocus(section: HTMLElement) {
  if (!section.hasAttribute("tabindex")) {
    section.setAttribute("tabindex", "-1");
  }
  section.focus({ preventScroll: true });
}
