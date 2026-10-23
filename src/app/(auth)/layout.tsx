import Shell from "@/components/layout/AppShell";
import { getServerSession } from "@/lib/auth-session";
import { redirect } from "next/navigation";
import { Suspense } from "react";

async function Gate() {
  const session = await getServerSession();
  if (session.isAuthenticated) redirect("/");
  return null;
}

export default function AuthLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <Shell>
      <Suspense fallback={null}>
        <Gate />
      </Suspense>
      {children}
    </Shell>
  );
}