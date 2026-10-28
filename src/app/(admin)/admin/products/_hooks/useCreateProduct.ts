"use client";
import { useStore } from "@/components/providers/StoreProvider";
import { useNavigate } from "@/lib/nav";
import { 
    useCreateProductMutation, 
    usePublishProductMutation, 
    useUploadImageMutation,
} from "@/redux/apis/product.api";
import { CreateColorDraft, DraftErrors, stockMatrixKey } from "../_types/products.types";
import { useEffect, useMemo, useState } from "react";
import { createColorsSchema, ProductCoreFormValues, productCoreSchema } from "../_schemas/product.schema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { parseOptionalInt, toCorePayload } from "../_utils/products.utils";
import { CreateProductPayload, CreateProductVariantPayload } from "@/redux/apis/types/product.types";
import { apiErrorMessage } from "@/redux/api.utils";

const defaultValues: ProductCoreFormValues = {
  name: "",
  code: "",
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
export function useProduct(){
      const { toast, toastError } = useStore();
      const go = useNavigate();
      const [createProduct, createState] = useCreateProductMutation();
      const [uploadImage] = useUploadImageMutation();
      const [publishProduct] = usePublishProductMutation();
    
      const [colors, setColors] = useState<CreateColorDraft[]>([]);
      const [sizes, setSizes] = useState<string[]>([]);
      const [stock, setStock] = useState<Record<string, string>>({});
      const [threshold, setThreshold] = useState("3");
      const [files, setFiles] = useState<File[]>([]);
      const [publishNow, setPublishNow] = useState(false);
      const [draftErrors, setDraftErrors] = useState<DraftErrors>({});
      const [submitting, setSubmitting] = useState(false);
    
      const form = useForm<ProductCoreFormValues>({
        resolver: zodResolver(productCoreSchema),
        defaultValues,
      });
    
      const values = form.watch();
      const previewImages = useMemo(
        () => files.map((file) => ({ file, url: URL.createObjectURL(file) })),
        [files],
      );
    
      useEffect(
        () => () =>
          previewImages.forEach((preview) => URL.revokeObjectURL(preview.url)),
        [previewImages],
      );
    
      const validateVariants = (): DraftErrors => {
        const errors: DraftErrors = {};
    
        if (colors.length * sizes.length > 200) {
          errors.variants =
            "A product can have at most 200 variants. Remove some colours or sizes.";
          return errors;
        }
    
        if (sizes.some((size) => size.length > 20)) {
          errors.sizes = "Each size must be 20 characters or fewer.";
        }
    
        const colorResult = createColorsSchema.safeParse(
          colors.map((color) => ({ name: color.name, hex: color.hex })),
        );
        if (!colorResult.success) {
          errors.colors = colorResult.error.issues[0]?.message ?? "Check the colours.";
        }
    
        if (threshold.trim() !== "" && !/^\d+$/.test(threshold.trim())) {
          errors.variants = "Low stock threshold must be a whole number.";
        } else if (Number(threshold) > 10_000_000) {
          errors.variants = "Low stock threshold is too large.";
        }
    
        for (const color of colors) {
          for (const size of sizes) {
            const value = (stock[stockMatrixKey(color.key, size)] ?? "").trim();
            if (value === "") continue;
            if (!/^\d+$/.test(value) || Number(value) > 10_000_000) {
              errors.variants = "Opening stock must be a whole number (0 or more).";
              break;
            }
          }
          if (errors.variants) break;
        }
    
        return errors;
      };
    
      const onSubmit = form.handleSubmit(async (core) => {
        const errors = validateVariants();
        setDraftErrors(errors);
        if (Object.keys(errors).length > 0) {
          toastError(errors.colors ?? errors.sizes ?? errors.variants ?? "Check the form.");
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
        values,
        previewImages,
        submitting,
        draftErrors,
        onSubmit,
        createState,
        go,
        colors,
        setColors,
        sizes,
        setSizes,
        stock,
        setStock,
        threshold,
        setThreshold,
        files,
        setFiles,
        publishNow,
        setPublishNow,

    };
}