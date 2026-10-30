"use client";

import { useMemo, useState } from "react";
import { Plus, Search } from "lucide-react";

import { Btn, Card, Empty, Input, PageHeader, Toolbar } from "@/components/cms/ui";
import { apiErrorMessage } from "@/redux/api.utils";
import { useGetAdminCategoriesQuery } from "@/redux/apis/category.api";
import {
  toCategoryRows,
  type CategoryRow,
} from "@/redux/apis/types/category.types";

import CategoriesTable from "./CategoriesTable";
import CategoryModal from "./CategoryModal";

export default function CategoriesView() {
  const { data, isLoading, isError, error, refetch } = useGetAdminCategoriesQuery();
  const [query, setQuery] = useState("");
  const [modal, setModal] = useState<{ open: boolean; editingId?: string }>({
    open: false,
  });
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const rows = useMemo(() => toCategoryRows(data ?? []), [data]);

  // Resolve the edited row from the latest query data so image uploads and
  // saves are reflected in the open modal.
  const editing = useMemo(
    () =>
      modal.editingId
        ? data?.find((category) => category.id === modal.editingId)
        : undefined,
    [data, modal.editingId],
  );

  const selectedCategory = useMemo(() => data?.find((cat) => cat.id === selectedId), [data, selectedId]);

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

  return (
    <div>
      <PageHeader
        title="Categories"
        description="Organise products into a nested catalogue. Deleting a category with products archives it instead."
        crumbs={["Catalog", "Categories"]}
        actions={
          <Btn variant="primary" onClick={openCreate}>
            <Plus className="size-4" /> New category
          </Btn>
        }
      />

      <Card>
        <Toolbar>
          <div className="relative min-w-52 flex-1">
            <Search className="pointer-events-none absolute left-2.5 top-2 size-4 text-muted-foreground" />
            <Input
              className="pl-8"
              placeholder="Search categories"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              aria-label="Search categories"
            />
          </div>
          <span className="text-xs text-muted-foreground">
            {rows.length} categor{rows.length === 1 ? "y" : "ies"}
          </span>
        </Toolbar>

        {isError ? (
          <Empty
            title="Categories could not be loaded"
            description={apiErrorMessage(
              error,
              "Check the API connection and try again.",
            )}
            action={
              <Btn variant="primary" onClick={() => void refetch()}>
                Try again
              </Btn>
            }
          />
        ) : (
          <div className="grid gap-4 xl:grid-cols-[1.2fr_1fr]">
            <CategoriesTable
              rows={filtered}
              selected={selectedId}
              onSelect={setSelectedId}
              onCreate={openCreate}
              onEdit={openEdit}
              isLoading={isLoading}
            />
          </div>
        )}
      </Card>

      <CategoryModal
        open={modal.open}
        onOpenChange={(open) => setModal((current) => ({ ...current, open }))}
        categories={data ?? []}
        editing={editing}
      />
    </div>
  );
}
