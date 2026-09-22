"use client";

import { gsap, scroller, useGSAP } from "@/lib/gsap";

/**
 * Hands one band over to the next, so a boundary is a change of section
 * rather than a stretch of scrolling.
 *
 * `Scene` already choreographs how a band arrives. Nothing choreographed how
 * one left — a section just slid off the top at whatever speed the wheel was
 * turning, which is what made the page read as one long field of gradient with
 * content in it at intervals. This scrubs the outgoing band's opacity and a
 * small lift against scroll position, over exactly the window where the next
 * band is running its own entrance. The two overlap, so the crossing is a
 * hand-off you can see.
 *
 * Scrubbed, not triggered: the band is where the scroll put it, which means it
 * comes straight back on the way up and never plays a transition the visitor
 * did not ask for.
 *
 * ## The window
 *
 * Read `bottom 62%` as: the band's bottom edge has come up to 62% of the way
 * down the screen. By then the band's own copy has left the middle of the
 * frame and the next band's heading is entering below it, so the two are on
 * screen together and the crossing has somewhere to happen. It finishes as
 * that edge leaves the top.
 *
 * The floor is 0.2 rather than 0 — a band that goes fully transparent while a
 * sliver of it is still on screen reads as a rendering fault, not as a
 * transition.
 *
 * The hero needs a later window and gets one. Its copy is anchored to the
 * *bottom* of the band rather than sitting in the middle, so it is the last
 * thing to leave: the standard window would start dimming the H1 while it is
 * still the most prominent thing on the page. By `bottom 45%` the headline is
 * already above the fold and only the lead, the buttons and the label row are
 * left to hand over.
 *
 * ## What is excluded
 *
 * The last band, and only that one. Contacto ends where the page ends: at
 * maximum scroll its bottom edge is still around 45% of the viewport — inside
 * any of these windows — so it would sit permanently dimmed under the footer
 * with no way to scroll it back. The form has to be at full strength when the
 * page bottoms out. Verified: opacity 1.00 and no transform at `scrollHeight`.
 */
const WINDOWS = {
  /** Every band whose copy sits in the middle of it. */
  band: { start: "bottom 62%", end: "bottom 8%" },
  /** The hero, whose copy sits at the foot of it. */
  hero: { start: "bottom 45%", end: "bottom -5%" },
} as const;

export function SectionHandoff() {
  useGSAP(() => {
    const media = gsap.matchMedia();

    media.add("(prefers-reduced-motion: no-preference)", () => {
      /*
       * `[data-band]`, not a tag or a depth. `main > section` misses the hero,
       * whose `<section>` is nested inside `HeroScene`'s wrapper — and every
       * index below it would then be off by one, which is how the exclusion
       * above gets silently inverted. `main section` overshoots the other way:
       * the Academia's Requisitos and Evaluación panels are `<section>` too,
       * and they were being faded on their own schedule inside a band that was
       * already fading, compounding to 0.21.
       */
      const bands = [
        ...document.querySelectorAll<HTMLElement>("main [data-band]"),
      ];

      bands.slice(0, -1).forEach((band, index) => {
        // Not named `window`: shadowing the global inside a scroll module is
        // the kind of thing that reads fine until someone adds a resize
        // listener two lines down.
        const span = index === 0 ? WINDOWS.hero : WINDOWS.band;

        gsap.to(band, {
          opacity: 0.2,
          y: -44,
          ease: "none",
          scrollTrigger: {
            trigger: band,
            scroller: scroller(),
            start: span.start,
            end: span.end,
            // A little smoothing: the raw value tracks Lenis's inertial tail
            // frame for frame, and on a flick that shows up as the band
            // flickering rather than fading.
            scrub: 0.4,
          },
        });
      });
    });

    return () => media.revert();
  }, []);

  return null;
}
