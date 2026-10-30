"use client";

import type { UseFormReturn } from "react-hook-form";

import { Card, CardHeader } from "@/components/cms/ui";
import { bdt } from "@/lib/utils";

import type { ProductCoreFormValues } from "../_schemas/product.schema";
import { toNumber } from "../_utils/products.utils";
import { TextField } from "../../_components/form-controls";

export default function PricingSection({
  form,
  editing,
}: {
  form: UseFormReturn<ProductCoreFormValues>;
  editing?: boolean;
}) {
  const price = toNumber(form.watch("regularPrice"));

  return (
    <Card>
      <CardHeader
        title="Pricing"
        description={
          editing
            ? "Offers are managed in the Offers section below."
            : "Prices are stored as whole taka. Add an offer after the product exists."
        }
      />
      <div className="grid gap-4 p-4 sm:grid-cols-2">
        <TextField
          form={form}
          name="regularPrice"
          label="Regular price (৳)"
          inputMode="numeric"
          placeholder="e.g. 2490"
          hint={
            Number.isFinite(price) && price > 0
              ? `Customers see ${bdt(price)}`
              : "Whole taka only — no decimals."
          }
        />
      </div>
    </Card>
  );
}
