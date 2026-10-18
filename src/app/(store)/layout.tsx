import { StoreShell } from "@/components/layout/StoreShell";

export default function StoreLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <StoreShell>{children}</StoreShell>;
}
