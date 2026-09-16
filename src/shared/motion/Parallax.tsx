"use client";

import { useRef, type ReactNode } from "react";
import { gsap, scroller, useGSAP } from "@/shared/lib/gsap";
import { cn } from "@/shared/lib/cn";

type ParallaxProps = {
  children: ReactNode;
  className?: string;
  /**
   * Total travel in pixels across the whole crossing. The element starts half
   * of it above its resting place and ends half below, so it is in the right
   * spot when the section is centred.
   */
  distance?: number;
  /** Extra scale applied while travelling, for background layers. */
  zoom?: number;
  /** Element the crossing is measured against. Defaults to the nearest section. */
  trigger?: string;
};

/**
 * Ties an element to scroll position at a rate of its own. Used sparingly and
 * always at small distances: enough to separate a background from its content,
 * never enough to notice as an effect.
 */
export function Parallax({
  children,
  className,
  distance = 80,
  zoom,
  trigger,
}: ParallaxProps) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const element = ref.current;
      if (!element) {
        return;
      }

      const media = gsap.matchMedia();

      media.add("(prefers-reduced-motion: no-preference)", () => {
        const scope =
          (trigger ? element.closest<HTMLElement>(trigger) : null) ??
          element.closest<HTMLElement>("section, footer") ??
          element;

        gsap.fromTo(
          element,
          { y: -distance / 2, scale: zoom ?? 1 },
          {
            y: distance / 2,
            scale: 1,
            ease: "none",
            scrollTrigger: {
              scroller: scroller(),
              trigger: scope,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
              invalidateOnRefresh: true,
            },
          },
        );
      });

      return () => media.revert();
    },
    { scope: ref, dependencies: [distance, zoom, trigger] },
  );

  return (
    <div ref={ref} className={cn("will-change-transform", className)}>
      {children}
    </div>
  );
}
