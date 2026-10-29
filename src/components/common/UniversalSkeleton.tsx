import { Skeleton } from "@/components/ui/skeleton";

export default function UniversalSkeleton() {
  return (
    <div
      aria-label="Loading page"
      aria-busy="true"
      className="min-h-screen bg-background"
      role="status"
    >
      <div className="border-b border-border">
        <div className="mx-auto flex h-16 max-w-340 items-center gap-6 px-5 lg:px-10">
          <Skeleton className="h-7 w-32 rounded-sm" />
          <div className="hidden items-center gap-5 lg:flex">
            <Skeleton className="h-3 w-10 rounded-sm" />
            <Skeleton className="h-3 w-16 rounded-sm" />
            <Skeleton className="h-3 w-16 rounded-sm" />
            <Skeleton className="h-3 w-14 rounded-sm" />
          </div>
          <div className="ml-auto flex items-center gap-2">
            <Skeleton className="size-9 rounded-full" />
            <Skeleton className="size-9 rounded-full" />
            <Skeleton className="size-9 rounded-full" />
          </div>
        </div>
      </div>

      <main className="mx-auto max-w-330 px-5 py-10 lg:px-10 lg:py-16">
        <Skeleton className="mb-8 h-3 w-40 rounded-sm" />
        <Skeleton className="h-14 w-2/3 max-w-xl rounded-sm" />
        <Skeleton className="mt-4 h-4 w-full max-w-lg rounded-sm" />

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }, (_, index) => (
            <div key={index} className="space-y-4">
              <Skeleton className="aspect-[4/5] w-full rounded-[3px]" />
              <Skeleton className="h-3 w-2/3 rounded-sm" />
              <Skeleton className="h-4 w-1/2 rounded-sm" />
            </div>
          ))}
        </div>
      </main>

      <div className="border-t border-border">
        <div className="mx-auto flex max-w-330 items-center justify-between px-5 py-8 lg:px-10">
          <Skeleton className="h-4 w-32 rounded-sm" />
          <Skeleton className="h-3 w-24 rounded-sm" />
        </div>
      </div>
      <span className="sr-only">Loading page content...</span>
    </div>
  );
}
