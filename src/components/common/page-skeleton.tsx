import { Skeleton } from "@/components/ui/skeleton";

export function StorePageSkeleton() {
  return (
    <main className="mx-auto flex max-w-7xl flex-col gap-8 px-4 py-10 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-3">
        <Skeleton className="h-3 w-24" />
        <Skeleton className="h-12 w-72" />
        <Skeleton className="h-5 w-full max-w-xl" />
      </div>
      <div className="grid gap-8 lg:grid-cols-[210px_1fr]">
        <aside className="hidden gap-4 lg:flex lg:flex-col">
          <Skeleton className="h-5 w-28" />
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-24 w-full" />
        </aside>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="flex flex-col gap-3">
              <Skeleton className="aspect-[4/5] w-full rounded-lg" />
              <Skeleton className="h-3 w-20" />
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-4 w-24" />
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}

export function AdminPageSkeleton() {
  return (
    <main className="flex flex-col gap-6 p-6 lg:p-8">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-2">
          <Skeleton className="h-8 w-56" />
          <Skeleton className="h-4 w-80" />
        </div>
        <Skeleton className="h-10 w-28" />
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <Skeleton className="h-28 rounded-xl" />
        <Skeleton className="h-28 rounded-xl" />
        <Skeleton className="h-28 rounded-xl" />
      </div>
      <Skeleton className="h-72 rounded-xl" />
    </main>
  );
}

export function AuthPageSkeleton() {
  return (
    <main className="grid min-h-screen place-items-center p-6">
      <div className="flex w-full max-w-md flex-col gap-5">
        <Skeleton className="mx-auto h-10 w-32" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
      </div>
    </main>
  );
}
