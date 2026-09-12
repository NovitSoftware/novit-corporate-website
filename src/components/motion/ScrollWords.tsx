"use client";

import { useRef, type ElementType } from "react";
import { SplitWords } from "@/components/motion/SplitWords";
import { gsap, scroller, useGSAP } from "@/lib/gsap";
import { cn } from "@/lib/cn";

type ScrollWordsProps = {
  text: string;
  as?: ElementType;
  className?: string;
};

/**
 * The page's signature move: a large statement whose words are brought up from
 * dim to full as the section travels past. Because it is tied to scroll
 * position rather than played once, reading the statement and scrolling it are
 * the same gesture.
 *
 * The resting dim lives in `globals.css` under `[data-scrub]`, so without
 * scripts — or with reduced motion — the statement is simply legible.
 */
export function ScrollWords({
  text,
  as: Tag = "p",
  className,
}: ScrollWordsProps) {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const element = ref.current;
      if (!element) {
        return;
      }

      const media = gsap.matchMedia();

      media.add("(prefers-reduced-motion: no-preference)", () => {
        const words = element.querySelectorAll<HTMLElement>(".split-item");
        if (words.length === 0) {
          return;
        }

        gsap.fromTo(
          words,
          { opacity: 0.18 },
          {
            opacity: 1,
            ease: "none",
            duration: 0.4,
            // `amount` spreads the whole run across the scroll range, so the
            // last word lands exactly as the statement clears the trigger.
            stagger: { amount: 1 },
            scrollTrigger: {
              trigger: element,
              scroller: scroller(),
              start: "top 78%",
              end: "bottom 52%",
              scrub: true,
              invalidateOnRefresh: true,
            },
          },
        );
      });

      return () => media.revert();
    },
    { scope: ref, dependencies: [text] },
  );

  return (
    <Tag ref={ref} data-scrub className={cn(className)}>
      <SplitWords text={text} />
    </Tag>
  );
}
