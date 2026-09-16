import type {
  ComponentPropsWithoutRef,
  ElementType,
  ReactNode,
  Ref,
} from "react";
import { cn } from "@/shared/lib/cn";

type ContainerProps = {
  as?: ElementType;
  className?: string;
  children: ReactNode;
  /** A plain prop in React 19, so no forwardRef wrapper is needed. */
  ref?: Ref<HTMLElement>;
} & Omit<ComponentPropsWithoutRef<"div">, "className" | "children" | "ref">;

export function Container({
  as: Tag = "div",
  className,
  children,
  ref,
  ...props
}: ContainerProps) {
  return (
    <Tag
      ref={ref}
      className={cn(
        "mx-auto w-full max-w-[1440px] px-4 sm:px-6 lg:px-9",
        className,
      )}
      {...props}
    >
      {children}
    </Tag>
  );
}
