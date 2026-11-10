"use client";

import { useGetAdminCategoriesQuery } from "@/redux/apis/category.api";
import { toCategoryRows } from "@/redux/apis/types/category.types";
import {
  defaultProductFilters,
  type ProductFilters as Filters,
} from "../_types/products.types";

export type Props = {
  value: Filters;
  onChange: (next: Filters) => void;
};

export default function useProductFilters({ value, onChange }: Props) {
  const { data: categories } = useGetAdminCategoriesQuery();
  const rows = categories ? toCategoryRows(categories) : [];
  const set = (patch: Partial<Filters>) => onChange({ ...value, ...patch });
  const dirty =
    value.q !== "" ||
    value.categoryId !== "" ||
    value.status !== "" ||
    value.inStock !== "" ||
    value.sort !== defaultProductFilters.sort;
  return { rows, set, dirty };
}
