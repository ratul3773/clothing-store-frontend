import { getServerSession } from "@/lib/auth-session";
import { AccountDashboard } from "./account-dashboard";
import { redirect } from "next/navigation";

export default async function AccountPage() {
const session = await getServerSession();
if (!session.isAuthenticated) {
    redirect("/login");
}
  return (
      <AccountDashboard customer={{
        name:session.name,
        email:session.email
      }} />
  );
}
