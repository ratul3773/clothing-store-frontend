"use client";

import type { UseFormReturn } from "react-hook-form";

import { Card, CardHeader } from "@/components/cms/ui";

import { FIT_OPTIONS } from "../_constants/products.constants";
import type { ProductCoreFormValues } from "../_schemas/product.schema";
import {
  SelectField,
  TextareaField,
  TextField,
} from "../../_components/form-controls";

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
        <TextField
          form={form}
          name="material"
          label="Material"
          placeholder="e.g. 100% cotton"
        />
        <SelectField
          form={form}
          name="fit"
          label="Fit"
          options={FIT_OPTIONS}
        />
        <TextField
          form={form}
          name="careInstructions"
          label="Care instructions"
          placeholder="e.g. Machine wash cold"
          className="sm:col-span-2"
        />
        <TextareaField
          form={form}
          name="description"
          label="Description"
          rows={5}
          placeholder="Describe the product…"
          className="sm:col-span-2"
        />
        <TextField
          form={form}
          name="seoTitle"
          label="SEO title"
          placeholder="Optional search title"
        />
        <TextField
          form={form}
          name="seoDescription"
          label="SEO description"
          placeholder="Optional search description"
        />
      </div>
    </Card>
  );
}
