import { getServerSession } from "@/lib/auth-session";
import { AuthForm } from "../_components/auth-form";
import { redirect } from "next/navigation";

export default async function LoginPage() {
  const session = await getServerSession();
  if (session.isAuthenticated) {
    redirect("/account");
  }
  return (
      <div className="p-4 sm:p-6 md:p-8 flex items-center justify-center w-full">
          <AuthForm />
        </div>
  );
}
