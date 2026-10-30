"use client";

import { useState } from "react";
import { Plus } from "lucide-react";

import DataTable, { type Column } from "@/components/cms/DataTable";
import { Badge, Btn, Empty } from "@/components/cms/ui";
import type { PageMeta } from "@/redux/api.utils";
import type { AdminProduct, AdminVariant } from "@/redux/apis/types/product.types";

import { PAGE_SIZE } from "../_constants/products.constants";
import { variantStockState } from "../_utils/products.utils";
import ServerPagination from "./ServerPagination";
import StockAdjustDialog from "./StockAdjustDialog";
import StockBadge from "./StockBadge";

type Row = { product: AdminProduct; variant: AdminVariant };

type Props = {
  products: AdminProduct[];
  meta?: PageMeta;
  page: number;
  loading?: boolean;
  onPageChange: (page: number) => void;
};

export default function InventoryTable({
  products,
  meta,
  page,
  loading,
  onPageChange,
}: Props) {
  const [selected, setSelected] = useState<Row | null>(null);

  const rows: Row[] = products
    .flatMap((product) =>
      product.variants.map((variant) => ({ product, variant })),
    )
    .sort((a, b) => {
      const rank = { out: 0, low: 1, ok: 2 } as const;
      return (
        rank[variantStockState(a.variant)] - rank[variantStockState(b.variant)] ||
        a.product.name.localeCompare(b.product.name) ||
        a.variant.size.localeCompare(b.variant.size)
      );
    });

  const columns: Column<Row>[] = [
    {
      key: "product",
      header: "Product",
      cell: ({ product }) => (
        <div className="flex items-center gap-2.5">
          <div className="size-8 shrink-0 overflow-hidden rounded border border-border bg-muted">
            {product.images[0] ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={product.images[0].url}
                alt={product.images[0].alt ?? ""}
                className="size-full object-cover"
              />
            ) : null}
          </div>
          <div className="min-w-0">
            <p className="truncate font-medium">{product.name}</p>
            <p className="truncate text-xs text-muted-foreground">
              {product.code ?? "No code"}
            </p>
          </div>
        </div>
      ),
    },
    {
      key: "variant",
      header: "Variant",
      cell: ({ variant }) => (
        <div className="flex items-center gap-2">
          <span
            className="size-3 rounded-full border border-border"
            style={{ background: variant.colorHex ?? "transparent" }}
          />
          <span>
            {variant.colorName} / {variant.size}
          </span>
          {!variant.isActive && <Badge tone="gray">Inactive</Badge>}
        </div>
      ),
    },
    {
      key: "sku",
      header: "SKU",
      cell: ({ variant }) => (
        <span className="font-mono text-xs text-muted-foreground">
          {variant.sku}
        </span>
      ),
    },
    {
      key: "available",
      header: "Available",
      align: "right",
      cell: ({ variant }) => (
        <div className="flex flex-col items-end gap-1">
          <span className="tabular-nums">
            {variant.available} / {variant.onHand}
          </span>
          <StockBadge state={variantStockState(variant)} showOk />
        </div>
      ),
    },
    {
      key: "threshold",
      header: "Low at",
      align: "right",
      cell: ({ variant }) => (
        <span className="tabular-nums">{variant.lowStockThreshold}</span>
      ),
    },
    {
      key: "actions",
      header: "",
      align: "right",
      cell: (row) => (
        <Btn size="sm" onClick={() => setSelected(row)}>
          <Plus className="size-3.5" /> Adjust
        </Btn>
      ),
    },
  ];

  return (
    <div>
      <DataTable
        rows={rows}
        columns={columns}
        rowKey={(row) => row.variant.id}
        pageSize={PAGE_SIZE}
        hidePagination
        empty={
          <Empty
            title="No variants to show"
            description="Variants appear here once a product has colours and sizes."
          />
        }
      />
      <ServerPagination
        meta={meta}
        page={page}
        onPageChange={onPageChange}
        loading={loading}
      />
      {selected && (
        <StockAdjustDialog
          productId={selected.product.id}
          variant={selected.variant}
          open={!!selected}
          onOpenChange={(open) => {
            if (!open) setSelected(null);
          }}
        />
      )}
    </div>
  );
}
