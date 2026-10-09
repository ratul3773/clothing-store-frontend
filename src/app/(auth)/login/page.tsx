import { StoreShell } from "@/components/layout/site-header";
import { AuthTabs } from "../_components/auth-form";

export default function LoginPage() {
  return (
    <StoreShell>
      <AuthTabs initialMode="login" />
    </StoreShell>
  );
}
