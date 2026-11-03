"use client";

import { useState } from "react";
import { useGetAdminProductsQuery, useGetAdminProductQuery } from "@/redux/apis/product.api";
import type { ComboComponent } from "@/redux/apis/types/combo.types";
import { Btn, Field, Input } from "@/components/cms/ui";
import Pagination from "@/components/common/Pagination";
import { Skeleton } from "@/components/ui/skeleton";
import { bdt } from "@/lib/utils";

export default function ComboColorPicker({ onAdd, disabled }: { onAdd: (item: ComboComponent) => void; disabled: boolean }) {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [productId, setProductId] = useState("");
  const products = useGetAdminProductsQuery({ q: search || undefined, page, limit: 5 });
  const detail = useGetAdminProductQuery({ id: productId }, { skip: !productId });
  const product = detail.currentData;
  return <div className="space-y-3 rounded border border-border p-3">
    <Field label="Search products"><Input value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} /></Field>
    {products.isLoading ? <Skeleton className="h-20" /> : products.isError ? <div role="alert">Could not load products. <Btn onClick={() => void products.refetch()}>Retry products</Btn></div> : <>
      {!products.currentData?.items.length && <p className="text-sm">No matching products.</p>}
      <ul className="space-y-1">{products.currentData?.items.map((p) => <li key={p.id}><Btn className="h-auto w-full justify-start whitespace-normal text-left" onClick={() => setProductId(p.id)} aria-pressed={p.id === productId}>{p.name} / {p.code} / {p.status}</Btn></li>)}</ul>
      {products.currentData?.meta && <Pagination paginationInfo={products.currentData.meta} onPageChange={setPage} itemsLabel="products" />}
    </>}
    {productId && (detail.isLoading || !product && detail.isFetching ? <Skeleton className="h-20" /> : detail.isError ? <div role="alert">Could not load colors. <Btn onClick={() => void detail.refetch()}>Retry colors</Btn></div> : product && <div>
      <h3 className="mb-2 text-sm font-semibold">Colors of {product.name}</h3>
      <p className="mb-2 text-xs text-muted-foreground">Choose the color here. Customers choose a size when purchasing. Repeated pieces share one selected size.</p>
      {!product.colors.length && <p>No colors available.</p>}
      <ul className="max-h-52 space-y-2 overflow-y-auto">{product.colors.map((color) => {
        const variants = product.variants.filter((variant) => variant.colorId === color.id && variant.isActive);
        return <li key={color.id} className="flex items-center justify-between gap-2 text-xs">
          <span>{color.name} / {bdt(product.effectivePrice)} each / {variants.length ? variants.map((v) => `${v.size}: ${v.available}`).join(", ") : "No active sizes"}</span>
          <Btn size="sm" disabled={disabled} aria-label={`Add ${product.name} ${color.name}`} onClick={() => onAdd({
            id: color.id, colorId: color.id, quantity: 1,
            product: { id: product.id, name: product.name, slug: product.slug, unitPrice: product.effectivePrice, imageUrl: (product.images.find((image) => image.colorId === color.id) ?? product.images[0])?.url ?? null },
            color: { id: color.id, name: color.name, hex: color.hex },
            variants: variants.map((v) => ({ id: v.id, size: v.size, available: v.available, maxQuantity: v.available })),
          })}>Add color</Btn>
        </li>;
      })}</ul>
    </div>)}
  </div>;
}
