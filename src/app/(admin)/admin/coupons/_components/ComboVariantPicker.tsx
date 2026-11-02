"use client";

import { useState } from "react";
import { useGetAdminProductsQuery, useGetAdminProductQuery } from "@/redux/apis/product.api";
import type { ComboComponent } from "@/redux/apis/types/combo.types";
import { Btn, Field, Input } from "@/components/cms/ui";
import Pagination from "@/components/common/Pagination";
import { Skeleton } from "@/components/ui/skeleton";

export default function ComboVariantPicker({ onAdd, disabled }: { onAdd: (item: ComboComponent) => void; disabled: boolean }) {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [productId, setProductId] = useState("");
  const products = useGetAdminProductsQuery({ q: search || undefined, page, limit: 5 });
  const detail = useGetAdminProductQuery({ id: productId }, { skip: !productId });
  const product = detail.currentData;
  return <div className="space-y-3 rounded border border-border p-3">
    <Field label="Search products"><Input value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} /></Field>
    {products.isFetching ? <Skeleton className="h-20" /> : products.isError ? <div role="alert">Could not load products. <Btn onClick={() => void products.refetch()}>Retry products</Btn></div> : <>
      {!products.currentData?.items.length && <p className="text-sm">No matching products.</p>}
      <ul className="space-y-1">{products.currentData?.items.map((p) => <li key={p.id}><Btn className="h-auto w-full justify-start whitespace-normal text-left" onClick={() => setProductId(p.id)} aria-pressed={p.id === productId}>{p.name} / {p.code} / {p.status}</Btn></li>)}</ul>
      {products.currentData?.meta && <Pagination paginationInfo={products.currentData.meta} onPageChange={setPage} itemsLabel="products" />}
    </>}
    {productId && (detail.isFetching ? <Skeleton className="h-20" /> : detail.isError ? <div role="alert">Could not load variants. <Btn onClick={() => void detail.refetch()}>Retry variants</Btn></div> : product && <div>
      <h3 className="mb-2 text-sm font-semibold">Variants of {product.name}</h3>
      <p className="mb-2 text-xs text-muted-foreground">Inactive selections can be saved, but prevent a combo from being publicly available.</p>
      {!product.variants.length && <p>No variants available.</p>}
      <ul className="max-h-52 space-y-2 overflow-y-auto">{product.variants.map((variant) => <li key={variant.id} className="flex items-center justify-between gap-2 text-xs">
        <span>{variant.sku} / {variant.colorName} / {variant.size} / {variant.available} available / {variant.isActive ? "Active" : "Inactive"}</span>
        <Btn size="sm" disabled={disabled} aria-label={`Add ${variant.sku}`} onClick={() => onAdd({ variantId: variant.id, quantity: 1, product: { id: product.id, name: product.name, slug: product.slug, imageUrl: (product.images.find((image) => image.colorId === variant.colorId) ?? product.images[0])?.url ?? null }, variant: { color: variant.colorName, size: variant.size } })}>Add</Btn>
      </li>)}</ul>
    </div>)}
  </div>;
}
