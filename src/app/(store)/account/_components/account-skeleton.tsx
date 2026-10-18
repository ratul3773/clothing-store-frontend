import { Skeleton } from "@/components/ui/skeleton";

export function AccountPageSkeleton() {
  return (
    <main
      aria-busy="true"
      aria-label="Loading account"
      className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14"
    >
      <p role="status" className="sr-only">
        Loading your account
      </p>
      <div className="mb-10 border-b border-border pb-8" aria-hidden="true">
        <Skeleton className="h-3 w-24" />
        <Skeleton className="mt-3 h-5 w-full max-w-xl" />
      </div>

      <div
        className="grid gap-8 lg:grid-cols-[250px_1fr] lg:gap-14"
        aria-hidden="true"
      >
        <aside>
          <div className="mb-5 flex items-center gap-3 rounded-md bg-surface p-4">
            <Skeleton className="size-10 rounded-full" />
            <div className="min-w-0 flex-1 space-y-2">
              <Skeleton className="h-4 w-28 max-w-full" />
              <Skeleton className="h-3 w-36 max-w-full" />
            </div>
          </div>

          <div className="space-y-2">
            <Skeleton className="mb-3 ml-3 h-3 w-14" />
            {Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className="flex min-h-11 items-center gap-3 px-3">
                <Skeleton className="size-4 shrink-0 rounded-sm" />
                <Skeleton className="h-4 w-32 max-w-full" />
              </div>
            ))}
          </div>

          <div className="mt-8 border-t border-border pt-5">
            <div className="flex min-h-11 items-center gap-3 px-3">
              <Skeleton className="size-4 shrink-0 rounded-sm" />
              <Skeleton className="h-4 w-20" />
            </div>
          </div>
        </aside>

        <section className="min-w-0">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="mt-3 h-9 w-64 max-w-full" />

          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="border border-border p-5">
                <Skeleton className="h-3 w-24" />
                <Skeleton className="mt-3 h-9 w-14" />
              </div>
            ))}
          </div>

          <div className="mt-10 border-t border-border pt-8">
            <div className="flex items-end justify-between gap-4">
              <div className="space-y-2">
                <Skeleton className="h-7 w-44" />
                <Skeleton className="h-4 w-64 max-w-full" />
              </div>
              <Skeleton className="mb-1 h-4 w-14 shrink-0" />
            </div>
            <div className="mt-5 grid gap-3">
              {Array.from({ length: 2 }).map((_, index) => (
                <article
                  key={index}
                  className="border border-border p-4 sm:p-5"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="space-y-2">
                      <Skeleton className="h-5 w-28" />
                      <Skeleton className="h-3 w-32" />
                    </div>
                    <Skeleton className="h-6 w-20 rounded-full" />
                  </div>
                  <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
                    <Skeleton className="h-4 w-28" />
                    <Skeleton className="h-9 w-24 rounded-md" />
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}