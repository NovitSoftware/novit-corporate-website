import { cn } from "@/lib/cn";

type DividerProps = {
  className?: string;
  tone?: "light" | "dark";
};

/**
 * A rule that fades out along its length instead of stopping dead, so it reads
 * as a boundary rather than a border.
 */
export function Divider({ className, tone = "light" }: DividerProps) {
  return (
    <hr
      className={cn(
        "h-px w-full border-0",
        tone === "dark"
          ? "bg-[linear-gradient(90deg,rgb(255_255_255/0.22),rgb(255_255_255/0.06)_55%,transparent)]"
          : "bg-[linear-gradient(90deg,rgb(var(--rgb-azul)/0.22),rgb(var(--rgb-azul)/0.06)_55%,transparent)]",
        className,
      )}
    />
  );
}
