
import { Skeleton } from "@/components/ui/skeleton";

export default function ProductCardSkeleton() {
  return (
    <div
      aria-hidden="true"
      className="min-w-0"
    >
      {/* Product image */}
      <Skeleton className="aspect-[4/5] w-full rounded-[3px]" />

      {/* Name and price */}
      <div className="mt-4 flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1 space-y-2">
          <Skeleton className="h-3 w-2/3 rounded-sm" />
          <Skeleton className="h-5 w-4/5 rounded-sm" />
        </div>

        <div className="flex shrink-0 flex-col items-end gap-2">
          <Skeleton className="h-4 w-16 rounded-sm" />
          <Skeleton className="h-3 w-12 rounded-sm" />
        </div>
      </div>

      {/* Color swatches and discount */}
      <div className="mt-3 flex items-center gap-2">
        <Skeleton className="size-3.5 rounded-full" />
        <Skeleton className="size-3.5 rounded-full" />
        <Skeleton className="size-3.5 rounded-full" />
        <Skeleton className="ml-auto h-3 w-10 rounded-sm" />
      </div>
    </div>
  );
}
