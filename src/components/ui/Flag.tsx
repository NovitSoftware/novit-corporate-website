import { Image } from "@/components/ui/Image";
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
 * The files are novitsoftware.com/experiencia-novit's own — the standing
 * site's country badges, not the Unicode regional-indicator flag emoji,
 * which Windows renders as bare letter codes rather than pictures. That page
 * carries five of the six countries the recorrido names; España isn't one of
 * its cases, so `espana.png` is drawn to match the other five's rounded-rect
 * crop rather than scraped.
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
  const src = FLAGS[name];
  if (!src) return null;

  return (
    <Image
      src={src}
      alt=""
      width={18}
      height={12}
      className="h-3 w-[1.1rem] shrink-0 rounded-[2px] object-cover"
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
};
