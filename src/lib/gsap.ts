"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/** The one scroll container on the page — see `.scroll-shell` in globals. */
const SHELL = ".scroll-shell";

if (typeof window !== "undefined") {
  // DrawSVG draws the site's lines in: the Academia's architecture, the
  // customer map's routes, the home hero's currents.
  gsap.registerPlugin(ScrollTrigger, DrawSVGPlugin, useGSAP);
}

let shell: HTMLElement | null = null;

/**
 * What every ScrollTrigger on the site has to measure against: the document
 * is pinned to the viewport and the shell inside it is what moves, so a
 * trigger left on the default scroller would never fire.
 *
 * It has to be handed over as an element and not as a selector string —
 * inside a `useGSAP` scope GSAP resolves selector strings within that
 * component's subtree, and the shell is above every one of them. Passing
 * `scroller: scroller()` explicitly is also why this cannot be a default:
 * `ScrollTrigger.defaults` is read at trigger creation, which happens in
 * children before the provider has had a chance to set it.
 */
export function scroller(): HTMLElement | undefined {
  if (!shell?.isConnected) {
    shell = document.querySelector<HTMLElement>(SHELL);
  }
  return shell ?? undefined;
}

/**
 * The motion preference as `gsap.matchMedia()` conditions, for a figure that
 * mounts either way and reads `context.conditions.motion` to decide how.
 *
 * Both halves are needed: matchMedia only calls a conditions callback when at
 * least one condition matches, so `motion` alone never runs it under reduced
 * motion — and the figure never gets its still frame or its hover.
 */
export const motionConditions = {
  motion: "(prefers-reduced-motion: no-preference)",
  reduced: "(prefers-reduced-motion: reduce)",
} as const;

export { gsap, ScrollTrigger, useGSAP };
