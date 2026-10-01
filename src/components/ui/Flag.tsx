import { Image } from "@/components/ui/Image";
import { cn } from "@/lib/cn";

type FlagProps = {
  /** A country name from `casos-de-exito.ts`, or two joined by " y " — see
   *  `casesPageContent.work.groups[].items[].country`. */
  country: string;
  className?: string;
};

/**
 * A recorrido card's country, as its flag(s) alone: the country's name is not
 * printed, so it is the flags' accessible name instead.
 *
 * The files are novitsoftware.com/experiencia-novit's own — the standing
 * site's country badges, not the Unicode regional-indicator flag emoji,
 * which Windows renders as bare letter codes rather than pictures. That page
 * carries five of the seven countries the recorrido names; España and México
 * aren't among its cases, so `espana.png` and `mexico.png` are drawn to match
 * the other five's rounded-rect crop rather than scraped. All are 180×120, so
 * they hold up at the size they are shown.
 */
export function Flag({ country, className }: FlagProps) {
  const names = country.split(" y ");

  return (
    <span
      role="img"
      aria-label={country}
      className={cn("inline-flex shrink-0 items-center gap-2", className)}
    >
      {names.map((name) => (
        <FlagChip key={name} name={name} />
      ))}
    </span>
  );
}

/* A hairline ring and a shadow, so the lighter flags — Argentina, Chile —
   keep their edge on the card's glass. */
function FlagChip({ name }: { name: string }) {
  const src = FLAGS[name];
  if (!src) return null;

  return (
    <Image
      src={src}
      alt=""
      width={45}
      height={30}
      className="h-[1.875rem] w-[2.8125rem] shrink-0 rounded-[4px] object-cover shadow-[0_2px_10px_rgb(0_0_0/0.35)] ring-1 ring-blanco/25"
    />
  );
}

const FLAGS: Record<string, string> = {
  Argentina: "/flags/argentina.png",
  Chile: "/flags/chile.png",
  España: "/flags/espana.png",
  "Estados Unidos": "/flags/estados-unidos.png",
  Colombia: "/flags/colombia.png",
  Brasil: "/flags/brasil.png",
  México: "/flags/mexico.png",
};
