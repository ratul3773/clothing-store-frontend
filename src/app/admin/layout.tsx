import type { Metadata } from "next";
import { AdminShell } from "@/components/admin/admin-shell";
import { getServerSession } from "@/lib/auth-session";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Admin workspace",
  description: "NEEL commerce operations workspace.",
};

async function Gate({ children }: { children: React.ReactNode }) {
  const session = await getServerSession();
  if (!session.isAuthenticated) redirect("/admin/login");
  if(session.role !== "admin") redirect("/");
  return <>{children}</>;
}

export default function AdminLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <Gate>
      <AdminShell>{children}</AdminShell>
    </Gate>
  );
}
