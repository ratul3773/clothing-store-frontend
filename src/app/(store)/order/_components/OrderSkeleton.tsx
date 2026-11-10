import { Skeleton } from "@/components/ui/skeleton";

export default function OrderSkeleton({ contentOnly = false }: { contentOnly?: boolean }) {
  return (
    <div
      className={contentOnly ? "space-y-6" : "space-y-6 py-8"}
      role="status"
      aria-label="Loading order"
    >
      <div aria-hidden="true" className="space-y-6">
        {!contentOnly && (
          <div className="flex flex-wrap justify-between gap-3">
            <Skeleton className="h-9 w-40" />
            <Skeleton className="h-10 w-44" />
          </div>
        )}
        <div className="space-y-6 border border-border p-5">
          <div className="flex flex-wrap justify-between gap-3 border-b border-border pb-4">
            <div className="space-y-2">
              <Skeleton className="h-5 w-44" />
              <Skeleton className="h-4 w-36" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-5 w-28 rounded-full" />
              <Skeleton className="h-4 w-24" />
            </div>
          </div>
          <div className="divide-y divide-border">
            {[0, 1].map((index) => (
              <div key={index} className="py-4 first:pt-0">
                <div className="flex justify-between gap-3">
                  <Skeleton className="h-15 w-12 shrink-0" />
                  <div className="min-w-0 flex-1 space-y-2">
                    <Skeleton className="h-5 w-3/4 max-w-64" />
                    <Skeleton className="h-4 w-20" />
                  </div>
                  <Skeleton className="h-5 w-16 shrink-0" />
                </div>
                <Skeleton className="mt-2 h-4 w-2/3 max-w-80" />
              </div>
            ))}
          </div>
          <div className="space-y-2 border-t border-border pt-4">
            {[0, 1, 2, 3].map((index) => (
              <div key={index} className="flex justify-between gap-3">
                <Skeleton className={index === 3 ? "h-6 w-40" : "h-5 w-20"} />
                <Skeleton className={index === 3 ? "h-6 w-20" : "h-5 w-16"} />
              </div>
            ))}
          </div>
          <div className="space-y-2 border-t border-border pt-4">
            <Skeleton className="h-5 w-24" />
            <Skeleton className="h-4 w-3/4 max-w-72" />
            <Skeleton className="h-4 w-full max-w-96" />
          </div>
        </div>
        <div className="flex flex-wrap gap-3">
          <Skeleton className="h-10 w-28" />
          <Skeleton className="h-10 w-32" />
          <Skeleton className="h-10 w-28" />
        </div>
        <div className="space-y-3">
          <Skeleton className="h-6 w-28" />
          <div className="space-y-3 border-l border-border pl-4">
            {[0, 1].map((index) => (
              <div key={index} className="space-y-2">
                <Skeleton className="h-5 w-36 rounded-full" />
                <Skeleton className="h-4 w-40" />
              </div>
            ))}
          </div>
        </div>
      </div>
      <span className="sr-only">Loading order...</span>
    </div>
  );
}
