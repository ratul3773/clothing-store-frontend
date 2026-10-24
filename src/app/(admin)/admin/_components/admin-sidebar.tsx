"use client";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,

} from "@/components/ui/sidebar";
import Link from "next/link";
import { NAV } from "../_constants/nav.constants";
import { Store } from "lucide-react";
import { settings } from "@/data/site";
import { usePathname } from "next/navigation";


export default function AdminSidebar() {
  const pathname = usePathname().replace(/\/+$/, "") || "/admin";

  const active = (href: string) =>
    href === "/admin"
      ? pathname === "/admin"
      : pathname === href || pathname.startsWith(`${href}/`);
    return (
        <Sidebar collapsible="offcanvas">
          <SidebarHeader>
            <Link
              href="/admin"
              className="flex h-10 items-center gap-2 px-2"
            >
              <span className="grid size-7 shrink-0 place-items-center rounded-md bg-primary text-primary-foreground">
                <Store className="size-4" />
              </span>

              <span className="min-w-0 leading-tight">
                <span className="block truncate text-sm font-semibold">
                  {settings.store.name}
                </span>
                <span className="block text-[11px] text-muted-foreground">
                  Admin console
                </span>
              </span>
            </Link>
          </SidebarHeader>

          <SidebarContent>
            {NAV.map((group) => (
              <SidebarGroup key={group.title}>
                <SidebarGroupLabel>{group.title}</SidebarGroupLabel>

                <SidebarMenu>
                  {group.items.map((item) => (
                    <SidebarMenuItem key={item.href}>
                      <SidebarMenuButton
                        asChild
                        isActive={active(item.href)}
                        tooltip={item.label}
                      >
                        <Link href={item.href}>
                          <item.icon className="size-4" />
                          <span>{item.label}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroup>
            ))}
          </SidebarContent>

          <SidebarFooter>
            <div className="border-t border-sidebar-border px-2 pt-3 text-xs text-sidebar-foreground">
              <p className="font-medium">{settings.admin.name}</p>
              <p className="truncate text-muted-foreground">
                {settings.admin.email}
              </p>
            </div>
          </SidebarFooter>
        </Sidebar>
    )
}