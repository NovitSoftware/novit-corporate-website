import type { CSSProperties } from "react";
import { customerCountries } from "@/content/home";
import { cn } from "@/lib/cn";
import { robinson } from "@/lib/robinson";

/* `/maps/world.svg` is Robinson; these place a lat/lon in its viewBox, fitted
   against the US, Brazil, Spain, Argentina and Colombia outlines. */
const VIEW_BOX = "0.98 0.98 2000 855.87";
const ORIGIN_X = 977.8;
const ORIGIN_Y = 497.6;
const SCALE_X = 5.63;
const SCALE_Y = 514;

const points = customerCountries.map((country) => {
  const [x, y] = robinson(country.lat, country.lon);
  return { name: country.name, cx: ORIGIN_X + SCALE_X * x, cy: ORIGIN_Y - SCALE_Y * y };
});

/** The world, with a dot on every country Novit has clients in. */
export function CustomerMap({ className }: { className?: string }) {
  return (
    <figure
      role="img"
      aria-label={`Clientes en ${new Intl.ListFormat("es", { type: "conjunction" }).format(customerCountries.map((c) => c.name))}`}
      className={cn("customer-map relative", className)}
    >
      {/* eslint-disable-next-line @next/next/no-img-element -- a static SVG has nothing to optimise */}
      <img src="/maps/world.svg" alt="" width={2000} height={856} className="customer-map_land h-auto w-full" />
      <svg viewBox={VIEW_BOX} aria-hidden="true" className="absolute inset-0 h-full w-full overflow-visible">
        {points.map((point, index) => (
          <g key={point.name} style={{ "--pulse-delay": `${index * -0.6}s` } as CSSProperties}>
            <title>{point.name}</title>
            <circle className="customer-map_pulse" cx={point.cx} cy={point.cy} r={16} />
            <circle className="customer-map_dot" cx={point.cx} cy={point.cy} r={16} />
          </g>
        ))}
      </svg>
    </figure>
  );
}
