"use client";

import { useEffect, useMemo, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Save } from "lucide-react";
import { useForm } from "react-hook-form";

import { Btn, Card, CardHeader, PageHeader, Switch } from "@/components/cms/ui";
import { useStore } from "@/components/providers/StoreProvider";
import { useNavigate } from "@/lib/nav";
import { apiErrorMessage } from "@/redux/api.utils";
import {
  useCreateProductMutation,
  usePublishProductMutation,
  useUploadImageMutation,
} from "@/redux/apis/product.api";
import type {
  CreateProductPayload,
  CreateProductVariantPayload,
} from "@/redux/apis/types/product.types";

import {
  createColorsSchema,
  productCoreSchema,
  type ProductCoreFormValues,
} from "../_schemas/product.schema";
import {
  stockMatrixKey,
  type CreateColorDraft,
} from "../_types/products.types";
import { parseOptionalInt, toCorePayload } from "../_utils/products.utils";
import BasicSection from "./BasicSection";
import DetailsSection from "./DetailsSection";
import ImagesCreateSection from "./ImagesCreateSection";
import PricingSection from "./PricingSection";
import ProductPreview from "./ProductPreview";
import VariantsCreateSection from "./VariantsCreateSection";

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

type DraftErrors = {
  colors?: string;
  sizes?: string;
  variants?: string;
};

export default function ProductCreateForm() {
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

  return (
    <div>
      <PageHeader
        title="New product"
        description="Create the product core first, then add colours, variants, and images."
        crumbs={["Catalog", "Products", "New"]}
        actions={
          <>
            <Btn onClick={() => go("/admin/products")} disabled={submitting}>
              Cancel
            </Btn>
            <Btn
              type="submit"
              form="product-create-form"
              variant="primary"
              disabled={submitting || createState.isLoading}
            >
              <Save className="size-4" />
              {submitting ? "Creating…" : "Create draft"}
            </Btn>
          </>
        }
      />

      <form id="product-create-form" onSubmit={onSubmit}>
        <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_320px]">
          <div className="space-y-4">
            <BasicSection form={form} />
            <PricingSection form={form} />
            <DetailsSection form={form} />
            <VariantsCreateSection
              colors={colors}
              onColorsChange={setColors}
              sizes={sizes}
              onSizesChange={setSizes}
              stock={stock}
              onStockChange={setStock}
              threshold={threshold}
              onThresholdChange={setThreshold}
              errors={draftErrors}
            />
            <ImagesCreateSection files={files} onChange={setFiles} />
          </div>

          <div className="space-y-4 lg:sticky lg:top-4 lg:self-start">
            <ProductPreview
              name={values.name}
              price={values.regularPrice}
              images={previewImages.map((preview) => preview.url)}
              badges={values.badges}
              colors={colors}
            />

            <Card>
              <CardHeader title="Saving" />
              <div className="space-y-3 p-4">
                <Switch
                  checked={publishNow}
                  onChange={setPublishNow}
                  label="Publish after saving"
                />
                <p className="text-xs text-muted-foreground">
                  Publishing requires an active category, at least one colour and
                  variant, and at least one image. Leave this off to save a draft.
                </p>
                <div className="rounded border border-border bg-muted/40 p-3 text-xs text-muted-foreground">
                  {colors.length} colour{colors.length === 1 ? "" : "s"} ·{" "}
                  {sizes.length} size{sizes.length === 1 ? "" : "s"} ·{" "}
                  {colors.length * sizes.length} variant
                  {colors.length * sizes.length === 1 ? "" : "s"} · {files.length}{" "}
                  image{files.length === 1 ? "" : "s"}
                </div>
              </div>
            </Card>
          </div>
        </div>
      </form>
    </div>
  );
}
