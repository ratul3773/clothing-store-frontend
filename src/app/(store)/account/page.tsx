import { StoreShell } from "@/components/layout/StoreShell";
import { AccountDashboard } from "./_components/account-dashboard";
import { Suspense } from "react";

export default function AccountPage() {
  return (
     <Suspense  fallback={<div>Loading...</div>}>
      <AccountDashboard />
      </Suspense>
  );
}
