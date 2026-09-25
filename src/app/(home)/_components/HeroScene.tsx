"use client";

import { useRef, type ReactNode } from "react";
import { gsap, scroller, useGSAP } from "@/lib/gsap";
import { onPageReveal } from "@/lib/page-reveal";
import { ease } from "@/lib/motion";
import { cn } from "@/lib/cn";

type HeroSceneProps = {
  children: ReactNode;
  className?: string;
};

const target = (name: string) => `[data-hero="${name}"]`;

/**
 * The hero's own choreography, kept apart from `Scene` because it is the one
 * sequence on the page that is not driven by scroll: it is built paused and
 * released by the page curtain, so the headline is already rising as the
 * page opens.
 *
 * It also owns the hero's scroll behaviour: the opening copy settling back
 * as the section leaves. The ground under the copy — `HeroCurrents` — keeps
 * its own motion.
 */
export function HeroScene({ children, className }: HeroSceneProps) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const root = ref.current;
      if (!root) {
        return;
      }

      const media = gsap.matchMedia();

      media.add("(prefers-reduced-motion: no-preference)", () => {
        const entrance = buildEntrance();
        buildScrollLayers(root);
        // Fires straight away when the page is already open, so the
        // timeline has to exist first.
        const release = onPageReveal(() => entrance.play());

        return () => release();
      });

      return () => media.revert();
    },
    { scope: ref },
  );

  return (
    <div ref={ref} className={cn(className)}>
      {children}
    </div>
  );
}

function buildEntrance() {
  const timeline = gsap.timeline({
    paused: true,
    defaults: { ease: ease.out },
  });

  timeline
    .to(target("badge"), {
      opacity: 1,
      y: 0,
      scale: 1,
      duration: 0.6,
    })
    .fromTo(
      `${target("title")} .split-item`,
      // `y: 0` clears the pixel offset GSAP reads out of the CSS resting
      // state; see the `words` recipe in @/lib/motion.
      { yPercent: 115, y: 0 },
      { yPercent: 0, y: 0, duration: 1.05, ease: ease.outLong, stagger: 0.07 },
      "-=0.34",
    )
    .to(target("lead"), { opacity: 1, y: 0, duration: 0.9 }, "-=0.7")
    .to(target("cta"), { opacity: 1, y: 0, duration: 0.75 }, "-=0.7")
    // The two news rows, staggered, arriving just behind the CTA — they are
    // the second thing offered, so they land after the button rather than
    // with it. Same shape as `lead` and `cta` above: the resting state is the
    // `data-anim="rise"` rule in globals.css and this only animates out of
    // it, so a `fromTo` here would be wrong — the rows start visible while
    // the curtain is up, and re-hiding them a second in reads as a flash.
    .to(target("news"), { opacity: 1, y: 0, duration: 0.6, stagger: 0.08 }, "-=0.5")
    .to(
      target("pillars-rule"),
      { scaleX: 1, duration: 1.1, ease: ease.inOut },
      "-=0.75",
    )
    .to(
      target("pillar"),
      { opacity: 1, y: 0, scale: 1, duration: 0.55, stagger: 0.06 },
      "-=0.9",
    );

  return timeline;
}

/**
 * The opening copy settling back and fading as the hero leaves the frame.
 */
function buildScrollLayers(root: HTMLElement) {
  const copy = root.querySelectorAll<HTMLElement>('[data-hero="copy"]');
  if (copy.length) {
    gsap.to(copy, {
      y: -60,
      opacity: 0.35,
      ease: "none",
      scrollTrigger: {
        trigger: root,
        scroller: scroller(),
        start: "top top",
        end: "+=62%",
        scrub: true,
        invalidateOnRefresh: true,
      },
    });
  }
}
