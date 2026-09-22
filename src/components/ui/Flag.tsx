import type { ReactElement } from "react";
import { cn } from "@/lib/cn";

type FlagProps = {
  /** A country name from `casos-de-exito.ts`, or two joined by " y " — see
   *  `casesPageContent.work.groups[].items[].country`. */
  country: string;
  className?: string;
};

/**
 * The flag(s) beside a recorrido card's country.
 *
 * Windows renders the Unicode regional-indicator flag emoji as bare letter
 * codes rather than pictures — the reason these are drawn, not typed.
 * Simplified geometry, no charges or seals: at chip size the ratio and the
 * colours are what reads, not the coat of arms.
 */
export function Flag({ country, className }: FlagProps) {
  const names = country.split(" y ");

  return (
    <span className={cn("inline-flex shrink-0 items-center gap-1", className)}>
      {names.map((name) => (
        <FlagChip key={name} name={name} />
      ))}
    </span>
  );
}

function FlagChip({ name }: { name: string }) {
  const Glyph = FLAGS[name];
  if (!Glyph) return null;

  return (
    <span className="inline-block h-3 w-[1.1rem] shrink-0 overflow-hidden rounded-[2px] ring-1 ring-inset ring-blanco/25">
      <Glyph />
    </span>
  );
}

const FLAGS: Record<string, () => ReactElement> = {
  Argentina: () => (
    <svg viewBox="0 0 20 14" className="h-full w-full">
      <rect width="20" height="14" fill="#75aadb" />
      <rect y="4.67" width="20" height="4.67" fill="#fff" />
    </svg>
  ),
  Chile: () => (
    <svg viewBox="0 0 20 14" className="h-full w-full">
      <rect width="20" height="14" fill="#fff" />
      <rect y="7" width="20" height="7" fill="#d52b1e" />
      <rect width="7" height="7" fill="#0039a6" />
      <polygon
        fill="#fff"
        points="3.5,2.3 4.1,3.9 5.8,3.9 4.4,4.9 4.9,6.5 3.5,5.5 2.1,6.5 2.6,4.9 1.2,3.9 2.9,3.9"
      />
    </svg>
  ),
  España: () => (
    <svg viewBox="0 0 20 14" className="h-full w-full">
      <rect width="20" height="14" fill="#aa151b" />
      <rect y="3.5" width="20" height="7" fill="#f1bf00" />
    </svg>
  ),
  "Estados Unidos": () => (
    <svg viewBox="0 0 20 14" className="h-full w-full">
      <rect width="20" height="14" fill="#fff" />
      {[0, 2, 4, 6, 8, 10, 12].map((y) => (
        <rect key={y} y={y} width="20" height="1.08" fill="#b22234" />
      ))}
      <rect width="9" height="7.5" fill="#3c3b6e" />
    </svg>
  ),
  Colombia: () => (
    <svg viewBox="0 0 20 14" className="h-full w-full">
      <rect width="20" height="14" fill="#fcd116" />
      <rect y="7" width="20" height="3.5" fill="#003893" />
      <rect y="10.5" width="20" height="3.5" fill="#ce1126" />
    </svg>
  ),
  Brasil: () => (
    <svg viewBox="0 0 20 14" className="h-full w-full">
      <rect width="20" height="14" fill="#009739" />
      <polygon fill="#fedd00" points="10,1.5 18.5,7 10,12.5 1.5,7" />
      <circle cx="10" cy="7" r="3" fill="#012169" />
    </svg>
  ),
};
