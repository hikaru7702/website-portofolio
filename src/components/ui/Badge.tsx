import type { ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

type BadgeTone = "default" | "accent" | "outline" | "success";

const tones: Record<BadgeTone, string> = {
  default: "border-border bg-muted text-muted-foreground",
  accent: "border-accent/20 bg-accent-soft text-accent",
  outline: "border-border bg-transparent text-muted-foreground",
  success:
    "border-emerald-500/20 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
};

export function Badge({
  children,
  tone = "default",
  className,
}: {
  children: ReactNode;
  tone?: BadgeTone;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium leading-none",
        tones[tone],
        className
      )}
    >
      {children}
    </span>
  );
}
