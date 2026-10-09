import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface RatingStarsProps {
  rating: number;
  reviewCount?: number;
  size?: "sm" | "md";
  className?: string;
}

export function RatingStars({
  rating,
  reviewCount,
  size = "sm",
  className,
}: RatingStarsProps) {
  const iconSize = size === "sm" ? "size-3.5" : "size-4";
  return (
    <div className={cn("flex items-center gap-1.5", className)}>
      <span className="sr-only">{`Rated ${rating.toFixed(1)} out of 5`}</span>
      <span aria-hidden className="flex items-center gap-0.5">
        {Array.from({ length: 5 }, (_, i) => {
          const fill = Math.max(0, Math.min(1, rating - i));
          return (
            <span key={i} className={cn("relative", iconSize)}>
              <Star
                className={cn("absolute inset-0 text-border", iconSize)}
                fill="currentColor"
                strokeWidth={0}
              />
              <span
                className="absolute inset-0 overflow-hidden"
                style={{ width: `${fill * 100}%` }}
              >
                <Star
                  className={cn("text-accent", iconSize)}
                  fill="currentColor"
                  strokeWidth={0}
                />
              </span>
            </span>
          );
        })}
      </span>
      <span
        aria-hidden
        className={cn(
          "tabular-nums font-medium",
          size === "sm" ? "text-xs" : "text-sm",
        )}
      >
        {rating.toFixed(1)}
      </span>
      {reviewCount !== undefined && (
        <span
          className={cn(
            "text-muted-foreground tabular-nums",
            size === "sm" ? "text-xs" : "text-sm",
          )}
        >
          {`(${reviewCount}`}
          <span className="sr-only"> reviews</span>
          {")"}
        </span>
      )}
    </div>
  );
}
