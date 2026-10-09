import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface StatePanelProps {
  icon: LucideIcon;
  title: string;
  description?: ReactNode;
  actions?: ReactNode;
  tone?: "neutral" | "error";
  className?: string;
}

/** Shared empty / error state. Always pairs a plain-language message with a next step. */
export function StatePanel({
  icon: Icon,
  title,
  description,
  actions,
  tone = "neutral",
  className,
}: StatePanelProps) {
  return (
    <div
      role={tone === "error" ? "alert" : undefined}
      className={cn(
        "flex flex-col items-center gap-4 rounded-lg border border-dashed px-6 py-14 text-center",
        tone === "error"
          ? "border-destructive/30 bg-destructive/[0.03]"
          : "border-border bg-card",
        className,
      )}
    >
      <span
        className={cn(
          "flex size-12 items-center justify-center rounded-full",
          tone === "error"
            ? "bg-destructive/10 text-destructive"
            : "bg-muted text-foreground",
        )}
      >
        <Icon className="size-5" aria-hidden />
      </span>
      <div className="flex max-w-sm flex-col gap-1.5">
        <h2 className="type-h3 text-balance">{title}</h2>
        {description && (
          <p className="text-sm leading-relaxed text-muted-foreground text-pretty">
            {description}
          </p>
        )}
      </div>
      {actions && (
        <div className="flex flex-wrap items-center justify-center gap-3">
          {actions}
        </div>
      )}
    </div>
  );
}
