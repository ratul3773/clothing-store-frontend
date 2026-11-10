"use client";

import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import {
  useGetAdminProductQuery,
  useGetAdminProductsQuery,
} from "@/redux/apis/product.api";
import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";

export default function useComboColorPicker() {
  const form = useForm({ defaultValues: { search: "" } });
  const search = useWatch({ control: form.control, name: "search" });
  const setSearch = (value: string) => form.setValue("search", value);
  const [now] = useState(Date.now);
  const [page, setPage] = useState(1);
  const [productId, setProductId] = useState("");
  const searchTerm = useDebouncedValue(search, 300);
  const products = useGetAdminProductsQuery({
    q: searchTerm || undefined,
    page,
    limit: 5,
  });
  const detail = useGetAdminProductQuery(
    { id: productId },
    { skip: !productId },
  );
  const product = detail.currentData;
  return { form, search, setSearch, now, setPage, productId, setProductId, products, detail, product };
}
