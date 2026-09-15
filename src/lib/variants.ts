import { cn } from "@/lib/cn";

/**
 * Look one variant up in its class map.
 *
 * `string | number` because a couple of the maps are keyed by a count rather
 * than a name — how many cards stand across a grid, for one — and writing
 * those keys as `"3"` to satisfy the signature reads as a string that is
 * really a number.
 */
export function variantClass<T extends string | number>(
  map: Record<T, string>,
  variant: T,
  extra?: string,
): string {
  return cn(map[variant], extra);
}
