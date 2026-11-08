"use client";

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
import { useState } from "react";

export default function useVariantsManager({
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
  return {
    deleteColorState,
    deleteVariantState,
    colorDialog,
    setColorDialog,
    variantDialog,
    setVariantDialog,
    stockVariant,
    setStockVariant,
    colorTarget,
    setColorTarget,
    variantTarget,
    setVariantTarget,
    variants,
    confirmDeleteColor,
    confirmDeleteVariant,
  };
}
