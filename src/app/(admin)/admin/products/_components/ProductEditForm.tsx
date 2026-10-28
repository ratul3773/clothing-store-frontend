"use client";

import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertTriangle, Save } from "lucide-react";
import { useForm } from "react-hook-form";

import { Badge, Btn, Card, CardHeader, PageHeader } from "@/components/cms/ui";
import { useStore } from "@/components/providers/StoreProvider";
import { useNavigate } from "@/lib/nav";
import { apiErrorMessage, isConflictError } from "@/redux/api.utils";
import { useUpdateProductMutation } from "@/redux/apis/product.api";
import type { AdminProduct } from "@/redux/apis/types/product.types";

import { STATUS_TONES } from "../_constants/products.constants";
import {
  productCoreSchema,
  type ProductCoreFormValues,
} from "../_schemas/product.schema";
import {
  formatDate,
  statusLabel,
  toCoreFormValues,
  toCorePayload,
} from "../_utils/products.utils";
import BasicSection from "./BasicSection";
import DetailsSection from "./DetailsSection";
import ImagesManager from "./ImagesManager";
import OffersManager from "./OffersManager";
import PricingSection from "./PricingSection";
import ProductPreview from "./ProductPreview";
import ProductStatusActions from "./ProductStatusActions";
import VariantsManager from "./VariantsManager";

type Props = {
  product: AdminProduct;
  reload: () => Promise<AdminProduct>;
};

export default function ProductEditForm({ product, reload }: Props) {
  const { toast, toastError } = useStore();
  const go = useNavigate();
  const [updateProduct, updateState] = useUpdateProductMutation();
  const [conflict, setConflict] = useState<string | null>(null);

  const form = useForm<ProductCoreFormValues>({
    resolver: zodResolver(productCoreSchema),
    defaultValues: toCoreFormValues(product),
  });

  useEffect(() => {
    form.reset(toCoreFormValues(product));
    // Only re-seed when switching products; mutations intentionally keep edits.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product.id]);

  const values = form.watch();
  const images = [...product.images]
    .sort(
      (a, b) =>
        Number(b.isPrimary) - Number(a.isPrimary) || a.sortOrder - b.sortOrder,
    )
    .map((image) => image.url);

  const onSubmit = form.handleSubmit(async (core) => {
    try {
      const updated = await updateProduct({
        id: product.id,
        data: { ...toCorePayload(core), version: product.version },
      }).unwrap();
      form.reset(toCoreFormValues(updated));
      setConflict(null);
      toast("Product saved.");
    } catch (error) {
      if (isConflictError(error)) {
        const message =
          "This product was changed elsewhere. The latest values have been loaded — review them and save again.";
        setConflict(message);
        toast(message);
        try {
          const fresh = await reload();
          form.reset(toCoreFormValues(fresh));
        } catch {
          toast("Could not reload the latest product values.");
        }
        return;
      }
      toastError(apiErrorMessage(error, "The product could not be saved."));
    }
  });

  return (
    <div>
      <PageHeader
        title={product.name}
        description={`${product.code ?? "No code"} · /${product.slug}`}
        crumbs={["Catalog", "Products", product.name]}
        actions={
          <>
            <Btn onClick={() => go("/admin/products")}>Back</Btn>
            <Btn
              type="submit"
              form="product-edit-form"
              variant="primary"
              disabled={updateState.isLoading || !form.formState.isDirty}
            >
              <Save className="size-4" />
              {updateState.isLoading ? "Saving…" : "Save changes"}
            </Btn>
            <ProductStatusActions
              product={product}
              onDeleted={() => go("/admin/products")}
            />
          </>
        }
      />

      {product.status === "ARCHIVED" && (
        <div className="mb-4 flex items-start gap-2 rounded border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-300">
          <AlertTriangle className="mt-0.5 size-4 shrink-0" />
          <span>
            This product is archived. Restore it before publishing. Archived
            products are hidden from the storefront.
          </span>
        </div>
      )}

      {conflict && (
        <div className="mb-4 flex flex-wrap items-center gap-2 rounded border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-300">
          <AlertTriangle className="size-4 shrink-0" />
          <span className="flex-1">{conflict}</span>
          <Btn
            size="sm"
            onClick={async () => {
              try {
                const fresh = await reload();
                form.reset(toCoreFormValues(fresh));
                setConflict(null);
                toast("Latest product values loaded.");
              } catch {
                toast("Could not reload the latest product values.");
              }
            }}
          >
            Reload latest
          </Btn>
          <Btn size="sm" variant="ghost" onClick={() => setConflict(null)}>
            Dismiss
          </Btn>
        </div>
      )}

      <form id="product-edit-form" onSubmit={onSubmit}>
        <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_320px]">
          <div className="space-y-4">
            <BasicSection form={form} />
            <PricingSection form={form} editing />
            <DetailsSection form={form} />
            <ImagesManager product={product} />
            <VariantsManager product={product} />
            <OffersManager product={product} />
          </div>

          <div className="space-y-4 lg:sticky lg:top-4 lg:self-start">
            <ProductPreview
              name={values.name}
              price={values.regularPrice}
              images={images}
              badges={values.badges}
              colors={product.colors}
              status={product.status}
            />

            <Card>
              <CardHeader title="Product record" />
              <div className="space-y-2 p-4 text-xs text-muted-foreground">
                <div className="flex items-center justify-between">
                  <span>Status</span>
                  <Badge tone={STATUS_TONES[product.status]}>
                    {statusLabel(product.status)}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>Version</span>
                  <span className="tabular-nums">{product.version}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Created</span>
                  <span>{formatDate(product.createdAt)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Updated</span>
                  <span>{formatDate(product.updatedAt)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>On hand</span>
                  <span className="tabular-nums">{product.totalOnHand}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Reserved</span>
                  <span className="tabular-nums">{product.totalReserved}</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </form>
    </div>
  );
}
