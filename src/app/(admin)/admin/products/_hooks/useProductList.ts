"use client";

import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import { useNavigate } from "@/lib/nav";
import { useGetAdminProductsQuery } from "@/redux/apis/product.api";
import type {
  AdminProduct,
  AdminProductQuery,
} from "@/redux/apis/types/product.types";
import { useState } from "react";
import {
  defaultProductFilters,
  type ProductFilters as Filters,
  type ProductTab,
} from "../_types/products.types";

export default function useProductList() {
  const go = useNavigate();
  const [tab, setTab] = useState<ProductTab>("products");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [filters, setFilters] = useState<Filters>(defaultProductFilters);
  const debouncedQuery = useDebouncedValue(filters.q, 350);
  const updateFilters = (next: Filters) => {
    setFilters(next);
    setPage(1);
  };
  const params: AdminProductQuery = {
    page,
    limit,
    sort: filters.sort,
    ...(debouncedQuery.trim() ? { q: debouncedQuery.trim() } : {}),
    ...(filters.categoryId ? { categoryId: filters.categoryId } : {}),
    ...(filters.status ? { status: filters.status } : {}),
    ...(filters.inStock ? { inStock: filters.inStock } : {}),
  };
  const { data, isLoading, isFetching, isError, error, refetch } =
    useGetAdminProductsQuery(params);
  const products = data?.items ?? [];
  const meta = data?.meta;
  const openProduct = (product: AdminProduct) =>
    go(`/admin/products?id=${product.id}`);
  const createProduct = () => go("/admin/products?new=1");
  return {
    tab,
    setTab,
    page,
    setPage,
    setLimit,
    filters,
    updateFilters,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
    products,
    meta,
    openProduct,
    createProduct,
  };
}
