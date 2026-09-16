import Image from "next/image";
import { cn } from "@/shared/lib/cn";
import { ILLUSTRATIONS, type IllustrationName } from "@/shared/lib/illustrations";

type IllustrationProps = {
  name: IllustrationName;
  /** Extra classes for the plate, not the image — usually an aspect ratio. */
  className?: string;
  /** Above the fold on first paint. Off by default. */
  priority?: boolean;
  /** Rendered width hint for `next/image`'s source selection. */
  sizes?: string;
};

/**
 * One illustration, on its plate.
 *
 * The plate is the point. These drawings are built for a light ground and this
 * site's ground is the brand gradient, so every one of them needs a surface of
 * its own to sit on — see `lib/illustrations.ts` for why that surface is the
 * system's own `#F3F6F8` rather than something invented for the occasion.
 *
 * Having it here rather than in each card is what keeps the eight of them
 * looking like one set: the radius, the inset, the surface and the
 * `object-contain` are decided once. A card passes an aspect ratio and nothing
 * else. `aria-hidden` because every one of these illustrates a heading that is
 * already right next to it — the alt text in the registry is there for the
 * cases where that stops being true, not to be read out twice.
 */
export function Illustration({
  name,
  className,
  priority = false,
  sizes = "(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 420px",
}: IllustrationProps) {
  const art = ILLUSTRATIONS[name];

  return (
    <div
      aria-hidden="true"
      className={cn(
        /* White, the system's other page surface: `.card` is a translucent
           glass ground, so a grey plate inside it would vanish into the
           milk. White reads on the glass and directly
           on the gradient alike. */
        /* Flex, not grid. A grid's implicit row is `auto`, so the image's
           `height: 100%` is cyclic there and falls back to intrinsic height —
           a portrait drawing sized its own row to 301px inside a 152px plate
           and got clipped by the `overflow-hidden`. A flex item's percentage
           height resolves straight against the container's content box, which
           the aspect ratio makes definite. */
        "flex items-center justify-center overflow-hidden rounded-card bg-blanco p-5 sm:p-6",
        className,
      )}
    >
      <Image
        src={art.src}
        alt=""
        width={art.width}
        height={art.height}
        priority={priority}
        sizes={sizes}
        /* Both axes pinned, then `object-contain` does the fitting — rather
           than `max-h-full w-auto`, which leaves the box intrinsically sized
           and so lets a portrait drawing decide its own height. Letterboxing
           costs nothing here: the art is transparent and the plate is white,
           so the spare space is invisible, which is what lets one plate ratio
           hold a set whose drawings run from 2:1 to 0.64:1. */
        className="h-full w-full object-contain"
      />
    </div>
  );
}
