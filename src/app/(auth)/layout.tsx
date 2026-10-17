import { StoreShell } from "@/components/layout/StoreShell";

export default function AuthLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <StoreShell>{children}</StoreShell>;
}
