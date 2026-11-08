"use client";

import useComboColorPicker from "../_hooks/useComboColorPicker";

import { Badge, Btn } from "@/components/cms/ui";
import { FormField } from "@/components/common/form-field";
import Pagination from "@/components/common/Pagination";
import { Skeleton } from "@/components/ui/skeleton";
import { bdt, cn } from "@/lib/utils";
import type { ComboComponent } from "@/redux/apis/types/combo.types";
import type {
  AdminProduct,
  ProductColor,
} from "@/redux/apis/types/product.types";
import { Check, Plus, Search, X } from "lucide-react";
import Image from "next/image";

export default function ComboColorPicker({
  onAdd,
  disabled,
  selectedItems,
}: {
  onAdd: (item: ComboComponent) => void;
  disabled: boolean;
  selectedItems: ComboComponent[];
}) {
  const { form, search, setSearch, now, setPage, productId, setProductId, products, detail, product } = useComboColorPicker();
  return (
    <section
      aria-label="Product picker"
      className="space-y-4 rounded-lg border border-border bg-muted/20 p-3 sm:p-4 [&_button]:transition-none"
    >
      <div>
        <h3 className="text-sm font-semibold">Add products to your combo</h3>
        <p className="mt-1 text-xs text-muted-foreground">
          Select a product, then add a color. Choose its allowed variants in your combo above.
        </p>
      </div>
      <div className="relative">
        <FormField form={form} id="combo-product-search" name="search" label="Search products" isAdmin isInput startIcon={Search} placeholder="Search by product name or code..." onValueChange={() => setPage(1)} />
        {search && (
          <Btn
            variant="ghost"
            size="icon"
            className="absolute bottom-0 right-0"
            aria-label="Clear product search"
            onClick={() => {
              setSearch("");
              setPage(1);
            }}
          >
            <X className="size-3.5" />
          </Btn>
        )}
      </div>
      {products.isFetching ? (
        <div
          role="status"
          aria-label="Loading products"
          className="grid grid-cols-2 gap-3 sm:grid-cols-4"
        >
          {[0, 1, 2, 3].map((index) => (
            <div
              key={index}
              aria-hidden="true"
              className="space-y-2 rounded-lg border border-border p-2"
            >
              <Skeleton className="aspect-[4/3] w-full animate-none" />
              <Skeleton className="h-4 w-3/4 animate-none" />
              <Skeleton className="h-3 w-1/2 animate-none" />
            </div>
          ))}
        </div>
      ) : products.isError ? (
        <div role="alert">
          Could not load products.{" "}
          <Btn onClick={() => void products.refetch()}>Retry products</Btn>
        </div>
      ) : (
        <>
          {!products.currentData?.items.length && (
            <div className="rounded-lg border border-dashed border-border py-8 text-center">
              <p className="text-sm font-medium">No matching products</p>
              <p className="mt-1 text-xs text-muted-foreground">
                Try another name or product code.
              </p>
            </div>
          )}
          <ul className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {products.currentData?.items.map((p) => {
              const selected = p.id === productId;
              const quantity = selectedItems
                .filter((item) => item.product.id === p.id)
                .reduce((sum, item) => sum + item.quantity, 0);
              const image =
                p.images.find((image) => image.isPrimary) ?? p.images[0];
              return (
                <li key={p.id} className="min-w-0">
                  <button
                    type="button"
                    disabled={disabled}
                    onClick={() => setProductId(p.id)}
                    aria-pressed={selected}
                    aria-label={`Choose colors for ${p.name}`}
                    className={cn(
                      "h-full w-full overflow-hidden rounded-lg border bg-card text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring disabled:cursor-not-allowed disabled:opacity-60",
                      selected
                        ? "border-primary ring-1 ring-primary"
                        : "border-border hover:border-primary/60",
                    )}
                  >
                    <div className="relative aspect-[4/3] bg-muted">
                      <Image
                        src={image?.url ?? "/product-placeholder.svg"}
                        alt={image?.alt ?? p.name}
                        fill
                        sizes="(max-width: 640px) 45vw, 220px"
                        className="object-cover"
                      />
                      <div className="absolute left-2 top-2">
                        <Badge tone={p.status === "ACTIVE" ? "green" : "gray"}>
                          {p.status}
                        </Badge>
                      </div>
                      {selected && (
                        <span className="absolute right-2 top-2 rounded-full bg-primary p-1 text-primary-foreground">
                          <Check aria-hidden="true" className="size-3.5" />
                        </span>
                      )}
                      {quantity > 0 && (
                        <span className="absolute bottom-2 left-2 rounded bg-card px-2 py-1 text-xs font-medium">
                          {quantity} added
                        </span>
                      )}
                    </div>
                    <div className="space-y-1 p-2.5">
                      <p className="line-clamp-2 text-sm font-medium">
                        {p.name}
                      </p>
                      <p className="truncate text-xs text-muted-foreground">
                        {p.code ?? "No code"}
                      </p>
                      <p className="text-sm font-semibold">
                        {bdt(p.effectivePrice)}{" "}
                        {p.hasOffer && (
                          <del className="text-xs font-normal text-muted-foreground">
                            {bdt(p.regularPrice)}
                          </del>
                        )}
                      </p>
                      <div className="flex flex-wrap items-center gap-1.5 pt-1">
                        {p.colors.slice(0, 5).map((color) => (
                          <span
                            key={color.id}
                            title={color.name}
                            className="size-3.5 rounded-full border border-foreground/20 bg-muted"
                            style={{ backgroundColor: color.hex ?? undefined }}
                          />
                        ))}
                        <span className="text-xs text-muted-foreground">
                          {p.colors.length} colors
                        </span>
                      </div>
                      <p className="pt-1 text-xs font-medium text-primary">
                        {selected ? "Choose a color below" : "View colors"}
                      </p>
                    </div>
                  </button>
                </li>
              );
            })}
          </ul>
          {products.currentData?.meta && (
            <Pagination
              mode="normal"
              paginationInfo={products.currentData.meta}
              onPageChange={setPage}
              itemsLabel="products"
              className="mt-3!"
            />
          )}
        </>
      )}
      {productId &&
        (detail.isLoading || (!product && detail.isFetching) ? (
          <div role="status" aria-label="Loading product colors">
            <Skeleton className="h-32 animate-none" />
          </div>
        ) : detail.isError ? (
          <div role="alert">
            Could not load colors.{" "}
            <Btn onClick={() => void detail.refetch()}>Retry colors</Btn>
          </div>
        ) : (
          product && (
            <div className="space-y-3 border-t border-border pt-4">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h4 className="text-sm font-semibold">{product.name}</h4>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Add a color below. Repeated pieces share one selected size.
                  </p>
                </div>
                <Btn
                  variant="ghost"
                  size="icon"
                  aria-label="Close product colors"
                  onClick={() => setProductId("")}
                >
                  <X className="size-4" />
                </Btn>
              </div>
              {!product.colors.length && (
                <p className="text-sm text-muted-foreground">
                  No colors available for this product.
                </p>
              )}
              <ul className="grid gap-3 sm:grid-cols-3">
                {product.colors.map((color) => {
                  const variants = product.variants.filter(
                    (variant) =>
                      variant.colorId === color.id && variant.isActive,
                  );
                  const quantity =
                    selectedItems.find((item) => item.colorId === color.id)
                      ?.quantity ?? 0;
                  const available = Math.max(
                    0,
                    ...variants.map((variant) => variant.available),
                  );
                  const published =
                    product.status === "ACTIVE" &&
                    !!product.publishedAt &&
                    Date.parse(product.publishedAt) <= now;
                  const reason = !published
                    ? "Product is not published"
                    : !variants.length
                      ? "No active sizes"
                      : available === 0
                        ? "Out of stock"
                        : quantity >= available
                          ? "Size stock limit reached"
                          : null;
                  const image =
                    product.images.find(
                      (image) => image.colorId === color.id,
                    ) ?? product.images[0];
                  return (
                    <li
                      key={color.id}
                      className={cn(
                        "space-y-3 rounded-lg border bg-card p-3",
                        quantity ? "border-primary/50" : "border-border",
                      )}
                    >
                      <div className="flex gap-3">
                        <Image
                          src={image?.url ?? "/product-placeholder.svg"}
                          alt={`${product.name} in ${color.name}`}
                          width={64}
                          height={80}
                          className="h-20 w-16 rounded-md object-cover"
                        />
                        <div className="min-w-0 space-y-1">
                          <p className="flex items-center gap-2 text-sm font-medium">
                            <span
                              aria-hidden="true"
                              className="size-3.5 shrink-0 rounded-full border border-foreground/20 bg-muted"
                              style={{
                                backgroundColor: color.hex ?? undefined,
                              }}
                            />
                            {color.name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {bdt(product.effectivePrice)} each
                          </p>
                          {quantity > 0 && (
                            <Badge tone="green">
                              <Check
                                aria-hidden="true"
                                className="mr-1 size-3"
                              />
                              {quantity} in combo
                            </Badge>
                          )}
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {variants.map((variant) => (
                          <span
                            key={variant.id}
                            className={cn(
                              "rounded border px-1.5 py-0.5 text-xs",
                              variant.available > 0
                                ? "border-border text-foreground"
                                : "border-border text-muted-foreground line-through",
                            )}
                            title={`${variant.size}: ${variant.available} available`}
                          >
                            {variant.size} · {variant.available}
                          </span>
                        ))}
                      </div>
                      {reason && (
                        <p className="text-xs text-muted-foreground">
                          {reason}
                        </p>
                      )}
                      <Btn
                        className="w-full"
                        variant={quantity ? "outline" : "primary"}
                        disabled={disabled || !!reason}
                        aria-label={`Add ${product.name} ${color.name}`}
                        onClick={() => onAdd(buildComponent(product, color))}
                      >
                        <Plus className="size-3.5" />
                        {quantity ? "Add another piece" : "Add to combo"}
                      </Btn>
                    </li>
                  );
                })}
              </ul>
            </div>
          )
        ))}
    </section>
  );
}

function buildComponent(
  product: AdminProduct,
  color: ProductColor,
): ComboComponent {
  return {
    id: color.id,
    colorId: color.id,
    quantity: 1,
    variantIds: null,
    product: {
      id: product.id,
      name: product.name,
      slug: product.slug,
      unitPrice: product.effectivePrice,
      imageUrl:
        (
          product.images.find((image) => image.colorId === color.id) ??
          product.images[0]
        )?.url ?? null,
    },
    color: { id: color.id, name: color.name, hex: color.hex },
    variants: product.variants
      .filter((variant) => variant.colorId === color.id && variant.isActive)
      .map((variant) => ({
        id: variant.id,
        size: variant.size,
        available: variant.available,
        maxQuantity: variant.available,
      })),
  };
}
