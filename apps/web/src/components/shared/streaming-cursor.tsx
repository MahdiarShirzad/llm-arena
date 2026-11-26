import { cn } from "@/lib/utils";

export function StreamingCursor({ className }: { className?: string }) {
  return (
    <span
      aria-hidden
      className={cn(
        "ml-0.5 inline-block h-3.5 w-1.5 translate-y-0.5 rounded-[1px] bg-highlight align-baseline motion-safe:animate-blink",
        className,
      )}
    />
  );
}
