import { StoreShell } from "@/components/layout/site-header";
import { AccountDashboard } from "./_components/account-dashboard";
import { Suspense } from "react";

export default function AccountPage() {
  return (
    <StoreShell>
     <Suspense  fallback={<div>Loading...</div>}>
      <AccountDashboard />
      </Suspense>
    </StoreShell>
  );
}
