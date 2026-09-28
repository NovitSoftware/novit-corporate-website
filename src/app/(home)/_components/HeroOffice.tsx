"use client";

import { useEffect, useRef } from "react";
import { onPageReveal } from "@/lib/page-reveal";
import { paintAtlas } from "../_lib/hero-office-atlas";
import { createRenderer } from "../_lib/hero-office-gl";
import { LOOP, SCENE, STILL_REVEAL, STILL_TIME, cameraAt } from "../_lib/hero-office-scene";

/**
 * The hero's ground: a walk through four rooms of the office, drawn in lines
 * — development, the server room, the lounge, the meeting room. Support for
 * the headline, never competing with it: beside the copy on a wide screen,
 * and on a narrower one faint behind it, without its words.
 *
 * The scene is `hero-office-scene.ts`, what its walls and screens show is
 * `hero-office-atlas.ts`, and the renderer `hero-office-gl.ts`; this only
 * runs them. The walk's clock only moves while the canvas can be seen and
 * after the page has opened, so it never runs unseen. Reduced motion gets
 * one frame — the development room, its screens drawn — and no loop. Without
 * WebGL 2 there is no drawing, and the band is the copy alone.
 */
export function HeroOffice() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const renderer = createRenderer(canvas, SCENE);
    if (!renderer) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    // Beside the copy the words and charts show, set back; behind the copy,
    // on a narrower screen, they would sit under the headline, so they go.
    const wide = window.matchMedia("(min-width: 80rem)");
    let clock = 0;
    let last = 0;
    let frame = 0;
    let running = false;
    let visible = false;
    let revealed = false;

    const draw = () => {
      const still = reduced.matches;
      renderer.render(cameraAt(still ? STILL_TIME : clock), still ? STILL_REVEAL : clock, LOOP, wide.matches ? 0.62 : 0);
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
    <div aria-hidden="true" className="hero-office">
      <canvas ref={canvasRef} className="hero-office_canvas" />
    </div>
  );
}
