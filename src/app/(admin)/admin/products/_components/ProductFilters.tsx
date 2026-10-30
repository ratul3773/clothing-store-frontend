"use client";

import { Search } from "lucide-react";

import { Btn, Input, Select, Toolbar } from "@/components/cms/ui";
import { useGetAdminCategoriesQuery } from "@/redux/apis/category.api";
import { toCategoryRows } from "@/redux/apis/types/category.types";

import { SORT_OPTIONS, STATUS_OPTIONS } from "../_constants/products.constants";
import { defaultProductFilters, type ProductFilters as Filters } from "../_types/products.types";

type Props = {
  value: Filters;
  onChange: (next: Filters) => void;
};

export default function ProductFilters({ value, onChange }: Props) {
  const { data: categories } = useGetAdminCategoriesQuery();
  const rows = categories ? toCategoryRows(categories) : [];

  const set = (patch: Partial<Filters>) => onChange({ ...value, ...patch });

  const dirty =
    value.q !== "" ||
    value.categoryId !== "" ||
    value.status !== "" ||
    value.inStock !== "" ||
    value.sort !== defaultProductFilters.sort;

  return (
    <Toolbar>
      <div className="relative min-w-52 flex-1">
        <Search className="pointer-events-none absolute left-2.5 top-2 size-4 text-muted-foreground" />
        <Input
          className="pl-8"
          placeholder="Search name, code, or slug"
          value={value.q}
          onChange={(event) => set({ q: event.target.value })}
          aria-label="Search products"
        />
      </div>

      <Select
        className="w-auto min-w-40"
        value={value.categoryId}
        onChange={(event) => set({ categoryId: event.target.value })}
        aria-label="Filter by category"
      >
        <option value="">All categories</option>
        {rows.map((category) => (
          <option key={category.id} value={category.id}>
            {"— ".repeat(category.depth)}
            {category.name}
          </option>
        ))}
      </Select>

      <Select
        className="w-auto"
        value={value.status}
        onChange={(event) =>
          set({ status: event.target.value as Filters["status"] })
        }
        aria-label="Filter by status"
      >
        <option value="">All statuses</option>
        {STATUS_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </Select>

      <Select
        className="w-auto"
        value={value.inStock}
        onChange={(event) =>
          set({ inStock: event.target.value as Filters["inStock"] })
        }
        aria-label="Filter by stock"
      >
        <option value="">Any stock</option>
        <option value="true">In stock</option>
        <option value="false">Out of stock</option>
      </Select>

      <Select
        className="w-auto"
        value={value.sort}
        onChange={(event) =>
          set({ sort: event.target.value as Filters["sort"] })
        }
        aria-label="Sort products"
      >
        {SORT_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </Select>

      {dirty && (
        <Btn variant="ghost" onClick={() => onChange(defaultProductFilters)}>
          Reset
        </Btn>
      )}
    </Toolbar>
  );
}
