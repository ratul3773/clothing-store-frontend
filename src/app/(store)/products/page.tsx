import { Suspense } from "react";
import ProductsPage from "./_components/products-page";
function ShopPageFallback() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="animate-pulse">
        <div className="h-3 w-32 rounded bg-muted" />
        <div className="mt-4 h-14 max-w-md rounded bg-muted" />
        <div className="mt-4 h-4 max-w-lg rounded bg-muted" />

        <div className="mt-8 border-y border-border py-4">
          <div className="h-9 w-40 rounded bg-muted" />
        </div>

        <div className="grid grid-cols-2 gap-4 py-8 md:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="space-y-3">
              <div className="aspect-[3/4] rounded-lg bg-muted" />
              <div className="h-4 w-3/4 rounded bg-muted" />
              <div className="h-4 w-1/3 rounded bg-muted" />
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
export default function Page() {
  return (
    <Suspense fallback={<ShopPageFallback />}>
      <ProductsPage />
    </Suspense>
  );
}
