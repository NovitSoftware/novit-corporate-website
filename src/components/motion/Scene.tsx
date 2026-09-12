"use client";

import { useRef, type ElementType, type ReactNode } from "react";
import { animRecipes, isAnimName, type AnimRecipe } from "@/lib/motion";
import { gsap, ScrollTrigger, scroller, useGSAP } from "@/lib/gsap";
import { cn } from "@/lib/cn";

/**
 * Choreographs the entrance of a section.
 *
 * Sections stay Server Components and only tag their parts with
 * `data-anim="<gesture>"`. Scene reads those tags and decides how they arrive,
 * based on the container they sit in:
 *
 * - inside `data-anim-block` — one timeline, one trigger, elements following
 *   each other in DOM order. For a heading and its copy, which are read as a
 *   single unit.
 * - inside `data-anim-batch` — a trigger each, with whatever happens to enter
 *   together staggered as a group. For grids, where a single trigger would
 *   reveal the bottom row while it is still off screen.
 * - on its own — its own trigger, when it comes into view.
 *
 * `data-anim-lead` overrides the pause before the next element in a block.
 *
 * ## The first screen is one entrance, not a race
 *
 * A ScrollTrigger whose start is already satisfied fires the moment it is
 * created, so on a page whose opener is above the fold every group used to
 * start at the same instant and finish whenever its own recipe happened to
 * end. The first screen then assembled out of order: on /academianovit the
 * enrolment button and the first load figure landed before the lead paragraph
 * above them, and the eyebrow arrived 300ms after the headline it labels.
 *
 * So anything already on screen when the scene is built skips the trigger and
 * joins one timeline instead, in document order, with the same leads a block
 * would use. Scrolling in from below is unchanged — those groups still get
 * their own triggers and still reverse on the way back up. The entrance does
 * not reverse, because there is nothing above the top of the page to scroll
 * back to.
 */

type SceneProps = {
  children: ReactNode;
  as?: ElementType;
  className?: string;
  /** ScrollTrigger start position for everything in this scene. */
  start?: string;
};

const BATCH_STAGGER = 0.09;

/**
 * How far into the viewport a block has to come before it starts arriving.
 * This was 82%, which on a page with this much air between bands meant a long
 * stretch of scrolling where the next section was already on screen and still
 * doing nothing. At 90% the reveal starts as the block crosses the edge, so
 * the arrival is what fills the gap between bands instead of following it.
 */
const DEFAULT_START = "top 90%";

export function Scene({
  children,
  as: Tag = "div",
  className,
  start = DEFAULT_START,
}: SceneProps) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const root = ref.current;
      if (!root) {
        return;
      }

      const media = gsap.matchMedia();

      media.add("(prefers-reduced-motion: no-preference)", () => {
        /* One timeline for the whole first screen. Built lazily so a scene
           entirely below the fold — which is most of them — creates nothing. */
        let entrance: gsap.core.Timeline | null = null;
        let at = 0;

        for (const group of collectGroups(root)) {
          if (alreadyOnScreen(group, start)) {
            entrance ??= gsap.timeline();
            at = appendGroup(entrance, group, at);
          } else if (group.mode === "batch") {
            runBatch(group.elements, start);
          } else {
            runTimeline(group.container, group.elements, start);
          }
        }
      });

      return () => media.revert();
    },
    { scope: ref },
  );

  return (
    <Tag ref={ref} className={cn(className)}>
      {children}
    </Tag>
  );
}

type Group = {
  mode: "block" | "batch";
  container: HTMLElement;
  elements: HTMLElement[];
};

/**
 * Buckets every tagged element under the container that governs it, keeping
 * DOM order — `querySelectorAll` already returns document order.
 */
function collectGroups(root: HTMLElement): Group[] {
  const groups = new Map<HTMLElement, Group>();

  for (const element of root.querySelectorAll<HTMLElement>("[data-anim]")) {
    const container = element.closest<HTMLElement>(
      "[data-anim-block], [data-anim-batch]",
    );
    const key = container ?? element;
    const mode =
      container?.hasAttribute("data-anim-batch") === true ? "batch" : "block";

    const existing = groups.get(key);
    if (existing) {
      existing.elements.push(element);
    } else {
      groups.set(key, { mode, container: key, elements: [element] });
    }
  }

  return [...groups.values()];
}

/**
 * Would every trigger in this group already have fired?
 *
 * The same test ScrollTrigger applies, read off the live box rather than from
 * scroll position so it is still right when the page opens on a fragment:
 * `start` is "top <n>%", and a trigger fires once its trigger element's top has
 * come that far into the viewport.
 *
 * A block is measured by its container, which is the one trigger it has. A
 * batch has a trigger per element and every one of them has to have fired —
 * otherwise a tall grid whose first row is on screen would reveal its last row
 * while it is still a screen and a half below, which is the thing `batch` mode
 * exists to prevent.
 */
function alreadyOnScreen(group: Group, start: string): boolean {
  const threshold = Number.parseFloat(start.split(/\s+/)[1] ?? "");
  if (!Number.isFinite(threshold)) {
    return false;
  }

  const line = window.innerHeight * (threshold / 100);
  const fired = (el: HTMLElement) => el.getBoundingClientRect().top < line;

  return group.mode === "batch"
    ? group.elements.every(fired)
    : fired(group.container);
}

/**
 * Adds one group to the entrance and returns where the next one starts.
 *
 * A batch keeps its own tight stagger — a grid row has to arrive as a row, not
 * as items queued by the lead of whatever gesture each one uses — and then the
 * whole row counts as a single beat in the sequence.
 */
function appendGroup(
  timeline: gsap.core.Timeline,
  group: Group,
  at: number,
): number {
  let next = at;

  for (const element of group.elements) {
    const recipe = recipeFor(element);
    if (!recipe) {
      continue;
    }

    addRecipe(timeline, element, recipe, next);

    if (group.mode === "batch") {
      next += BATCH_STAGGER;
    } else {
      const lead = Number.parseFloat(element.dataset.animLead ?? "");
      next += Number.isFinite(lead) ? lead : recipe.lead;
    }
  }

  return next;
}

function runTimeline(
  container: HTMLElement,
  elements: HTMLElement[],
  start: string,
) {
  const timeline = gsap.timeline({
    scrollTrigger: {
      trigger: container,
      scroller: scroller(),
      start,
      // Scrolling back up puts it away again, so the page reads the same in
      // both directions instead of leaving everything already played.
      toggleActions: "play none none reverse",
    },
  });

  let at = 0;

  for (const element of elements) {
    const recipe = recipeFor(element);
    if (!recipe) {
      continue;
    }

    addRecipe(timeline, element, recipe, at);

    const lead = Number.parseFloat(element.dataset.animLead ?? "");
    at += Number.isFinite(lead) ? lead : recipe.lead;
  }
}

/**
 * One trigger per element, so nothing is revealed off screen, but a stagger
 * across whatever crosses the line together, so a row still arrives as a row.
 *
 * Each element keeps one timeline for the life of the scene rather than being
 * handed a fresh one on every crossing: that is what lets a row go back the
 * way it came when the visitor scrolls up, and arrive again coming down.
 */
function runBatch(elements: HTMLElement[], start: string) {
  const timelines = new WeakMap<HTMLElement, gsap.core.Timeline>();

  const timelineFor = (element: HTMLElement): gsap.core.Timeline | null => {
    const existing = timelines.get(element);
    if (existing) {
      return existing;
    }

    const recipe = recipeFor(element);
    if (!recipe) {
      return null;
    }

    const timeline = gsap.timeline({ paused: true });
    addRecipe(timeline, element, recipe, 0);
    timelines.set(element, timeline);
    return timeline;
  };

  ScrollTrigger.batch(elements, {
    scroller: scroller(),
    start,
    onEnter: (batch) => {
      (batch as HTMLElement[]).forEach((element, index) => {
        // Restarting with the delay included holds the element at its resting
        // state until its turn in the row comes round.
        timelineFor(element)
          ?.delay(index * BATCH_STAGGER)
          .restart(true);
      });
    },
    onLeaveBack: (batch) => {
      for (const element of batch as HTMLElement[]) {
        // No stagger on the way out — the row leaves as one.
        timelineFor(element)?.delay(0).reverse();
      }
    },
  });
}

function recipeFor(element: HTMLElement): AnimRecipe | null {
  const name = element.dataset.anim;
  return isAnimName(name) ? animRecipes[name] : null;
}

function addRecipe(
  timeline: gsap.core.Timeline,
  element: HTMLElement,
  recipe: AnimRecipe,
  at: number,
) {
  const targets = recipe.targets
    ? element.querySelectorAll<HTMLElement>(recipe.targets)
    : element;

  if (recipe.targets && (targets as NodeListOf<HTMLElement>).length === 0) {
    return;
  }

  // Longer runs of text need a tighter stagger than a three-word headline.
  const stagger = Number.parseFloat(element.dataset.animStagger ?? "");
  const to = Number.isFinite(stagger) ? { ...recipe.to, stagger } : recipe.to;

  if (recipe.from) {
    timeline.fromTo(targets, recipe.from, to, at);
  } else {
    timeline.to(targets, to, at);
  }

  for (const companion of recipe.also ?? []) {
    const others = element.querySelectorAll<HTMLElement>(companion.targets);
    if (others.length > 0) {
      timeline.to(others, companion.to, at);
    }
  }
}
