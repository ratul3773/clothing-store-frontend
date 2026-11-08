"use client";

import { useStore } from "@/components/providers/StoreProvider";
import { apiErrorMessage } from "@/redux/api.utils";
import { useDeleteCategoryMutation } from "@/redux/apis/category.api";
import type { CategoryRow } from "@/redux/apis/types/category.types";
import { useState } from "react";

export default function useCategoriesTable() {
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
  return { deleteState, target, setTarget, confirmDelete };
}
