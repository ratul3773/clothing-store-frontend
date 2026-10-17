import { Suspense } from "react";
import { SiteFooter } from "./site-footer";
import { SiteHeader } from "./site-header";
import { AuthSlot } from "./auth-button";

export function StoreShell({ children }: { children: React.ReactNode }) {
    return (
    <>
      <SiteHeader
            authSlot={
              <Suspense fallback={<div className="hidden h-9 w-20 animate-pulse rounded bg-muted sm:block" />}>
                <AuthSlot />
              </Suspense>
            }
          />
      {children}
      <SiteFooter />
    </>
  );
}