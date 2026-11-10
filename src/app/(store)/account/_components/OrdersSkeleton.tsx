import { Skeleton } from "@/components/ui/skeleton";

export default function OrdersSkeleton({ count }: { count: number }) {
  return (
    <div className="space-y-4" role="status" aria-label="Loading orders">
      <div aria-hidden="true" className="space-y-4">
        {Array.from({ length: count }, (_, index) => (
          <div
            key={index}
            className="flex flex-wrap items-center justify-between gap-4 rounded border border-border bg-card/70 p-5"
          >
            <div className="space-y-2">
              <Skeleton className="h-6 w-36" />
              <Skeleton className="h-5 w-48" />
              <div className="flex gap-3">
                <Skeleton className="h-6 w-28 rounded-full" />
                <Skeleton className="h-6 w-20" />
              </div>
            </div>
            <Skeleton className="h-8 w-28" />
          </div>
        ))}
      </div>
      <span className="sr-only">Loading orders...</span>
    </div>
  );
}
