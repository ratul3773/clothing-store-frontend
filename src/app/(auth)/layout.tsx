import { StoreShell } from "@/components/layout/StoreShell";
import { getServerSession } from "@/lib/auth-session";
import { redirect } from "next/navigation";
import { Suspense } from "react";

async function Gate({ children }: { children: React.ReactNode }) {
  const session = await getServerSession();
  if (session.isAuthenticated) redirect("/");
  return <>{children}</>;
}

export default function AuthLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <Suspense fallback={<div className="h-9 w-20 animate-pulse rounded bg-muted" />}>
      <Gate>
        <StoreShell>{children}</StoreShell>
      </Gate>
    </Suspense>
  );
}
