import { Suspense } from "react";
import { FlashSalesPage } from "@/app/admin/marketing/flash-sales/_components/flash-sales-page";

export default function Page() {
  return (
    <Suspense
      fallback={
        <div className="p-6 text-sm text-muted-foreground">
          Loading flash sales…
        </div>
      }
    >
      <FlashSalesPage />
    </Suspense>
  );
}
