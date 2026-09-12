import NextImage, { type ImageProps } from "next/image";
import { cn } from "@/lib/cn";

type AppImageProps = ImageProps;

export function Image({ className, alt, ...props }: AppImageProps) {
  return <NextImage alt={alt} className={cn(className)} {...props} />;
}
