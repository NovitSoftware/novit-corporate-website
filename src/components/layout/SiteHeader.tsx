"use client";

import { useCallback, useRef } from "react";
import { useLenis } from "lenis/react";
import { Container } from "@/components/ui/Container";
import { Logo } from "@/components/ui/Logo";
import {
  RING_LENGTH,
  ScrollTopButton,
} from "@/components/ui/ScrollTopButton";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { easeOutExpo } from "@/lib/motion";

/** Below this the header always shows; there is nothing to get out of the way of. */
const HIDE_AFTER_PX = 340;

/**
 * Two controls over the page, and no ground under them: the logo, and the way
 * back to the top.
 *
 * ## There was a menu here
 *
 * A full-screen curtain with seven destinations, a scroll-spy active state, a
 * focus trap and the contact details repeated inside it. Two of the seven
 * destinations were other routes, and the site no longer links across routes
 * at all — a visitor arrives on one page from novitsoftware.com and that page
 * is the whole thing. What was left would have been five in-page anchors on a
 * page the reader is already scrolling, held behind a modal they have to open
 * to find out that is all it holds.
 *
 * So the button that opened the curtain now does the one thing a long
 * single-page document actually needs from a fixed control: it takes you back
 * to the top. The reading-progress ring it always carried now reads as what it
 * is — how far there is to come back from.
 *
 * `SiteFooter` keeps the in-page index. That is the right place for a list of
 * where you have been: at the end, in the open, with no panel to open first.
 */
export function SiteHeader() {
  const reduced = usePrefersReducedMotion();
  const headerRef = useRef<HTMLElement>(null);
  const progressRef = useRef<SVGCircleElement>(null);

  /**
   * One scroll subscription drives the read-out: how far down the page we are,
   * and whether the visitor is heading down (header steps aside) or back up
   * (header returns). Written straight to the DOM, so scrolling costs no React
   * renders.
   *
   * It used to also decide what colour the two controls were, by measuring
   * every [data-tone] box on the page and inverting logo and menu to azul
   * whenever one passed under them. That is the flicker: the white reading
   * panels are interior cards, so crossing a single band could repaint the
   * header two or three times, and the controls read as malfunctioning rather
   * than adapting. They are white at every scroll position now, and
   * data-scrolled fades in a scrim behind them (see .site-header in
   * globals.css) so white stays legible over a white card without either
   * control changing colour.
   */
  const lenis = useLenis((instance) => {
    const header = headerRef.current;
    if (!header) {
      return;
    }

    const progress = progressRef.current;
    if (progress) {
      const travelled = RING_LENGTH * (instance.progress || 0);
      progress.style.strokeDashoffset = `${RING_LENGTH - travelled}`;
    }

    header.dataset.scrolled = instance.scroll > 12 ? "true" : "false";
    /* The way back only exists once there is something to come back from.
       Same threshold that hides the header, so the control does not appear
       and disappear on two different lines. */
    header.dataset.atTop = instance.scroll > HIDE_AFTER_PX ? "false" : "true";
    header.dataset.hidden =
      instance.direction === 1 && instance.scroll > HIDE_AFTER_PX
        ? "true"
        : "false";
  });

  const toTop = useCallback(() => {
    lenis?.scrollTo(0, {
      duration: reduced ? 0 : 1.1,
      immediate: reduced,
      easing: easeOutExpo,
      force: true,
    });
  }, [lenis, reduced]);

  return (
    <header
      ref={headerRef}
      data-tone="dark"
      data-scrolled="false"
      data-hidden="false"
      data-at-top="true"
      className="site-header group/header pointer-events-none fixed inset-x-0 top-0 z-50"
    >
      {/* No bar, no fill, no rule: the page runs under the two controls, which
          are all there is. Pointer events come back on for those alone, so the
          copy passing underneath stays selectable. */}
      <Container
        data-header-rail
        className="relative z-10 flex h-header items-center justify-between"
      >
        {/* No box around it. The logo used to sit in a bordered, padded pill
            whose edge was blanco/18 — too faint to read as a deliberate frame,
            just visible enough to look like a stray rectangle clipping the
            mark, and worse again when that border inverted to azul over a
            light band. A lockup does not need a card. */}
        <Logo className="pointer-events-auto" />
        <ScrollTopButton progressRef={progressRef} onClick={toTop} />
      </Container>
    </header>
  );
}
