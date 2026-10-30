"use client";

import { useState } from "react";
import { Plus } from "lucide-react";

import { Btn, Card, Empty, PageHeader } from "@/components/cms/ui";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import { useNavigate } from "@/lib/nav";
import { apiErrorMessage } from "@/redux/api.utils";
import { useGetAdminProductsQuery } from "@/redux/apis/product.api";
import type { AdminProduct, AdminProductQuery } from "@/redux/apis/types/product.types";

import { PAGE_SIZE } from "../_constants/products.constants";
import {
  defaultProductFilters,
  type ProductFilters as Filters,
  type ProductTab,
} from "../_types/products.types";
import InventoryTable from "./InventoryTable";
import ProductFilters from "./ProductFilters";
import ProductsTable from "./ProductsTable";

export default function ProductList() {
  const go = useNavigate();
  const [tab, setTab] = useState<ProductTab>("products");
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState<Filters>(defaultProductFilters);
  const debouncedQuery = useDebouncedValue(filters.q, 350);

  const updateFilters = (next: Filters) => {
    setFilters(next);
    setPage(1);
  };

  const params: AdminProductQuery = {
    page,
    limit: PAGE_SIZE,
    sort: filters.sort,
    ...(debouncedQuery.trim() ? { q: debouncedQuery.trim() } : {}),
    ...(filters.categoryId ? { categoryId: filters.categoryId } : {}),
    ...(filters.status ? { status: filters.status } : {}),
    ...(filters.inStock ? { inStock: filters.inStock } : {}),
  };

  const { data, isLoading, isFetching, isError, error, refetch } =
    useGetAdminProductsQuery(params);

  const products = data?.items ?? [];
  const meta = data?.meta;

  const openProduct = (product: AdminProduct) =>
    go(`/admin/products?id=${product.id}`);
  const createProduct = () => go("/admin/products?new=1");

  return (
    <div>
      <PageHeader
        title="Products"
        description="Create products, manage variants, images, offers, and stock."
        crumbs={["Catalog", "Products"]}
        actions={
          <Btn variant="primary" onClick={createProduct}>
            <Plus className="size-4" /> New product
          </Btn>
        }
      />

      <div className="mb-4 flex items-center gap-1 rounded-md border border-border bg-card p-1">
        <TabButton active={tab === "products"} onClick={() => setTab("products")}>
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
            description={apiErrorMessage(error, "Check the API connection and try again.")}
            action={
              <Btn variant="primary" onClick={() => void refetch()}>
                Try again
              </Btn>
            }
          />
        ) : tab === "products" ? (
          <ProductsTable
            rows={products}
            meta={meta}
            page={page}
            isLoading={isLoading}
            loading={isFetching}
            onPageChange={setPage}
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
