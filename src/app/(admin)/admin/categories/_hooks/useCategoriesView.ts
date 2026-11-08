"use client";

import { useGetAdminCategoriesQuery } from "@/redux/apis/category.api";
import {
  toCategoryRows,
  type CategoryRow,
} from "@/redux/apis/types/category.types";
import { useMemo, useState } from "react";

export default function useCategoriesView() {
  const { data, isLoading, isError, error, refetch } =
    useGetAdminCategoriesQuery();
  const [query, setQuery] = useState("");
  const [modal, setModal] = useState<{ open: boolean; editingId?: string }>({
    open: false,
  });
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const rows = useMemo(() => toCategoryRows(data ?? []), [data]);
  const editing = useMemo(
    () =>
      modal.editingId
        ? data?.find((category) => category.id === modal.editingId)
        : undefined,
    [data, modal.editingId],
  );
  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return rows;
    return rows.filter(
      (category) =>
        category.name.toLowerCase().includes(term) ||
        category.slug.toLowerCase().includes(term),
    );
  }, [rows, query]);
  const openEdit = (category: CategoryRow) =>
    setModal({ open: true, editingId: category.id });
  const openCreate = () => setModal({ open: true });
  return {
    data,
    isLoading,
    isError,
    error,
    refetch,
    query,
    setQuery,
    modal,
    setModal,
    selectedId,
    setSelectedId,
    rows,
    editing,
    filtered,
    openEdit,
    openCreate,
  };
}
