import { Skeleton } from "@/components/ui/skeleton";

export default function ComboFormSkeleton() {
  return (
    <div role="status" aria-label="Loading combo form" className="space-y-4">
      <span className="sr-only">Loading combo form...</span>
      <div aria-hidden="true" className="space-y-4 [&_[data-slot=skeleton]]:animate-none">
        <div className="space-y-2">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-9 w-full" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-24 w-full" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-4 w-40" />
          <Skeleton className="h-9 w-full" />
        </div>
        <div className="space-y-2 rounded border border-border bg-muted p-3">
          <Skeleton className="h-4 w-48 max-w-full" />
          <Skeleton className="h-3 w-64 max-w-full" />
          <Skeleton className="h-4 w-32" />
        </div>
        <div className="flex items-center gap-3">
          <Skeleton className="h-5 w-9 shrink-0 rounded-full" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-3 w-full max-w-lg" />
          </div>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          {[0, 1].map((index) => (
            <div key={index} className="space-y-2">
              <Skeleton className="h-4 w-48 max-w-full" />
              <Skeleton className="h-9 w-full" />
              <Skeleton className="h-3 w-40 max-w-full" />
            </div>
          ))}
        </div>
        <Skeleton className="h-4 w-40" />
        {[0, 1].map((index) => (
          <div key={index} className="flex flex-wrap items-center gap-3 rounded border border-border p-2">
            <Skeleton className="h-12 w-10 shrink-0" />
            <div className="min-w-0 flex-1 space-y-2">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
            </div>
            <Skeleton className="h-8 w-20" />
            <Skeleton className="h-8 w-16" />
          </div>
        ))}
        <Skeleton className="h-9 w-full" />
        <div className="sticky -bottom-4 -mx-5 -mb-4 flex justify-end gap-2 border-t border-border bg-card px-5 py-3">
          <Skeleton className="h-8 w-16" />
          <Skeleton className="h-8 w-24" />
        </div>
      </div>
    </div>
  );
}
