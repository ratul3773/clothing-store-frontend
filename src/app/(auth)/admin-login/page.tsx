import { getServerSession } from "@/lib/auth-session";
import AdminLogin from "./_components/AdminLogin";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import Loading from "@/components/common/Loading";

async function Gate({ children }: { children: React.ReactNode }) {
  const session = await getServerSession();
  if (session.isAuthenticated) redirect("/");
  return <>{children}</>;
}
export default function Page(){
    return (
        <Suspense fallback={<Loading text="Loading admin login..." />}>
        <Gate>
        <AdminLogin/>
        </Gate>
        </Suspense>
    );
}