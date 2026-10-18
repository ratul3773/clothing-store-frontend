import { Suspense } from "react";
import AccountPage from "./_components/account-page";
import { AccountPageSkeleton } from "./_components/account-skeleton";

export default function Page() {
  return (
    <Suspense fallback={<AccountPageSkeleton />}>
      <AccountPage />
    </Suspense>
  );
}
