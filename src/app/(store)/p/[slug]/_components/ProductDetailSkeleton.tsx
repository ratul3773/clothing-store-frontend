import { Skeleton } from "@/components/ui/skeleton";

export default function ProductDetailSkeleton() {
  return (
    <div aria-label="Loading product details" role="status">
      <Skeleton className="mb-6 h-3 w-56 rounded-sm" />

      <div className="grid gap-10 lg:grid-cols-[1.1fr_1fr] lg:gap-16">
        <div className="grid grid-cols-[4.5rem_1fr] gap-4">
          <div className="space-y-3">
            {Array.from({ length: 4 }, (_, index) => (
              <Skeleton key={index} className="aspect-[4/5] w-full rounded-[3px]" />
            ))}
          </div>
          <Skeleton className="aspect-[4/5] w-full rounded-[3px]" />
        </div>

        <div className="lg:pt-2">
          <Skeleton className="mb-4 h-3 w-24 rounded-sm" />
          <Skeleton className="h-12 w-4/5 rounded-sm" />
          <Skeleton className="mt-4 h-4 w-28 rounded-sm" />

          <div className="mt-8 border-y border-border py-6">
            <Skeleton className="h-3 w-16 rounded-sm" />
            <div className="mt-4 flex gap-3">
              {Array.from({ length: 4 }, (_, index) => (
                <Skeleton key={index} className="size-9 rounded-full" />
              ))}
            </div>
          </div>

          <div className="py-6">
            <Skeleton className="h-3 w-16 rounded-sm" />
            <div className="mt-4 flex gap-2">
              {Array.from({ length: 5 }, (_, index) => (
                <Skeleton key={index} className="h-11 w-14 rounded-[3px]" />
              ))}
            </div>
          </div>

          <div className="flex gap-3">
            <Skeleton className="h-12 flex-1 rounded-[3px]" />
            <Skeleton className="h-12 w-12 rounded-[3px]" />
          </div>

          <div className="mt-10 border-t border-border pt-6">
            <div className="flex gap-6 border-b border-border pb-3">
              <Skeleton className="h-3 w-16 rounded-sm" />
              <Skeleton className="h-3 w-20 rounded-sm" />
              <Skeleton className="h-3 w-16 rounded-sm" />
            </div>
            <Skeleton className="mt-6 h-24 w-full rounded-[3px]" />
          </div>
        </div>
      </div>

      <div className="mt-16 grid gap-4 sm:grid-cols-3">
        {Array.from({ length: 3 }, (_, index) => (
          <Skeleton key={index} className="h-28 rounded-[3px]" />
        ))}
      </div>
      <span className="sr-only">Loading product details...</span>
    </div>
  );
}
