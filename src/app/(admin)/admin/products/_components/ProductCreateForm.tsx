"use client";

import { CmsButton } from "@/components/ui/button";
import { FormField } from "@/components/common/form-field";
import { Save } from "lucide-react";

import { Card, CardHeader, PageHeader } from "@/components/cms/ui";
import { useProduct } from "../_hooks/useCreateProduct";
import BasicSection from "./BasicSection";
import DetailsSection from "./DetailsSection";
import ImagesCreateSection from "./ImagesCreateSection";
import PricingSection from "./PricingSection";
import ProductPreview from "./ProductPreview";
import VariantsCreateSection from "./VariantsCreateSection";
import { FadeArc } from "@/components/animation/fade-arc";

export default function ProductCreateForm() {
  const {
    form,
    draftForm,
    values,
    previewImages,
    onSubmit,
    submitting,
    createState,
    go,
    colors,
    sizes,
    files,
    setFiles,
  } = useProduct();

  return (
    <div>
      <PageHeader
        title="New product"
        description="Create the product core first, then add colours, variants, and images."
        crumbs={["Catalog", "Products", "New"]}
        actions={
          <>
            <CmsButton variant="outline" onClick={() => go("/admin/products")} disabled={submitting}>
              Cancel
            </CmsButton>
            <CmsButton
              type="submit"
              form="product-create-form"
              variant="default"
              disabled={submitting || createState.isLoading}
            >
              
              {submitting ? <><FadeArc className="size-3.5" /> Creating…</> : <><Save className="size-4" /> Create draft</>}
            </CmsButton>
          </>
        }
      />

      <form id="product-create-form" onSubmit={onSubmit}>
        <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_320px]">
          <div className="space-y-4">
            <BasicSection form={form} />
            <PricingSection form={form} />
            <DetailsSection form={form} />
            <VariantsCreateSection form={draftForm} />
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
                <FormField form={draftForm} id="publish-now" name="publishNow" isAdmin isSwitch label="Publish after saving" />
                <p className="text-xs text-muted-foreground">
                  Publishing requires an active category, at least one colour
                  and variant, and at least one image. Leave this off to save a
                  draft.
                </p>
                <div className="rounded border border-border bg-muted/40 p-3 text-xs text-muted-foreground">
                  {colors.length} colour{colors.length === 1 ? "" : "s"} ·{" "}
                  {sizes.length} size{sizes.length === 1 ? "" : "s"} ·{" "}
                  {colors.length * sizes.length} variant
                  {colors.length * sizes.length === 1 ? "" : "s"} ·{" "}
                  {files.length} image{files.length === 1 ? "" : "s"}
                </div>
              </div>
            </Card>
          </div>
        </div>
      </form>
    </div>
  );
}
