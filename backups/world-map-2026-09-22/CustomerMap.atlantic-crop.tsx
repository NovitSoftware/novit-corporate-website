import type { CSSProperties } from "react";
import { customerCountries } from "@/content/home";
import { cn } from "@/lib/cn";
import { robinson } from "@/lib/robinson";

/* `/maps/world.svg` is Robinson; these place a lat/lon in its viewBox, fitted
   against the US, Brazil, Spain, Argentina and Colombia outlines. */
const ORIGIN_X = 977.8;
const ORIGIN_Y = 497.6;
const SCALE_X = 5.63;
const SCALE_Y = 514;

/* The Atlantic half, Alaska to the Gulf and down to Tierra del Fuego: the
   whole world is too wide to read beside the copy, and every client is here. */
const CROP = { x: 150, y: 60, width: 1100, height: 796 };

const points = customerCountries.map((country) => {
  const [x, y] = robinson(country.lat, country.lon);
  return { name: country.name, cx: ORIGIN_X + SCALE_X * x, cy: ORIGIN_Y - SCALE_Y * y };
});

const label = `Clientes en ${new Intl.ListFormat("es", { type: "conjunction" }).format(
  customerCountries.map((country) => country.name),
)}`;

/** The map, with a dot on every country Novit has clients in. */
export function CustomerMap({ className }: { className?: string }) {
  return (
    <figure role="img" aria-label={label} className={cn("customer-map", className)}>
      <svg
        viewBox={`${CROP.x} ${CROP.y} ${CROP.width} ${CROP.height}`}
        aria-hidden="true"
        className="block aspect-[1100/796] h-auto w-full"
      >
        <image
          href="/maps/world.svg"
          x={0.98}
          y={0.98}
          width={2000}
          height={855.87}
          className="customer-map_land"
        />
        {points.map((point, index) => (
          <g key={point.name} style={{ "--pulse-delay": `${index * -0.6}s` } as CSSProperties}>
            <title>{point.name}</title>
            <circle className="customer-map_pulse" cx={point.cx} cy={point.cy} r={11} />
            <circle className="customer-map_dot" cx={point.cx} cy={point.cy} r={11} />
          </g>
        ))}
      </svg>
    </figure>
  );
}
