"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  Bell,
  Box,
  ChevronDown,
  ChevronRight,
  CircleHelp,
  ClipboardList,
  CreditCard,
  Eye,
  LayoutDashboard,
  Moon,
  RotateCcw,
  Search,
  Settings2,
  Shirt,
  Sun,
  Truck,
  Users,
  WalletCards,
} from "lucide-react";
import { useTheme } from "next-themes";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
  SidebarSeparator,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

const storefrontLinks = [
  ["Homepage builder", "/admin/storefront/homepage"],
  ["Banners", "/admin/storefront/banners"],
  ["Pages & policies", "/admin/storefront/pages"],
  ["Coupons", "/admin/marketing/coupons"],
  ["Flash Sales", "/admin/marketing/flash-sales"],
  ["Bundles", "/admin/marketing/bundles"],
  ["Complete the look", "/admin/marketing/complete-the-look"],
  ["Reviews", "/admin/reviews"],
  ["Notifications", "/admin/notifications"],
] as const;
const navigation = [
  { label: "Overview", href: "/admin", icon: LayoutDashboard },
  { label: "Catalog", 
    href: "/admin/catalog",
    isActive:true,
    items:[
      ["Categories", "/admin/catalog/categories"],
      ["Collections", "/admin/catalog/collections"],
    ],
    icon: Shirt 
  },
  {
    label: "Storefront",
    isActive:true,
    items: storefrontLinks,
    icon: Eye,
  },
  { label: "Inventory", href: "/admin/inventory", icon: Box },
  { label: "Orders", href: "/admin/orders", icon: ClipboardList, badge: "24" },
  { label: "Customers", href: "/admin/customers", icon: Users },
  { label: "Promotions", href: "/admin/marketing/promotions", icon: WalletCards },
  { label: "Analytics", href: "/admin/analytics", icon: BarChart3 },
];


const operationLinks = [
  { label: "Exchanges", href: "/admin/exchanges", icon: RotateCcw },
  { label: "Refunds", href: "/admin/refunds", icon: WalletCards },
  { label: "Payments", href: "/admin/payments", icon: CreditCard },
  { label: "Shipping", href: "/admin/shipping", icon: Truck },
  { label: "Help center", href: "/admin/help", icon: CircleHelp },
];

function isNavigationActive(pathname: string, href: string) {
  return href === "/admin"
    ? pathname === href
    : pathname === href || pathname.startsWith(`${href}/`);
}

function CloseSidebarOnNavigation({ pathname }: { pathname: string }) {
  const { setOpenMobile } = useSidebar();

  React.useEffect(() => {
    setOpenMobile(false);
  }, [pathname, setOpenMobile]);

  return null;
}

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { resolvedTheme, setTheme } = useTheme();
  const [searchOpen, setSearchOpen] = React.useState(false);
  const [notifications, setNotifications] = React.useState(3);

  if (pathname === "/admin/login") return <>{children}</>;

  return (
    <SidebarProvider
      defaultOpen
      className="min-h-screen bg-background text-foreground"
      style={{ "--sidebar-width": "18rem" } as React.CSSProperties}
    >
      <CloseSidebarOnNavigation pathname={pathname} />
      <Sidebar>
        <SidebarHeader className="h-20 justify-center px-5 group-data-[collapsible=icon]:px-2">
          <Link
            href="/admin"
            className="flex items-center gap-3 group-data-[collapsible=icon]:justify-center"
            aria-label="NEEL admin home"
          >
            <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-primary text-lg font-black text-primary-foreground">
              N
            </span>
            <span className="font-serif text-xl font-semibold tracking-tight group-data-[collapsible=icon]:hidden">
              NEEL{" "}
              <span className="font-sans text-xs font-medium uppercase tracking-[0.22em] text-muted-foreground">
                Admin
              </span>
            </span>
          </Link>
        </SidebarHeader>
        <SidebarSeparator />
        <SidebarContent className="gap-0 px-3 py-5">
          <SidebarGroup className="p-0">
            <SidebarGroupLabel className="px-3 pb-3 text-[10px] font-bold uppercase tracking-[0.18em]">
              Workspace
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu className="gap-1">
                {navigation.map((item) => {
                  const Icon = item.icon;
                  if ("items" in item) {
                    return (
                      <Collapsible
                        key={item.label}
                        defaultOpen={!item.isActive}
                        className="group/collapsible"
                      >
                        <SidebarMenuItem>
                          <CollapsibleTrigger
                            render={
                              <SidebarMenuButton
                                tooltip={item.label}
                                className="min-h-10 rounded-lg px-3 font-medium"
                              />
                            }
                          >
                            <Icon />
                            <span>{item.label}</span>
                            <ChevronRight className="ml-auto transition-transform duration-200 group-data-open/collapsible:rotate-90" />
                          </CollapsibleTrigger>
                          <CollapsibleContent className="h-(--collapsible-panel-height) overflow-hidden transition-[height] duration-200 ease-out data-ending-style:h-0 data-starting-style:h-0 motion-reduce:transition-none">
                            <SidebarMenuSub>
                              {item.items?.map(([label, href]) => {
                                const subActive = isNavigationActive(
                                  pathname,
                                  href,
                                );

                                return (
                                  <SidebarMenuSubItem key={href}>
                                    <SidebarMenuSubButton
                                      render={<Link href={href} />}
                                      isActive={subActive}
                                      className={cn(
                                        "h-9",
                                        subActive &&
                                          "bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground",
                                      )}
                                    >
                                      <span>{label}</span>
                                    </SidebarMenuSubButton>
                                  </SidebarMenuSubItem>
                                );
                              })}
                            </SidebarMenuSub>
                          </CollapsibleContent>
                        </SidebarMenuItem>
                      </Collapsible>
                    );
                  }
                  const active = isNavigationActive(pathname, item.href);
                  return (
                    <SidebarMenuItem key={item.href}>
                      <SidebarMenuButton
                        render={<Link href={item.href} />}
                        isActive={active}
                        tooltip={item.label}
                        className={cn(
                          "min-h-10 rounded-lg px-3 font-medium",
                          active &&
                            "bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground",
                        )}
                      >
                        <Icon />
                        <span>{item.label}</span>
                      </SidebarMenuButton>
                      {item.badge && (
                        <SidebarMenuBadge
                          className={cn(
                            active &&
                              "text-primary-foreground peer-data-active/menu-button:text-primary-foreground",
                          )}
                        >
                          {item.badge}
                        </SidebarMenuBadge>
                      )}
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          <SidebarSeparator className="my-6" />

          <SidebarGroup className="p-0">
            <SidebarGroupLabel className="px-3 pb-3 text-[10px] font-bold uppercase tracking-[0.18em]">
              Manage
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu className="gap-1">
                <SidebarMenuItem>
                  <SidebarMenuButton
                    render={<Link href="/admin/settings" />}
                    isActive={isNavigationActive(pathname, "/admin/settings")}
                    tooltip="Settings"
                    className="min-h-10 rounded-lg px-3 font-medium"
                  >
                    <Settings2 />
                    <span>Settings</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <li className="px-3 pb-2 pt-4 text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground group-data-[collapsible=icon]:hidden">
                  Operations
                </li>
                {operationLinks.map(({ label, href, icon: Icon }) => (
                  <SidebarMenuItem key={href}>
                    <SidebarMenuButton
                      render={<Link href={href} />}
                      isActive={isNavigationActive(pathname, href)}
                      tooltip={label}
                      className={cn(
                        "min-h-10 rounded-lg px-3 font-medium",
                        isNavigationActive(pathname, href) &&
                          "bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground",
                      )}
                    >
                      <Icon />
                      <span>{label}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter className="border-t border-sidebar-border p-3">
          <button
            type="button"
            className="flex w-full items-center gap-3 rounded-lg p-2 text-left hover:bg-sidebar-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sidebar-ring"
            onClick={() =>
              setTheme(resolvedTheme === "dark" ? "light" : "dark")
            }
            aria-label={`Switch to ${resolvedTheme === "dark" ? "light" : "dark"} theme`}
          >
            <Avatar className="size-9 shrink-0">
              <AvatarFallback>AR</AvatarFallback>
            </Avatar>
            <span className="min-w-0 flex-1 group-data-[collapsible=icon]:hidden">
              <span className="block truncate text-sm font-semibold">
                Ayaan Rahman
              </span>
              <span className="block truncate text-xs text-muted-foreground">
                Store owner
              </span>
            </span>
            <ChevronDown className="size-4 text-muted-foreground group-data-[collapsible=icon]:hidden" />
          </button>
        </SidebarFooter>
      </Sidebar>

      <SidebarInset className="min-h-screen">
        <header className="sticky top-0 z-20 flex h-20 items-center justify-between gap-4 border-b border-border bg-background/90 px-4 backdrop-blur md:px-8">
          <div className="flex min-w-0 items-center gap-3">
            <SidebarTrigger aria-label="Toggle admin navigation" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden sm:inline-flex">
                  <BreadcrumbLink href="/admin">Workspace</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden sm:inline-flex">
                  <ChevronRight />
                </BreadcrumbSeparator>
                <BreadcrumbItem>
                  <BreadcrumbPage>
                    {pathname === "/admin"
                      ? "Overview"
                      : pathname.split("/").at(-1)?.replaceAll("-", " ")}
                  </BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
          <div className="flex items-center gap-1.5">
            <div
              className={cn(
                "hidden items-center gap-2 md:flex",
                searchOpen && "flex",
              )}
            >
              <Search className="text-muted-foreground" aria-hidden="true" />
              <Input
                aria-label="Search admin"
                placeholder="Search anything"
                className="h-9 w-44 border-0 bg-muted/60 focus-visible:ring-1"
              />
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setSearchOpen((current) => !current)}
              aria-label="Search"
            >
              <Search data-icon="inline-start" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() =>
                setTheme(resolvedTheme === "dark" ? "light" : "dark")
              }
              aria-label="Toggle theme"
            >
              {resolvedTheme === "dark" ? (
                <Sun data-icon="inline-start" />
              ) : (
                <Moon data-icon="inline-start" />
              )}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="relative"
              onClick={() => setNotifications(0)}
              aria-label={`${notifications} unread notifications`}
            >
              <Bell data-icon="inline-start" />
              {notifications > 0 && (
                <span className="absolute right-2 top-2 size-2 rounded-full bg-destructive" />
              )}
            </Button>
          </div>
        </header>
        <div className="container-page py-8 md:py-10">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
