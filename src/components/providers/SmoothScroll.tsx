"use client";

import { useEffect, type ReactNode } from "react";
import { ReactLenis, useLenis } from "lenis/react";
import type Lenis from "lenis";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { useKeyboardScroll } from "@/hooks/useKeyboardScroll";
import { useSceneGradient } from "@/hooks/useSceneGradient";
import {
  useAnchorNavigation,
  useInitialHash,
} from "@/hooks/useScrollNavigation";

const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

type SmoothScrollProps = {
  children: ReactNode;
};

/**
 * Owns scrolling for the whole site.
 *
 * The document itself is pinned to the viewport: everything lives inside one
 * scroll container that Lenis drives, the way the reference does it. Scroll
 * position becomes a value the site owns — the header rail reads it, every
 * ScrollTrigger measures against it, and nothing is left to the browser's own
 * scroll animation.
 *
 * The container is still genuinely scrollable, so the wheel, touch,
 * find-in-page and a visitor with no JavaScript all keep working; only the
 * scrollbar is gone. Keyboard keys are handled in `ScrollBridge`, because a
 * browser only offers those to the document, and the document no longer
 * scrolls.
 */
export function SmoothScroll({ children }: SmoothScrollProps) {
  const reduced = usePrefersReducedMotion();

  /**
   * The resting states in `globals.css` are keyed off `data-motion`, which a
   * pre-paint script sets. If the visitor turns reduced motion on mid-session
   * that flag has to go, or anything not yet revealed stays hidden.
   */
  useEffect(() => {
    const media = window.matchMedia(REDUCED_MOTION_QUERY);

    const sync = () => {
      if (media.matches) {
        delete document.documentElement.dataset.motion;
      }
    };

    sync();
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, []);

  return (
    <ReactLenis
      className="scroll-shell"
      /* A scrollable region has to be reachable by keyboard. With scripts the
         keys in `ScrollBridge` do it; this is what carries the visitor
         without them. */
      tabIndex={0}
      options={{
        autoRaf: false,
        lerp: 0.12,
        wheelMultiplier: 1,
        touchMultiplier: 1.4,
        smoothWheel: !reduced,
        syncTouch: !reduced,
        // Handled in `ScrollBridge`, so focus and the address bar move with
        // the scroll.
        anchors: false,
      }}
    >
      <ScrollBridge reduced={reduced} />
      {children}
    </ReactLenis>
  );
}

/**
 * Everything that needs the live Lenis instance.
 *
 * It sits inside the provider on purpose: the instance is created in an
 * effect, so a parent holding a ref to it still has nothing on the first
 * commit — which is the frame the whole page is wired up in. Reading it from
 * context means each of these runs the moment it exists, and again if it is
 * ever rebuilt.
 */
function ScrollBridge({ reduced }: { reduced: boolean }) {
  const lenis = useLenis();

  useFrameSync(lenis);
  useSceneGradient(lenis, reduced);
  useInitialHash(lenis);
  useAnchorNavigation(lenis, reduced);
  useKeyboardScroll(lenis, reduced);

  return null;
}

/**
 * One clock for the whole site: GSAP's ticker advances Lenis, and Lenis tells
 * ScrollTrigger to re-read position as it goes. Without that hand-off the two
 * keep their own clocks and every scroll-linked animation trails the page by a
 * frame or two.
 */
function useFrameSync(lenis: Lenis | undefined) {
  useEffect(() => {
    if (!lenis) {
      return;
    }

    const update = () => ScrollTrigger.update();
    const raf = (time: number) => lenis.raf(time * 1000);

    lenis.on("scroll", update);
    gsap.ticker.add(raf);
    // Lenis already interpolates; letting GSAP also compensate for dropped
    // frames makes scrubbed animations jump.
    gsap.ticker.lagSmoothing(0);

    // Triggers created by children measure against the shell, which only
    // exists once this has mounted.
    ScrollTrigger.refresh();
    // Web fonts settle after first paint and can shift trigger positions.
    void document.fonts?.ready.then(() => ScrollTrigger.refresh());

    return () => {
      lenis.off("scroll", update);
      gsap.ticker.remove(raf);
      gsap.ticker.lagSmoothing(500, 33);
    };
  }, [lenis]);
}
