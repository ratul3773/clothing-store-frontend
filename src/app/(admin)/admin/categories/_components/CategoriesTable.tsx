"use client";

import { useState } from "react";
import { Pencil, Trash2 } from "lucide-react";

import AlertDialogText from "@/components/common/Alert-Dialogue";
import DataTable, { type Column } from "@/components/cms/DataTable";
import { Badge, Btn, Empty } from "@/components/cms/ui";
import { useStore } from "@/components/providers/StoreProvider";
import { cn } from "@/lib/utils";
import { apiErrorMessage } from "@/redux/api.utils";
import { useDeleteCategoryMutation } from "@/redux/apis/category.api";
import type { CategoryRow } from "@/redux/apis/types/category.types";

type Props = {
  rows: CategoryRow[];
  selected?: string | null;
  onSelect?: (catId: string) => void;
  onCreate: () => void;
  onEdit: (category: CategoryRow) => void;
};

export default function CategoriesTable({ rows, selected, onSelect, onCreate, onEdit }: Props) {
  const { toast, toastError } = useStore();
  const [deleteCategory, deleteState] = useDeleteCategoryMutation();
  const [target, setTarget] = useState<CategoryRow | null>(null);

  const confirmDelete = async () => {
    if (!target) return;
    try {
      const result = await deleteCategory(target.id).unwrap();
      if (result.archived) {
        toast("Category archived because products still reference it.");
      } else {
        toast("Category deleted.");
      }
      setTarget(null);
    } catch (error) {
      toastError(apiErrorMessage(error, "The category could not be deleted."));
    }
  };

  const columns: Column<CategoryRow>[] = [
    {
      key: "name",
      header: "Category",
      cell: (category) => (
        <div
          className={cn(
            "flex items-center gap-2",
            selected === category.id && "text-primary font-medium"
          )}
          style={{ paddingLeft: category.depth * 16 }}
        >
          {category.depth > 0 && (
            <span className="text-muted-foreground">└</span>
          )}
          <div className="size-8 shrink-0 overflow-hidden rounded border border-border bg-muted">
            {category.imageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={category.imageUrl}
                alt=""
                className="size-full object-cover"
              />
            ) : null}
          </div>
          <div className="min-w-0">
            <p className={cn("truncate", category.depth === 0 && "font-medium")}>
              {category.name}
            </p>
            <p className="truncate text-xs text-muted-foreground">
              /{category.slug}
            </p>
          </div>
        </div>
      ),
    },
    {
      key: "children",
      header: "Children",
      align: "right",
      cell: (category) => (
        <span className="tabular-nums">{category.childCount}</span>
      ),
    },
    {
      key: "products",
      header: "Products",
      align: "right",
      cell: (category) => (
        <span className="tabular-nums">{category.productCount}</span>
      ),
    },
    {
      key: "sortOrder",
      header: "Sort",
      align: "right",
      cell: (category) => (
        <span className="tabular-nums">{category.sortOrder}</span>
      ),
    },
    {
      key: "status",
      header: "Status",
      cell: (category) => (
        <Badge tone={category.isActive ? "green" : "gray"}>
          {category.isActive ? "Active" : "Inactive"}
        </Badge>
      ),
    },
    {
      key: "actions",
      header: "",
      align: "right",
      cell: (category) => (
        <div className="flex items-center justify-end gap-1">
          <Btn size="sm" onClick={() => onEdit(category)}>
            <Pencil className="size-3.5" /> Edit
          </Btn>
          <Btn
            size="icon"
            variant="ghost"
            className="size-7 text-red-600"
            onClick={() => setTarget(category)}
            aria-label={`Delete ${category.name}`}
          >
            <Trash2 className="size-3.5" />
          </Btn>
        </div>
      ),
    },
  ];

  return (
    <>
      <DataTable
        rows={rows}
        columns={columns}
        rowKey={(category) => category.id}
        pageSize={20}
        empty={
          <Empty
            title="No categories yet"
            description="Categories organise products. Create a parent category first, then add children."
            action={
              <Btn variant="primary" onClick={onCreate}>
                New category
              </Btn>
            }
          />
        }
      />

      <AlertDialogText
        open={!!target}
        mode="normal"
        onOpenChange={(open) => {
          if (!open) setTarget(null);
        }}
        actionType="delete"
        title={`Delete "${target?.name ?? "category"}"?`}
        description={
          target && target.childCount > 0
            ? "This category has child categories. Move or delete them first."
            : target && target.productCount > 0
              ? "Products still reference this category. If any are active, deactivate or move them first; otherwise the category will be archived instead of deleted."
              : "The category will be permanently deleted."
        }
        confirmButtonText="Delete category"
        disabled={deleteState.isLoading || (!!target && target.childCount > 0)}
        onConfirm={() => void confirmDelete()}
      />
    </>
  );
}
