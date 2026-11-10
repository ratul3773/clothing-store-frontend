"use client";
import type { Props } from "./useCreateVariantDialog";

import { useStore } from "@/components/providers/StoreProvider";
import { apiErrorMessage } from "@/redux/api.utils";
import {
  useUpdateVariantMutation
} from "@/redux/apis/product.api";
import type {
  AdminVariant
} from "@/redux/apis/types/product.types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import {
  updateVariantFormSchema,
  type UpdateVariantFormValues
} from "../_schemas/product.schema";
import { parseOptionalInt } from "../_utils/products.utils";

export default function useEditVariantDialog({
  productId,
  variant,
  open,
  onOpenChange,
}: Omit<Props, "colors"> & { variant: AdminVariant }) {
  const { toast, toastError } = useStore();
  const [updateVariant, updateState] = useUpdateVariantMutation();
  const form = useForm<UpdateVariantFormValues>({
    resolver: zodResolver(updateVariantFormSchema),
    defaultValues: {
      size: "",
      sizeOrder: "",
      lowStockThreshold: "",
      isActive: true,
    },
  });
  useEffect(() => {
    if (!open) return;
    form.reset({
      size: variant.size,
      sizeOrder: variant.sizeOrder === 0 ? "" : String(variant.sizeOrder),
      lowStockThreshold: String(variant.lowStockThreshold),
      isActive: variant.isActive,
    });
  }, [open, variant, form]);
  const onSubmit = form.handleSubmit(async (values) => {
    try {
      await updateVariant({
        productId,
        variantId: variant.id,
        data: {
          size: values.size.trim(),
          sizeOrder: parseOptionalInt(values.sizeOrder),
          lowStockThreshold: parseOptionalInt(values.lowStockThreshold),
          isActive: values.isActive,
          version: variant.version,
        },
      }).unwrap();
      toast("Variant updated.");
      onOpenChange(false);
    } catch (error) {
      toastError(apiErrorMessage(error, "The variant could not be updated."));
    }
  });
  return { updateState, form, onSubmit };
}
