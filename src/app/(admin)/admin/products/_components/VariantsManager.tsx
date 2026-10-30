"use client";

import { useState } from "react";
import { Pencil, Plus, Trash2, Warehouse } from "lucide-react";

import AlertDialogText from "@/components/common/Alert-Dialogue";
import { Badge, Btn, Card, CardHeader, Empty } from "@/components/cms/ui";
import { useStore } from "@/components/providers/StoreProvider";
import { apiErrorMessage } from "@/redux/api.utils";
import {
  useDeleteColorMutation,
  useDeleteVariantMutation,
} from "@/redux/apis/product.api";
import type {
  AdminProduct,
  AdminVariant,
  ProductColor,
} from "@/redux/apis/types/product.types";

import { variantStockState } from "../_utils/products.utils";
import ColorDialog from "./ColorDialog";
import StockAdjustDialog from "./StockAdjustDialog";
import StockBadge from "./StockBadge";
import VariantDialog from "./VariantDialog";

export default function VariantsManager({
  product,
}: {
  product: AdminProduct;
}) {
  const { toast, toastError } = useStore();
  const [deleteColor, deleteColorState] = useDeleteColorMutation();
  const [deleteVariant, deleteVariantState] = useDeleteVariantMutation();

  const [colorDialog, setColorDialog] = useState<{
    open: boolean;
    color?: ProductColor;
  }>({ open: false });
  const [variantDialog, setVariantDialog] = useState<{
    open: boolean;
    variant?: AdminVariant;
  }>({ open: false });
  const [stockVariant, setStockVariant] = useState<AdminVariant | null>(null);
  const [colorTarget, setColorTarget] = useState<ProductColor | null>(null);
  const [variantTarget, setVariantTarget] = useState<AdminVariant | null>(null);

  const variants = [...product.variants].sort(
    (a, b) =>
      a.colorName.localeCompare(b.colorName) ||
      a.sizeOrder - b.sizeOrder ||
      a.size.localeCompare(b.size),
  );

  const confirmDeleteColor = async () => {
    if (!colorTarget) return;
    try {
      await deleteColor({
        productId: product.id,
        colorId: colorTarget.id,
      }).unwrap();
      toast("Colour deleted.");
      setColorTarget(null);
    } catch (error) {
      toast(
        apiErrorMessage(
          error,
          "The colour could not be deleted. Remove its variants first.",
        ),
      );
    }
  };

  const confirmDeleteVariant = async () => {
    if (!variantTarget) return;
    try {
      await deleteVariant({
        productId: product.id,
        variantId: variantTarget.id,
      }).unwrap();
      toast("Variant deleted.");
      setVariantTarget(null);
    } catch (error) {
      toastError(apiErrorMessage(error, "The variant could not be deleted."));
    }
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader
          title="Colours"
          description="Colours group variants and can be attached to images."
          actions={
            <Btn size="sm" onClick={() => setColorDialog({ open: true })}>
              <Plus className="size-3.5" /> Add colour
            </Btn>
          }
        />
        <div className="p-4">
          {product.colors.length === 0 ? (
            <p className="rounded border border-dashed border-border px-3 py-6 text-center text-xs text-muted-foreground">
              No colours yet. Add a colour before creating variants.
            </p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {product.colors.map((color) => (
                <div
                  key={color.id}
                  className="flex items-center gap-2 rounded border border-border bg-card px-2.5 py-1.5"
                >
                  <span
                    className="size-4 rounded-full border border-border"
                    style={{ background: color.hex ?? "transparent" }}
                  />
                  <span className="text-[13px]">{color.name}</span>
                  {color.hex && (
                    <span className="font-mono text-[11px] text-muted-foreground">
                      {color.hex}
                    </span>
                  )}
                  <Btn
                    size="icon"
                    variant="ghost"
                    className="size-6"
                    onClick={() => setColorDialog({ open: true, color })}
                    aria-label={`Edit ${color.name}`}
                  >
                    <Pencil className="size-3.5" />
                  </Btn>
                  <Btn
                    size="icon"
                    variant="ghost"
                    className="size-6 text-destructive"
                    onClick={() => setColorTarget(color)}
                    aria-label={`Delete ${color.name}`}
                  >
                    <Trash2 className="size-3.5" />
                  </Btn>
                </div>
              ))}
            </div>
          )}
        </div>
      </Card>

      <Card>
        <CardHeader
          title="Variants"
          description={`${product.variants.length} variant${product.variants.length === 1 ? "" : "s"} · SKUs are generated from the product code.`}
          actions={
            <Btn
              size="sm"
              onClick={() => setVariantDialog({ open: true })}
              disabled={product.colors.length === 0}
            >
              <Plus className="size-3.5" /> Add variant
            </Btn>
          }
        />
        {variants.length === 0 ? (
          <Empty
            title="No variants yet"
            description="Add a colour and then create at least one variant before publishing."
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-[13px]">
              <thead>
                <tr className="border-b border-border bg-muted/50 text-xs text-muted-foreground">
                  <th className="px-3 py-2 font-medium">Variant</th>
                  <th className="px-3 py-2 font-medium">SKU</th>
                  <th className="px-3 py-2 text-right font-medium">Available</th>
                  <th className="px-3 py-2 text-right font-medium">Low at</th>
                  <th className="px-3 py-2 font-medium">Status</th>
                  <th className="px-3 py-2 text-right font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {variants.map((variant) => (
                  <tr
                    key={variant.id}
                    className="border-b border-border last:border-0"
                  >
                    <td className="px-3 py-2">
                      <span className="flex items-center gap-2">
                        <span
                          className="size-3 rounded-full border border-border"
                          style={{ background: variant.colorHex ?? "transparent" }}
                        />
                        {variant.colorName} / {variant.size}
                      </span>
                    </td>
                    <td className="px-3 py-2 font-mono text-xs text-muted-foreground">
                      {variant.sku}
                    </td>
                    <td className="px-3 py-2 text-right tabular-nums">
                      {variant.available}{" "}
                      <span className="text-xs text-muted-foreground">
                        / {variant.onHand}
                      </span>
                    </td>
                    <td className="px-3 py-2 text-right tabular-nums">
                      {variant.lowStockThreshold}
                    </td>
                    <td className="px-3 py-2">
                      <div className="flex items-center gap-1">
                        <Badge tone={variant.isActive ? "green" : "gray"}>
                          {variant.isActive ? "Active" : "Inactive"}
                        </Badge>
                        <StockBadge state={variantStockState(variant)} />
                      </div>
                    </td>
                    <td className="px-3 py-2">
                      <div className="flex items-center justify-end gap-1">
                        <Btn
                          size="sm"
                          onClick={() => setStockVariant(variant)}
                        >
                          <Warehouse className="size-3.5" /> Stock
                        </Btn>
                        <Btn
                          size="sm"
                          onClick={() => setVariantDialog({ open: true, variant })}
                        >
                          <Pencil className="size-3.5" /> Edit
                        </Btn>
                        <Btn
                          size="icon"
                          variant="ghost"
                          className="size-7 text-red-600"
                          onClick={() => setVariantTarget(variant)}
                          aria-label={`Delete ${variant.colorName} ${variant.size}`}
                        >
                          <Trash2 className="size-3.5" />
                        </Btn>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      <ColorDialog
        productId={product.id}
        color={colorDialog.color}
        open={colorDialog.open}
        onOpenChange={(open) =>
          setColorDialog((current) => ({ ...current, open }))
        }
      />

      <VariantDialog
        productId={product.id}
        colors={product.colors}
        variant={variantDialog.variant}
        open={variantDialog.open}
        onOpenChange={(open) =>
          setVariantDialog((current) => ({ ...current, open }))
        }
      />

      {stockVariant && (
        <StockAdjustDialog
          key={stockVariant.id}
          productId={product.id}
          variant={stockVariant}
          open={!!stockVariant}
          onOpenChange={(open) => {
            if (!open) setStockVariant(null);
          }}
        />
      )}

      <AlertDialogText
        mode="normal"
        open={!!colorTarget}
        onOpenChange={(open) => {
          if (!open) setColorTarget(null);
        }}
        actionType="delete"
        title={`Delete ${colorTarget?.name ?? "colour"}?`}
        description="A colour can only be deleted when no variants use it."
        confirmButtonText="Delete colour"
        disabled={deleteColorState.isLoading}
        onConfirm={() => void confirmDeleteColor()}
      />

      <AlertDialogText
        mode="normal"
        open={!!variantTarget}
        onOpenChange={(open) => {
          if (!open) setVariantTarget(null);
        }}
        actionType="delete"
        title={`Delete ${variantTarget?.colorName ?? ""} / ${variantTarget?.size ?? ""}?`}
        description="The variant and its stock history reference will be removed. Products with reserved stock cannot be deleted."
        confirmButtonText="Delete variant"
        disabled={deleteVariantState.isLoading}
        onConfirm={() => void confirmDeleteVariant()}
      />
    </div>
  );
}
