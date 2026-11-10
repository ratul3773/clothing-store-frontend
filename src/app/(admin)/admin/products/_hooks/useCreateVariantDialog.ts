"use client";

import { useStore } from "@/components/providers/StoreProvider";
import { apiErrorMessage } from "@/redux/api.utils";
import {
  useCreateVariantMutation
} from "@/redux/apis/product.api";
import type {
  AdminVariant,
  ProductColor,
} from "@/redux/apis/types/product.types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import {
  createVariantFormSchema,
  type CreateVariantFormValues
} from "../_schemas/product.schema";
import { parseOptionalInt } from "../_utils/products.utils";

export type Props = {
  productId: string;
  colors: ProductColor[];
  variant?: AdminVariant;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export default function useCreateVariantDialog({ productId, colors, open, onOpenChange }: Props) {
  const { toast, toastError } = useStore();
  const [createVariant, createState] = useCreateVariantMutation();
  const form = useForm<CreateVariantFormValues>({
    resolver: zodResolver(createVariantFormSchema),
    defaultValues: {
      colorId: "",
      size: "",
      sizeOrder: "",
      onHand: "0",
      lowStockThreshold: "3",
      isActive: true,
    },
  });
  useEffect(() => {
    if (!open) return;
    form.reset({
      colorId: colors[0]?.id ?? "",
      size: "",
      sizeOrder: "",
      onHand: "0",
      lowStockThreshold: "3",
      isActive: true,
    });
  }, [open, colors, form]);
  const onSubmit = form.handleSubmit(async (values) => {
    try {
      await createVariant({
        productId,
        data: {
          colorId: values.colorId,
          size: values.size.trim(),
          sizeOrder: parseOptionalInt(values.sizeOrder),
          onHand: parseOptionalInt(values.onHand),
          lowStockThreshold: parseOptionalInt(values.lowStockThreshold),
          isActive: values.isActive,
        },
      }).unwrap();
      toast("Variant added.");
      onOpenChange(false);
    } catch (error) {
      toastError(apiErrorMessage(error, "The variant could not be created."));
    }
  });
  return { createState, form, onSubmit };
}
