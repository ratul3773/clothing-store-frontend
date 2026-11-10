"use client";
import { useWatch } from "react-hook-form";

import { useGetAdminCategoriesQuery } from "@/redux/apis/category.api";
import { toCategoryRows } from "@/redux/apis/types/category.types";
import type { UseFormReturn } from "react-hook-form";
import type { ProductCoreFormValues } from "../_schemas/product.schema";

export default function useBasicSection({
  form,
}: {
  form: UseFormReturn<ProductCoreFormValues>;
}) {
  const { data: categories, isLoading } = useGetAdminCategoriesQuery();
  const rows = categories ? toCategoryRows(categories) : [];
  const name = useWatch({ control: form.control, name: "name" });
  const parentCategoryId = useWatch({ control: form.control, name: "parentCategoryId" });
  const parentOptions = rows
    .filter((category) => category.depth === 0)
    .map((category) => ({
      value: category.id,
      label: category.name,
      disabled: !category.isActive,
    }));
  const subcategoryOptions = rows
    .filter((category) => category.parentId === parentCategoryId)
    .map((category) => ({
      value: category.id,
      label: category.name,
      disabled: !category.isActive,
    }));
  const categoryHint = parentCategoryId
    ? "Choose the subcategory where this product belongs."
    : "Choose a category first.";
  const parentChange = (value: string) => {
    form.setValue("parentCategoryId", value, { shouldValidate: true });
    form.setValue("categoryId", "", { shouldValidate: true });
  };
  const subcategoryOptionsWithPlaceholder = subcategoryOptions.length
    ? subcategoryOptions
    : [
      {
        value: "__empty__",
        label: "No subcategories available",
        disabled: true,
      },
    ];
  return {
    isLoading,
    name,
    parentCategoryId,
    parentOptions,
    subcategoryOptions,
    categoryHint,
    parentChange,
    subcategoryOptionsWithPlaceholder,
  };
}
