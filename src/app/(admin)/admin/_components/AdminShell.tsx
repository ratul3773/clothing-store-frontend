import { type ReactNode } from "react";

import { useCms } from "@/lib/useCms";

import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import AdminSidebar from "./admin-sidebar";
import SiteHeader from "./site-header";

type AdminShellProps = {
  children: ReactNode;
};



export default function AdminShell({
  children,
}: AdminShellProps) {
  return (
    <SidebarProvider>
      <div className="cms flex min-h-svh w-full text-[13px]">
        <AdminSidebar />
        <SidebarInset className="min-w-0">
          <SiteHeader />
          <main className="mx-auto w-full max-w-[1500] flex-1 p-4 sm:p-6 mb-20">
            {children}
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
