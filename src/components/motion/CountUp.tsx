"use client";

import { useMemo, useRef } from "react";
import { gsap, scroller, useGSAP } from "@/lib/gsap";
import { cn } from "@/lib/cn";

type CountUpProps = {
  /** The real value, rendered as-is on the server. */
  value: string;
  className?: string;
};

/**
 * Counts a statistic up to its value when it comes into view.
 *
 * The true value is what renders on the server and what is left in the DOM
 * afterwards, so the number is never wrong for a crawler, a reduced-motion
 * visitor, or anyone reading it before the tween starts.
 */
export function CountUp({ value, className }: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const countable = useMemo(() => parseCountable(value), [value]);

  useGSAP(
    () => {
      const element = ref.current;
      if (!element || !countable) {
        return;
      }

      const media = gsap.matchMedia();

      media.add("(prefers-reduced-motion: no-preference)", () => {
        const state = { current: 0 };

        gsap.to(state, {
          current: countable.number,
          duration: 1.5,
          ease: "power2.out",
          snap: { current: 1 },
          scrollTrigger: {
            trigger: element,
            scroller: scroller(),
            start: "top 88%",
            // Counts back down on the way up, like everything else on the
            // page — but see onReverseComplete: it never rests on zero.
            toggleActions: "play none none reverse",
          },
          onUpdate: () => {
            element.textContent = `${countable.prefix}${state.current}${countable.suffix}`;
          },
          onComplete: () => {
            element.textContent = value;
          },
          onReverseComplete: () => {
            element.textContent = value;
          },
        });

        // If the tween is torn down part-way, leave the real figure behind.
        return () => {
          element.textContent = value;
        };
      });

      return () => media.revert();
    },
    { scope: ref, dependencies: [value, countable] },
  );

  return (
    <span ref={ref} className={cn(className)}>
      {value}
    </span>
  );
}

type Countable = {
  number: number;
  prefix: string;
  suffix: string;
};

/**
 * Pulls a countable quantity out of a label like "~30 profesionales".
 *
 * Figures above 999 are left alone: a year such as 2015 ticking up from zero
 * reads as a glitch rather than an achievement.
 */
function parseCountable(value: string): Countable | null {
  const match = /\d+/.exec(value);
  if (!match || match.index === undefined) {
    return null;
  }

  const number = Number(match[0]);
  if (!Number.isFinite(number) || number > 999) {
    return null;
  }

  return {
    number,
    prefix: value.slice(0, match.index),
    suffix: value.slice(match.index + match[0].length),
  };
}
