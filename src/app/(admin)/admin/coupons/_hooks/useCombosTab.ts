"use client";

import { apiErrorMessage } from "@/redux/api.utils";
import {
  useGetAdminCombosQuery,
  useUpdateComboMutation,
} from "@/redux/apis/combo.api";
import type { Combo } from "@/redux/apis/types/combo.types";
import { useState } from "react";
import { toast } from "sonner";

export default function useCombosTab() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [editing, setEditing] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [replacement, setReplacement] = useState(false);
  const {
    data: ComboData,
    isFetching,
    error,
    refetch,
  } = useGetAdminCombosQuery({ page, limit });
  const [update, updating] = useUpdateComboMutation();
  const edit = (combo: Combo) => {
    setEditing(combo.id);
    setReplacement(false);
    setOpen(true);
  };
  const changeOpen = (value: boolean) => {
    if (!saving) setOpen(value);
  };
  const toggle = async (combo: Combo) => {
    try {
      await update({
        id: combo.id,
        data: { isActive: !combo.isActive },
      }).unwrap();
      toast.success(combo.isActive ? "Combo deactivated" : "Combo activated");
    } catch (failure) {
      toast.error(apiErrorMessage(failure));
    }
  };
  return {
    setPage,
    setLimit,
    editing,
    setEditing,
    open,
    setOpen,
    setSaving,
    replacement,
    setReplacement,
    ComboData,
    isFetching,
    error,
    refetch,
    updating,
    edit,
    changeOpen,
    toggle,
  };
}
