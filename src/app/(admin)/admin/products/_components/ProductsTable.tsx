"use client";

import { Pencil } from "lucide-react";

import DataTable, { type Column } from "@/components/cms/DataTable";
import { Badge, Btn, Empty } from "@/components/cms/ui";
import { bdt } from "@/lib/utils";
import type { PageMeta } from "@/redux/api.utils";
import type { AdminProduct } from "@/redux/apis/types/product.types";

import { PAGE_SIZE, STATUS_TONES } from "../_constants/products.constants";
import { formatDate, productStockState, statusLabel } from "../_utils/products.utils";
import ProductStatusActions from "./ProductStatusActions";
import ServerPagination from "./ServerPagination";
import StockBadge from "./StockBadge";
import Image from "next/image";
import TableSkeleton from "@/components/cms/TableSkeleton";

type Props = {
  rows: AdminProduct[];
  meta?: PageMeta;
  page: number;
  loading?: boolean;
  isLoading?: boolean;
  onPageChange: (page: number) => void;
  onEdit: (product: AdminProduct) => void;
  onCreate: () => void;
};

export default function ProductsTable({
  rows,
  meta,
  page,
  isLoading,
  loading,
  onPageChange,
  onEdit,
  onCreate,
}: Props) {
  const columns: Column<AdminProduct>[] = [
    {
      key: "product",
      header: "Product",
      cell: (product) => (
        <div className="flex items-center gap-2.5">
          <div className="size-9 shrink-0 overflow-hidden rounded border border-border bg-muted">
            {product.images[0] ? (
              // eslint-disable-next-line @next/next/no-img-element
              <Image
                src={product.images[0].url}
                alt={product.images[0].alt ?? ""}
                width={40}
                height={40}
                className="size-full object-cover"
              />
            ) : null}
          </div>
          <div className="min-w-0">
            <p className="truncate font-medium">{product.name}</p>
            <p className="truncate text-xs text-muted-foreground">
              {product.code ?? "No code"} · {product.slug}
            </p>
          </div>
        </div>
      ),
    },
    {
      key: "category",
      header: "Category",
      cell: (product) => (
        <span className="text-muted-foreground">{product.category.name}</span>
      ),
    },
    {
      key: "status",
      header: "Status",
      cell: (product) => (
        <Badge tone={STATUS_TONES[product.status]}>
          {statusLabel(product.status)}
        </Badge>
      ),
    },
    {
      key: "price",
      header: "Price",
      align: "right",
      cell: (product) => (
        <div>
          <p>{bdt(product.hasOffer ? product.effectivePrice : product.regularPrice)}</p>
          {product.hasOffer && (
            <p className="text-xs text-muted-foreground line-through">
              {bdt(product.regularPrice)}
            </p>
          )}
        </div>
      ),
    },
    {
      key: "stock",
      header: "Stock",
      align: "right",
      cell: (product) => {
        const low = product.variants.filter(
          (variant) => variant.isActive && variant.lowStock,
        ).length;
        return (
          <div className="flex flex-col items-end gap-1">
            <span className="tabular-nums">
              {product.totalOnHand} on hand
            </span>
            <div className="flex items-center gap-1">
              <StockBadge state={productStockState(product)} showOk />
              {low > 0 && <span className="text-[11px]">{low} low</span>}
            </div>
          </div>
        );
      },
    },
    {
      key: "updated",
      header: "Updated",
      cell: (product) => (
        <span className="text-xs text-muted-foreground">
          {formatDate(product.updatedAt)}
        </span>
      ),
    },
    {
      key: "actions",
      header: "",
      align: "right",
      cell: (product) => (
        <div
          className="flex flex-wrap items-center justify-end gap-1"
          onClick={(event) => event.stopPropagation()}
        >
          <Btn size="sm" onClick={() => onEdit(product)} aria-label={`Edit ${product.name}`}>
            <Pencil className="size-3.5" /> Edit
          </Btn>
          <ProductStatusActions product={product} size="sm" />
        </div>
      ),
    },
  ];

  if (isLoading) return <TableSkeleton columns={7} />;

  return (
    <div>
      <DataTable
        rows={rows}
        columns={columns}
        rowKey={(product) => product.id}
        pageSize={PAGE_SIZE}
        hidePagination
        onRowClick={onEdit}
        isLoading={isLoading}
        empty={
          <Empty
            title="No products yet"
            description="Create a draft product, add colours, variants, and images, then publish it."
            action={
              <Btn variant="primary" onClick={onCreate}>
                New product
              </Btn>
            }
          />
        }
      />
      <ServerPagination
        meta={meta}
        page={page}
        onPageChange={onPageChange}
        loading={loading}
      />
    </div>
  );
}
