import { Skeleton } from "@/components/ui/skeleton";

export default function ProductDetailSkeleton() {
  return (
    <div aria-label="Loading product details" aria-busy="true" role="status" className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton className="h-8 w-64 rounded-sm" />
          <Skeleton className="h-3 w-44 rounded-sm" />
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-9 w-16 rounded" />
          <Skeleton className="h-9 w-28 rounded" />
        </div>
      </div>
      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="space-y-4">
          {Array.from({ length: 3 }, (_, index) => (
            <div key={index} className="rounded-lg border border-border p-4">
              <Skeleton className="mb-5 h-5 w-32 rounded-sm" />
              <div className="grid gap-4 sm:grid-cols-2">
                <Skeleton className="h-10 w-full rounded" />
                <Skeleton className="h-10 w-full rounded" />
                <Skeleton className="h-24 w-full rounded sm:col-span-2" />
              </div>
            </div>
          ))}
        </div>
        <div className="space-y-4">
          <Skeleton className="aspect-[4/5] w-full rounded-lg" />
          <Skeleton className="h-44 w-full rounded-lg" />
        </div>
      </div>
      <span className="sr-only">Loading product details...</span>
    </div>
  );
}
