"use client";

import { useEffect, useRef } from "react";
import { withBasePath } from "@/lib/base-path";
import { cn } from "@/lib/cn";

type MutedClipProps = {
  /** The clip's path without an extension: `/clips/aog` stands for the three
   *  files `/clips/aog.av1.mp4`, `/clips/aog.mp4` and `/clips/aog.webp`. */
  src: string;
  /** What the clip shows, for assistive technology: it plays without sound
   *  and without controls, so it is an image, described once. */
  description: string;
  className?: string;
};

/** Network Information, where the browser has it (Chromium only). */
type Connection = { saveData?: boolean; effectiveType?: string };

/**
 * A short clip played muted, in a loop, while it is on screen.
 *
 * It is the site's own footage, shown for what it shows — a place, a room,
 * people at work — so there is no sound to offer and no controls to draw.
 * Each clip is cut to the stretch the page shows and encoded twice, at most
 * 360px wide and 24 fps — the frames it fills are never wider than about
 * 280px: AV1 first, for the browsers that decode it, and H.264 for the rest
 * (Safari without an AV1 decoder). The WebP poster is the cut's first frame,
 * so the frame on screen does not change when playback starts.
 *
 * Nothing but the poster loads with the page. The clip is fetched and started
 * a quarter of a screen before it comes into view, so it is already moving
 * when it is seen, and it pauses once it is that far out again: a page with
 * several costs one or two decoders at a time. Reduced motion, Save-Data and
 * a 2G connection keep the poster and never fetch the clip.
 */
export function MutedClip({ src, description, className }: MutedClipProps) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = ref.current;
    if (!video) {
      return;
    }

    const connection = (navigator as Navigator & { connection?: Connection }).connection;
    if (
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      connection?.saveData ||
      connection?.effectiveType?.endsWith("2g")
    ) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          void video.play().catch(() => {});
        } else {
          video.pause();
        }
      },
      { rootMargin: "25% 0px", threshold: 0 },
    );
    observer.observe(video);

    return () => observer.disconnect();
  }, []);

  const base = withBasePath(src);

  return (
    <video
      ref={ref}
      muted
      loop
      playsInline
      preload="none"
      poster={`${base}.webp`}
      role="img"
      aria-label={description}
      className={cn("h-full w-full object-cover", className)}
    >
      <source src={`${base}.av1.mp4`} type='video/mp4; codecs="av01.0.05M.08"' />
      <source src={`${base}.mp4`} type="video/mp4" />
    </video>
  );
}
