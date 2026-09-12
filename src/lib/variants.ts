import { cn } from "@/lib/cn";

export function variantClass<T extends string>(
  map: Record<T, string>,
  variant: T,
  extra?: string,
): string {
  return cn(map[variant], extra);
}
