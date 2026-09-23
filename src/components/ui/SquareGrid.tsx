"use client";

import { memo, useEffect, useRef } from "react";

type Direction = "diagonal" | "up" | "right" | "down" | "left";

interface Cell {
  x: number;
  y: number;
}

interface SquareGridProps {
  direction?: Direction;
  speed?: number;
  lineColor?: string;
  squareSize?: number;
  hoverFillColor?: string;
  hoverTrailAmount?: number;
}

/**
 * A drifting grid of squares; the square under the cursor fills in and a
 * short trail fades behind it.
 *
 * The lines go down as one path, one stroke per frame. The pointer is read
 * from `window` because the scene layer is `pointer-events: none`. Under
 * reduced motion the grid neither drifts nor tracks the cursor.
 */
export const SquareGrid = memo(function SquareGrid({
  direction = "right",
  speed = 1,
  lineColor = "rgba(241, 235, 251, 0.15)",
  squareSize = 40,
  hoverFillColor = "rgba(61, 176, 228, 0.2)",
  hoverTrailAmount = 0,
}: SquareGridProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const offset = { x: 0, y: 0 };
    let hovered: Cell | null = null;
    let trail: Cell[] = [];
    const opacities = new Map<string, number>();
    let w = 0;
    let h = 0;
    let raf: number | null = null;

    const mod = (v: number, m: number) => ((v % m) + m) % m;

    function resize() {
      const rect = canvas!.parentElement!.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
      canvas!.width = w * dpr;
      canvas!.height = h * dpr;
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (reduced) draw();
    }

    function draw() {
      const ox = mod(offset.x, squareSize);
      const oy = mod(offset.y, squareSize);
      ctx!.clearRect(0, 0, w, h);

      ctx!.fillStyle = hoverFillColor;
      for (const [key, alpha] of opacities) {
        const [col, row] = key.split(",").map(Number);
        ctx!.globalAlpha = alpha;
        ctx!.fillRect(col * squareSize + ox, row * squareSize + oy, squareSize, squareSize);
      }
      ctx!.globalAlpha = 1;

      ctx!.strokeStyle = lineColor;
      ctx!.beginPath();
      for (let x = ox; x < w; x += squareSize) {
        ctx!.moveTo(x, 0);
        ctx!.lineTo(x, h);
      }
      for (let y = oy; y < h; y += squareSize) {
        ctx!.moveTo(0, y);
        ctx!.lineTo(w, y);
      }
      ctx!.stroke();
    }

    function step() {
      const v = Math.max(speed, 0.1);
      if (direction === "right" || direction === "diagonal") offset.x = mod(offset.x - v, squareSize);
      if (direction === "left") offset.x = mod(offset.x + v, squareSize);
      if (direction === "up") offset.y = mod(offset.y + v, squareSize);
      if (direction === "down" || direction === "diagonal") offset.y = mod(offset.y - v, squareSize);
    }

    function updateOpacities() {
      const targets = new Map<string, number>();
      if (hovered) targets.set(`${hovered.x},${hovered.y}`, 1);
      trail.forEach((c, i) => {
        const key = `${c.x},${c.y}`;
        if (!targets.has(key)) targets.set(key, (trail.length - i) / (trail.length + 1));
      });
      for (const key of targets.keys()) if (!opacities.has(key)) opacities.set(key, 0);
      for (const [key, value] of opacities) {
        const next = value + ((targets.get(key) ?? 0) - value) * 0.15;
        if (next < 0.005) opacities.delete(key);
        else opacities.set(key, next);
      }
    }

    function tick() {
      step();
      updateOpacities();
      draw();
      raf = requestAnimationFrame(tick);
    }

    function cellAt(mx: number, my: number): Cell {
      return {
        x: Math.floor((mx - mod(offset.x, squareSize)) / squareSize),
        y: Math.floor((my - mod(offset.y, squareSize)) / squareSize),
      };
    }

    function pushTrail() {
      if (!hovered || hoverTrailAmount <= 0) return;
      trail = [{ ...hovered }, ...trail].slice(0, hoverTrailAmount);
    }

    function onMouseMove(e: MouseEvent) {
      const rect = canvas!.getBoundingClientRect();
      const next = cellAt(e.clientX - rect.left, e.clientY - rect.top);
      if (hovered && hovered.x === next.x && hovered.y === next.y) return;
      pushTrail();
      hovered = next;
    }

    function onMouseLeave() {
      pushTrail();
      hovered = null;
    }

    resize();
    window.addEventListener("resize", resize);
    if (!reduced) {
      window.addEventListener("mousemove", onMouseMove, { passive: true });
      document.documentElement.addEventListener("mouseleave", onMouseLeave);
      raf = requestAnimationFrame(tick);
    }

    return () => {
      if (raf !== null) cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMouseMove);
      document.documentElement.removeEventListener("mouseleave", onMouseLeave);
    };
  }, [direction, speed, lineColor, hoverFillColor, squareSize, hoverTrailAmount]);

  return <canvas ref={canvasRef} className="block h-full w-full" />;
});
