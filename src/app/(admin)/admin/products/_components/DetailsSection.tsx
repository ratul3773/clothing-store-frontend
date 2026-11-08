"use client";

import type { UseFormReturn } from "react-hook-form";

import { Card, CardHeader } from "@/components/cms/ui";

import { FormField } from "@/components/common/form-field";
import { FIT_OPTIONS } from "../_constants/products.constants";
import type { ProductCoreFormValues } from "../_schemas/product.schema";

export default function DetailsSection({
  form,
}: {
  form: UseFormReturn<ProductCoreFormValues>;
}) {
  return (
    <Card>
      <CardHeader
        title="Details"
        description="Material, fit, care, description, and search metadata."
      />
      <div className="grid gap-4 p-4 sm:grid-cols-2">
        <FormField isAdmin isInput id="material" form={form}
          name="material"
          label="Material"
          placeholder="e.g. 100% cotton" />
        <FormField isAdmin isSelect id="fit" form={form}
          name="fit"
          label="Fit"
          options={FIT_OPTIONS} />
        <FormField isAdmin isInput id="careInstructions" form={form}
          name="careInstructions"
          label="Care instructions"
          placeholder="e.g. Machine wash cold"
          className="sm:col-span-2" />
        <FormField isAdmin isTextArea id="description" form={form}
          name="description"
          label="Description"
          rows={5}
          placeholder="Describe the product…"
          className="sm:col-span-2" />
        <FormField isAdmin isInput id="seoTitle" form={form}
          name="seoTitle"
          label="SEO title"
          placeholder="Optional search title" />
        <FormField isAdmin isInput id="seoDescription" form={form}
          name="seoDescription"
          label="SEO description"
          placeholder="Optional search description" />
      </div>
    </Card>
  );
}
