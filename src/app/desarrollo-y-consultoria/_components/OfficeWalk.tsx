"use client";

import { useEffect, useRef } from "react";
import { onPageReveal } from "@/lib/page-reveal";
import { paintAtlas } from "../_lib/office-atlas";
import { createRenderer } from "../_lib/office-gl";
import { LOOP, STILL_REVEAL, STILL_TIME, buildRooms, cameraAt, outsideAt, takeView, viewPieces } from "../_lib/office-scene";

/**
 * The opener's art on `/desarrollo-y-consultoria`: a walk round a floor of
 * the office, drawn in lines — development, the server room, the lounge over
 * 9 de Julio and the Obelisco, the meeting room and the Academia's
 * classroom. Support for the claim beside it, never competing with it; the
 * words and charts on its walls only show where it stands beside the copy.
 *
 * The scene is `office-scene.ts` — its city `office-city.ts`, its
 * furniture `office-furniture.ts` — what its walls and screens show is
 * `office-atlas.ts`, and the renderer `office-gl.ts`; this only runs them.
 * The rooms are built here, when the drawing starts, rather than when the
 * page loads, and the city after them, a piece at a time while the page is
 * idle. The walk's clock only moves while the canvas can be seen and after
 * the page has opened, so it never runs unseen. Reduced motion gets one
 * frame — the lounge, the avenue down to the Obelisco — and no loop.
 * Without WebGL 2 there is no drawing, and the band is the copy alone.
 */
export function OfficeWalk() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const renderer = createRenderer(canvas, buildRooms());
    if (!renderer) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    // Beside the copy the words and charts show, set back; on a narrower
    // screen the drawing is small or behind the lead, and they go.
    const wide = window.matchMedia("(min-width: 80rem)");
    let clock = 0;
    let last = 0;
    let frame = 0;
    let running = false;
    let visible = false;
    let revealed = false;

    const draw = () => {
      const still = reduced.matches;
      const at = still ? STILL_TIME : clock;
      renderer.render(cameraAt(at), still ? STILL_REVEAL : clock, LOOP, wide.matches ? 0.62 : 0, outsideAt(at));
    };

    // The words and charts are painted in the page's own Lato, once it has
    // loaded, and handed to the renderer; the walls wait blank until then.
    let disposed = false;
    const family = getComputedStyle(document.body).getPropertyValue("--font-lato").trim() || "Lato, sans-serif";
    Promise.all([400, 700].map((weight) => document.fonts.load(`${weight} 32px ${family}`)))
      .catch(() => undefined)
      .then(() => {
        if (disposed) return;
        const atlas = document.createElement("canvas");
        paintAtlas(atlas, family);
        renderer.setAtlas(atlas);
        draw();
      });

    // The city is built a few pieces at a time whenever the page is idle, so
    // no frame of the walk waits for it; it is not in view before the lounge.
    const idle = "requestIdleCallback" in window;
    const pieces = viewPieces();
    let pending = 0;
    const later = () => {
      pending = idle ? window.requestIdleCallback(buildCity, { timeout: 1000 }) : window.setTimeout(buildCity, 50);
    };
    const buildCity = (deadline?: IdleDeadline) => {
      if (disposed) return;
      const until = performance.now() + Math.min(12, Math.max(6, deadline?.timeRemaining() ?? 0));
      do pieces.shift()?.();
      while (pieces.length && performance.now() < until);
      if (pieces.length) return later();
      renderer.setOutside(takeView());
      draw();
    };
    later();

    const tick = (now: number) => {
      // A hidden tab or a long frame moves the walk on one short step.
      const dt = last ? Math.min(0.05, (now - last) / 1000) : 0;
      last = now;
      clock += dt;
      draw();
      frame = requestAnimationFrame(tick);
    };
    const start = () => {
      if (running || !visible || !revealed || reduced.matches) return;
      running = true;
      last = 0;
      frame = requestAnimationFrame(tick);
    };
    const stop = () => {
      running = false;
      cancelAnimationFrame(frame);
    };

    const visibility = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) start();
      else stop();
    });
    visibility.observe(canvas);
    const size = new ResizeObserver(() => {
      renderer.resize();
      draw();
    });
    size.observe(canvas);
    const onMotion = () => {
      stop();
      draw();
      start();
    };
    reduced.addEventListener("change", onMotion);
    wide.addEventListener("change", draw);
    const release = onPageReveal(() => {
      revealed = true;
      canvas.dataset.ready = "";
      start();
    });
    draw();

    return () => {
      disposed = true;
      if (idle) window.cancelIdleCallback(pending);
      else window.clearTimeout(pending);
      stop();
      visibility.disconnect();
      size.disconnect();
      reduced.removeEventListener("change", onMotion);
      wide.removeEventListener("change", draw);
      release();
      renderer.dispose();
    };
  }, []);

  return (
    <div aria-hidden="true" className="office-walk">
      <canvas ref={canvasRef} className="office-walk_canvas" />
    </div>
  );
}
