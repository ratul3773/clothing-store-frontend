"use client";

import { useSearchParams } from "next/navigation";
import { customer } from "@/lib/data/account";
import { AccountSidebar, getAccountTabLabel } from "./account-sidebar";
import {
  Addresses,
  EmptySection,
  Orders,
  Overview,
  SettingsPanel,
} from "./account-sections";

export function AccountDashboard() {
  const searchParams = useSearchParams();
  const requestedTab = searchParams.get("tab") || "overview";
  const activeTab = [
    "overview",
    "orders",
    "wishlist",
    "addresses",
    "settings",
  ].includes(requestedTab)
    ? requestedTab
    : "overview";
  const activeLabel = getAccountTabLabel(activeTab);

  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
      <div className="mb-10 border-b border-border pb-8">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-accent-foreground">
          My account
        </p>
        <p className="mt-3 text-muted-foreground">
          Manage your orders, saved pieces and personal details from one place.
        </p>
      </div>
      <div className="grid gap-8 lg:grid-cols-[250px_1fr] lg:gap-14">
        <AccountSidebar activeTab={activeTab} />
        <section
          key={activeTab}
          className="page-transition min-w-0"
          aria-labelledby="account-section-title"
        >
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-accent-foreground">
            {activeLabel}
          </p>
          {activeTab === "overview" && <Overview />}
          {activeTab === "orders" && <Orders />}
          {activeTab === "wishlist" && (
            <EmptySection
              title="Your wishlist"
              description="Pieces you save will appear here for easy access later."
              action="Browse the collection"
              href="/shop"
            />
          )}
          {activeTab === "addresses" && <Addresses />}
          {activeTab === "settings" && <SettingsPanel />}
        </section>
      </div>
    </main>
  );
}
