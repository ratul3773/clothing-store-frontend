"use client";
import { useWatch } from "react-hook-form";
import { useStore } from "@/components/providers/StoreProvider";
import { useNavigate } from "@/lib/nav";
import { apiErrorMessage } from "@/redux/api.utils";
import {
  useCreateProductMutation,
  usePublishProductMutation,
  useUploadImageMutation,
} from "@/redux/apis/product.api";
import { CreateProductPayload, CreateProductVariantPayload } from "@/redux/apis/types/product.types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { ProductCoreFormValues, productCoreSchema, ProductDraftFormValues, productDraftSchema } from "../_schemas/product.schema";
import { stockMatrixKey } from "../_types/products.types";
import { parseOptionalInt, toCorePayload } from "../_utils/products.utils";

const defaultValues: ProductCoreFormValues = {
  name: "",
  code: "",
  parentCategoryId: "",
  categoryId: "",
  regularPrice: "",
  description: "",
  material: "",
  fit: "",
  careInstructions: "",
  badges: [],
  isExchangeEligible: true,
  seoTitle: "",
  seoDescription: "",
};
export function useProduct() {
  const { toast, toastError } = useStore();
  const go = useNavigate();
  const [createProduct, createState] = useCreateProductMutation();
  const [uploadImage] = useUploadImageMutation();
  const [publishProduct] = usePublishProductMutation();

  const draftForm = useForm<ProductDraftFormValues>({ mode: "onChange", resolver: zodResolver(productDraftSchema), defaultValues: { colors: [], sizes: [], stock: {}, threshold: "3", sizeInput: "", publishNow: false } });
  const { colors, sizes, stock, threshold, publishNow } = useWatch({ control: draftForm.control, compute: (values) => values });
  const [files, setFiles] = useState<File[]>([]);
  const [submitting, setSubmitting] = useState(false);

  const form = useForm<ProductCoreFormValues>({
    resolver: zodResolver(productCoreSchema),
    defaultValues,
  });

  const values = useWatch({ control: form.control, compute: (values) => values });
  const previewImages = useMemo(
    () => files.map((file) => ({ file, url: URL.createObjectURL(file) })),
    [files],
  );

  useEffect(
    () => () =>
      previewImages.forEach((preview) => URL.revokeObjectURL(preview.url)),
    [previewImages],
  );

  const onSubmit = form.handleSubmit(async (core) => {
    if (!await draftForm.trigger()) {
      toastError("Check the colours, sizes, and opening stock.");
      return;
    }
    setSubmitting(true);

    const lowStockThreshold = parseOptionalInt(threshold) ?? 3;
    const variants: CreateProductVariantPayload[] = colors.flatMap((color) =>
      sizes.map((size, sizeIndex) => ({
        colorName: color.name.trim(),
        size,
        sizeOrder: sizeIndex,
        onHand: parseOptionalInt(stock[stockMatrixKey(color.key, size)] ?? "") ?? 0,
        lowStockThreshold,
        isActive: true,
      })),
    );

    const payload: CreateProductPayload = {
      ...toCorePayload(core),
      colors: colors.map((color, index) => ({
        name: color.name.trim(),
        hex: color.hex.trim() === "" ? null : color.hex.trim().toUpperCase(),
        sortOrder: index,
      })),
      variants,
    };

    try {
      let product = await createProduct(payload).unwrap();
      const productId = product.id;

      let failedUploads = 0;
      for (const file of files) {
        try {
          product = await uploadImage({ productId, file }).unwrap();
        } catch {
          failedUploads += 1;
        }
      }

      let publishError: unknown = null;
      if (publishNow) {
        try {
          product = await publishProduct(productId).unwrap();
        } catch (error) {
          publishError = error;
        }
      }

      if (publishError) {
        toast(
          `Draft saved, but it could not be published: ${apiErrorMessage(
            publishError,
            "check colours, variants, and images.",
          )}`,
        );
      } else if (failedUploads > 0) {
        toast(
          `Draft saved. ${failedUploads} image${failedUploads === 1 ? "" : "s"} could not be uploaded.`,
        );
      } else {
        toast(
          publishNow
            ? "Product created and published."
            : "Draft product created.",
        );
      }

      go(`/admin/products?id=${productId}`);
    } catch (error) {
      toastError(apiErrorMessage(error, "The product could not be created."));
      setSubmitting(false);
    }
  });

  return {
    form,
    draftForm,
    values,
    previewImages,
    submitting,
    onSubmit,
    createState,
    go,
    colors,
    sizes,
    stock,
    threshold,
    files,
    setFiles,
    publishNow,

  };
}
