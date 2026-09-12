import type { ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/cn";
import { variantClass } from "@/lib/variants";

const navItemSizes = {
  base: "text-2xl font-bold tracking-tight sm:text-3xl",
  /** For the full-screen menu, where the links are the page. */
  display: "display-xl",
} as const;

export type NavItemSize = keyof typeof navItemSizes;

type NavItemProps = {
  href: string;
  label: string;
  index?: string;
  size?: NavItemSize;
  /** Marks the section currently under the viewport. */
  active?: boolean;
} & Omit<ComponentPropsWithoutRef<"a">, "href">;

/**
 * Menu entry. On hover the label rolls up and a celeste copy takes its place —
 * the duplicate is hidden from assistive tech, so the link is still announced
 * once.
 */
export function NavItem({
  href,
  label,
  index,
  size = "base",
  active = false,
  className,
  ...props
}: NavItemProps) {
  const label_ = variantClass(navItemSizes, size);

  return (
    <a
      href={href}
      data-active={active || undefined}
      aria-current={active ? "true" : undefined}
      className={cn(
        "group flex items-baseline gap-5 py-2 text-blanco",
        "focus-visible:outline-offset-4",
        className,
      )}
      {...props}
    >
      {index ? (
        <span
          className={cn(
            "section-index w-8 shrink-0 text-[0.65rem] transition-colors duration-300",
            "group-data-[active]:text-celeste",
          )}
        >
          {index}
        </span>
      ) : null}
      <span className="relative block overflow-hidden">
        <span
          className={cn(
            "block transition-transform duration-500 ease-[var(--ease-out-expo)]",
            "group-hover:-translate-y-full",
            label_,
          )}
        >
          {label}
        </span>
        <span
          aria-hidden="true"
          className={cn(
            "absolute inset-0 block translate-y-full text-celeste",
            "transition-transform duration-500 ease-[var(--ease-out-expo)]",
            "group-hover:translate-y-0",
            label_,
          )}
        >
          {label}
        </span>
      </span>
    </a>
  );
}
