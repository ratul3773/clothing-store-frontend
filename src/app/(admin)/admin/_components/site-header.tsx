"use client"
import ThemeToggle from "@/components/common/ThemeToggle";
import { CmsButton } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useLogout } from "@/hooks/useLogout";
import { ExternalLink, LogOut, Menu } from "lucide-react";
import { NAV } from "../_constants/nav.constants";
import { usePathname } from "next/navigation";

export default function SiteHeader() {
    const { handleSignOut, isSigningOut } = useLogout();
    const pathname = usePathname().replace(/\/+$/, "") || "/admin";

  const active = (href: string) =>
    href === "/admin"
      ? pathname === "/admin"
      : pathname === href || pathname.startsWith(`${href}/`);

  const current = NAV.flatMap((group) => group.items).find((item) =>
    active(item.href),
  );
    return(
        <header className="sticky top-0 z-20 flex h-14 items-center justify-between gap-3 border-b border-border bg-card px-4">
            <div className="flex min-w-0 items-center gap-2">
              <SidebarTrigger aria-label="Toggle sidebar">
                <Menu className="size-4" />
              </SidebarTrigger>

              <span className="truncate text-sm font-medium">
                {current?.label ?? "Admin"}
              </span>
            </div>

            <div className="flex shrink-0 items-center gap-2">
              <ThemeToggle />

              <a
                href="/"
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-8 items-center gap-1.5 rounded-md border border-border px-3 text-[13px] hover:bg-muted"
              >
                <ExternalLink className="size-3.5" />
                <span className="hidden sm:inline">View store</span>
              </a>

              <CmsButton
                variant="outline"
                onClick={handleSignOut}
                disabled={isSigningOut}
              >
                <LogOut size={14} />
                <span className="hidden sm:inline">Sign out</span>
              </CmsButton>
            </div>
          </header>
    )
}