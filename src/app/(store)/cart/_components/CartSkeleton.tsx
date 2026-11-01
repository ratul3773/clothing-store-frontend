import { Skeleton } from "@/components/ui/skeleton";

export default function CartSkeleton({ drawer = false }: { drawer?: boolean }) {
  return (
    <div role="status" aria-label="Loading your bag" className={drawer ? "flex min-h-0 flex-1 flex-col" : "grid items-start gap-8 lg:grid-cols-[1fr_22rem]"}>
      <span className="sr-only">Loading your bag…</span>
      <div aria-hidden="true" className={drawer ? "min-h-0 flex-1 overflow-y-auto px-5" : "min-w-0"}>
        <div className="flex items-center justify-between border-b border-border py-3">
          <Skeleton className="h-5 w-24" />
          <Skeleton className="h-8 w-20" />
        </div>
        {Array.from({ length: 3 }, (_, index) => (
          <div key={index} className="flex gap-3 border-b border-border py-5">
            <Skeleton className="mt-1 size-4 shrink-0" />
            <Skeleton className="h-28 w-20 shrink-0 rounded-sm" />
            <div className="flex min-w-0 flex-1 flex-col gap-2">
              <div className="flex items-start justify-between gap-2">
                <Skeleton className="h-5 w-3/4 max-w-56" />
                <Skeleton className="size-8 shrink-0" />
              </div>
              <Skeleton className="h-3 w-20" />
              <div className="mt-auto flex flex-wrap items-center justify-between gap-2">
                <Skeleton className="h-8 w-24 rounded-full" />
                <Skeleton className="h-4 w-16" />
              </div>
            </div>
          </div>
        ))}
      </div>
      <div aria-hidden="true" className={drawer ? "space-y-3 border-t border-border p-5" : "space-y-4 border border-border p-5"}>
        <div className="flex justify-between gap-3">
          <Skeleton className="h-5 w-40" />
          <Skeleton className="h-5 w-16" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-3/4" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-2/3" />
        </div>
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
      </div>
    </div>
  );
}
