"use client";

import { CmsButton } from "@/components/ui/button";
import useProductList from "../_hooks/useProductList";

import { Plus } from "lucide-react";

import { Card, Empty, PageHeader } from "@/components/cms/ui";
import { apiErrorMessage } from "@/redux/api.utils";

import Pagination from "@/components/common/Pagination";
import InventoryTable from "./InventoryTable";
import ProductFilters from "./ProductFilters";
import ProductsTable from "./ProductsTable";

export default function ProductList() {
  const {
    tab,
    setTab,
    page,
    setPage,
    setLimit,
    filters,
    updateFilters,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
    products,
    meta,
    openProduct,
    createProduct,
  } = useProductList();

  return (
    <div>
      <PageHeader
        title="Products"
        description="Create products, manage variants, images, offers, and stock."
        crumbs={["Catalog", "Products"]}
        actions={
          <CmsButton variant="default" onClick={createProduct}>
            <Plus className="size-4" /> New product
          </CmsButton>
        }
      />

      <div className="mb-4 flex items-center gap-1 rounded-md border border-border bg-card p-1">
        <TabButton
          active={tab === "products"}
          onClick={() => setTab("products")}
        >
          Products
        </TabButton>
        <TabButton
          active={tab === "inventory"}
          onClick={() => setTab("inventory")}
        >
          Inventory
        </TabButton>
        {isFetching && (
          <span className="ml-auto pr-2 text-xs text-muted-foreground">
            Updating…
          </span>
        )}
      </div>

      <Card>
        <ProductFilters value={filters} onChange={updateFilters} />
        {isError ? (
          <Empty
            title="Products could not be loaded"
            description={apiErrorMessage(
              error,
              "Check the API connection and try again.",
            )}
            action={
              <CmsButton variant="default" onClick={() => void refetch()}>
                Try again
              </CmsButton>
            }
          />
        ) : tab === "products" ? (
          <ProductsTable
            rows={products}
            isLoading={isLoading || isFetching}
            onEdit={openProduct}
            onCreate={createProduct}
          />
        ) : (
          <InventoryTable
            products={products}
            meta={meta}
            page={page}
            loading={isFetching}
            onPageChange={setPage}
          />
        )}
      </Card>
      {meta && (
        <Pagination
          mode="normal"
          paginationInfo={meta}
          onPageChange={setPage}
          onItemsPerPageChange={(value) => {
            setLimit(value);
            setPage(1);
          }}
          itemsLabel="products"
        />
      )}
    </div>
  );
}

function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={
        active
          ? "inline-flex h-7 items-center rounded bg-primary px-3 text-xs font-medium text-primary-foreground"
          : "inline-flex h-7 items-center rounded px-3 text-xs font-medium text-muted-foreground hover:bg-muted"
      }
    >
      {children}
    </button>
  );
}
