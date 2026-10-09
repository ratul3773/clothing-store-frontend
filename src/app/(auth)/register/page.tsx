import { StoreShell } from "@/components/layout/site-header";
import { AuthTabs } from "../_components/auth-form";

export default function RegisterPage() {
  return (
    <StoreShell>
      <AuthTabs initialMode="register" />
    </StoreShell>
  );
}
