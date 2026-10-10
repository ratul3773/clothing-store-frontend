import { StoreShell } from "@/components/layout/site-header";

export default function StoreLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <StoreShell>{children}</StoreShell>;
}
