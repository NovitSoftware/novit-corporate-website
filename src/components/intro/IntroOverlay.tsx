"use client";

import Image from "next/image";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useLenis } from "lenis/react";
import { BarField } from "@/components/decor/BarField";
import { introContent } from "@/content/site";
import { gsap, useGSAP } from "@/lib/gsap";
import { BRAND_LOGO } from "@/lib/brand-logo";
import { markIntroComplete } from "@/lib/intro";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { ease } from "@/lib/motion";

/** Backstop: if the timeline never reports back, the curtain still leaves. */
const MAX_INTRO_MS = 2400;

/**
 * The curtain.
 *
 * ## The reveal is the isotipo's own gesture
 *
 * It used to assemble the mark shape by shape and spell the name out a letter
 * at a time, which needed the logo to be a DOM tree of ten rects and five
 * glyph paths. The logo is a PNG now (see `lib/brand-logo.ts`), and rather
 * than fake the old effect by slicing the raster into strips, the curtain does
 * the one thing that is both honest on a single image and true to the mark: it
 * wipes it open from the left.
 *
 * That is not an arbitrary choice of direction. The isotipo *is* four
 * horizontal bars of unequal length extending to the right, and a left-to-right
 * clip is the gesture the whole site is built on — `wipe` in `lib/motion.ts`,
 * every `bar` rule, the growing rules on `/inteligencia-artificial`. So the
 * curtain draws the bars, the wordmark lands with them, the rule closes it, and
 * the whole thing lifts.
 *
 * Five moves, overlapping, no move waiting for the one before it to finish —
 * which is the entire difference between smooth and slow.
 *
 * ## It hands over before it leaves
 *
 * `markIntroComplete` fires while the curtain is still on its way up, so the
 * hero's own timeline is already running underneath it. The visitor sees one
 * continuous movement into the headline rather than two animations in a row.
 *
 * ## When it plays
 *
 * On every arrival at the home page, which is the only page that mounts it.
 * There is no "seen it already" flag any more — `lib/intro.ts` has the note on
 * what one would take, and why this site cannot carry one yet.
 */
export function IntroOverlay() {
  const reduced = usePrefersReducedMotion();
  const rootRef = useRef<HTMLDivElement>(null);
  const [done, setDone] = useState(false);

  const lenis = useLenis();

  /**
   * Reduced motion: straight to the page, and release the hero immediately or
   * it waits for a curtain that is never going to run.
   *
   * A layout effect rather than an effect, so React re-renders before the
   * browser paints and the curtain is never on screen for even one frame.
   */
  useLayoutEffect(() => {
    if (reduced) {
      markIntroComplete();
      setDone(true);
    }
  }, [reduced]);

  useEffect(() => {
    if (done) {
      return;
    }

    const timeout = window.setTimeout(() => {
      markIntroComplete();
      setDone(true);
    }, MAX_INTRO_MS);

    return () => window.clearTimeout(timeout);
  }, [done]);

  // Nothing should move under the curtain.
  useEffect(() => {
    if (done || !lenis) {
      return;
    }

    lenis.stop();
    return () => lenis.start();
  }, [done, lenis]);

  useGSAP(
    () => {
      const root = rootRef.current;
      if (done || !root) {
        return;
      }

      const media = gsap.matchMedia();

      media.add("(prefers-reduced-motion: no-preference)", () => {
        const pick = (selector: string) =>
          root.querySelectorAll<HTMLElement>(selector);

        /* Absolute positions rather than relative offsets: the overlap between
           the moves *is* the choreography, and `-=0.24` chains hide it behind
           arithmetic that changes meaning every time a duration is touched. */
        gsap
          .timeline({
            defaults: { ease: ease.out },
            onComplete: () => setDone(true),
          })
          // The ground the bars are drawn on, arriving first and quietly.
          .to(pick("[data-intro-ground]"), { opacity: 1, duration: 0.7 }, 0)
          // The wipe. This is the move the whole curtain is about.
          .to(
            pick("[data-intro-mask]"),
            {
              clipPath: "inset(0 0% 0 0)",
              duration: 0.76,
              ease: ease.inOut,
            },
            0.05,
          )
          /* The lockup slides the last few pixels into place under the wipe, so
             the mark is arriving rather than being uncovered by a blind. Longer
             than the wipe on purpose — it is still settling once it is whole. */
          .fromTo(
            pick("[data-intro-logo]"),
            { x: -20, scale: 1.035 },
            { x: 0, scale: 1, duration: 0.95, ease: ease.outLong },
            0.05,
          )
          .to(
            pick("[data-intro-rule]"),
            { scaleX: 1, duration: 0.44, ease: "none" },
            0.56,
          )
          // The hero starts here, while the curtain is still on its way up.
          .add(markIntroComplete, 0.95)
          .to(
            pick("[data-intro-stack]"),
            { y: -26, opacity: 0, duration: 0.36 },
            1,
          )
          .to(
            root,
            {
              clipPath: "inset(0 0 100% 0)",
              duration: 0.6,
              ease: ease.inOut,
            },
            1.18,
          );
      });

      return () => media.kill(false);
    },
    { scope: rootRef, dependencies: [done] },
  );

  if (reduced || done) {
    return null;
  }

  return (
    <div
      ref={rootRef}
      data-intro-root
      data-tone="dark"
      className="intro-overlay ground-deep fixed inset-0 z-[80] flex items-center justify-center"
      role="status"
      aria-live="polite"
      aria-label={introContent.label}
    >
      {/* Both start invisible and are faded in by the timeline, so the first
          frame is the flat brand ground rather than a grid that was already
          there before anything moved. */}
      <div
        data-intro-ground
        aria-hidden="true"
        className="absolute inset-0 bar-grid opacity-0"
      />
      {/* Absolute, so it stays out of the flex flow: a static wrapper would
          become a zero-width flex item and pull the centred stack off centre. */}
      <div
        data-intro-ground
        aria-hidden="true"
        className="absolute inset-0 opacity-0"
      >
        <BarField spread={0.6} />
      </div>

      <div
        data-intro-stack
        className="relative flex flex-col items-center gap-7 px-6"
      >
        {/* The clip lives on the wrapper and the movement on the image inside
            it: one element cannot both hold a clip rectangle still and travel
            through it. The resting state is set here rather than in
            `globals.css` because this is the only element on the site that
            uses it, and the component is never rendered when motion is off. */}
        <div
          data-intro-mask
          className="w-[15rem] [clip-path:inset(0_100%_0_0)] sm:w-[20rem]"
        >
          <Image
            data-intro-logo
            src={BRAND_LOGO.lockup.white}
            alt=""
            width={BRAND_LOGO.lockup.width}
            height={BRAND_LOGO.lockup.height}
            priority
            sizes="(max-width: 640px) 240px, 320px"
            className="h-auto w-full"
          />
        </div>
        <span
          data-intro-rule
          aria-hidden="true"
          className="hairline w-40 origin-left scale-x-0"
        />
        <span className="sr-only">{introContent.label}</span>
      </div>
    </div>
  );
}
