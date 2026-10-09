"use client";

import Link from "next/link";
import type React from "react";
import {
  Heart,
  LogOut,
  MapPin,
  Package,
  Settings,
  UserRound,
} from "lucide-react";

import { customer } from "@/lib/data/account";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
} from "@/components/ui/sidebar";

const navigationItems = [
  { key: "overview", label: "Account overview", icon: UserRound },
  { key: "orders", label: "My orders", icon: Package },
  { key: "wishlist", label: "Wishlist", icon: Heart },
  { key: "addresses", label: "Addresses", icon: MapPin },
  { key: "settings", label: "Account settings", icon: Settings },
];

interface AccountSidebarProps {
  activeTab: string;
}

export function AccountSidebar({ activeTab }: AccountSidebarProps) {
  const initials = customer.name
    .split(" ")
    .map((word) => word[0])
    .join("");

  return (
    <SidebarProvider
      defaultOpen
      className="min-h-0 w-full items-start"
      style={{ "--sidebar-width": "18rem" } as React.CSSProperties}
    >
      <Sidebar
        collapsible="none"
        className="relative h-auto border-r-0 bg-transparent"
      >
        <SidebarContent className="p-0">
          <div className="mb-5 flex items-center gap-3 rounded-md bg-surface p-4">
            <div className="grid size-10 place-items-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
              {initials}
            </div>
            <div className="min-w-0">
              <p className="truncate font-bold text-foreground">
                {customer.name}
              </p>
              <p className="truncate text-xs text-muted-foreground">
                {customer.email}
              </p>
            </div>
          </div>

          <SidebarGroup className="p-0">
            <SidebarGroupLabel className="px-3 text-[10px] uppercase tracking-[0.16em]">
              Account
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {navigationItems.map(({ key, label, icon: Icon }) => (
                  <SidebarMenuItem key={key}>
                    <SidebarMenuButton
                      render={<Link href={`/account?tab=${key}`} />}
                      isActive={activeTab === key}
                      tooltip={label}
                      className="min-h-11 font-semibold"
                    >
                      <Icon />
                      <span>{label}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          <SidebarGroup className="mt-8 border-t border-border p-0 pt-5">
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  tooltip="Sign out"
                  className="min-h-11 font-semibold"
                >
                  <LogOut />
                  <span>Sign out</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
    </SidebarProvider>
  );
}

export function getAccountTabLabel(activeTab: string) {
  return navigationItems.find((item) => item.key === activeTab)?.label;
}

export const accountNavigationItems = navigationItems;
