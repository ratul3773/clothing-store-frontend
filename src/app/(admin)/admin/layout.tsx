import type { Metadata } from "next";
import AdminShell from "./_components/AdminShell";
import { getServerSession } from "@/lib/auth-session";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import Loading from "@/components/common/Loading";

export const metadata: Metadata = {
  title: "Admin workspace",
  description: "NEEL commerce operations workspace.",
};

async function Gate({ children }: { children: React.ReactNode }) {
  const session = await getServerSession();
  if (!session.isAuthenticated) redirect("/admin-login");
  if(session.role !== "admin") redirect("/");
  return <>{children}</>;
}

export default function AdminLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <Suspense fallback={<Loading/>}>
    <Gate>
      <AdminShell>{children}</AdminShell>
    </Gate>
    </Suspense>
  );
}
