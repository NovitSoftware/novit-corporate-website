"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/** The one scroll container on the page — see `.scroll-shell` in globals. */
const SHELL = ".scroll-shell";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
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

export { gsap, ScrollTrigger, useGSAP };
