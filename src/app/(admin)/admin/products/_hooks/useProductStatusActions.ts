"use client";

import { useStore } from "@/components/providers/StoreProvider";
import { apiErrorMessage } from "@/redux/api.utils";
import {
  useArchiveProductMutation,
  useDeleteProductMutation,
  usePublishProductMutation,
  useRestoreProductMutation,
  useUnpublishProductMutation,
} from "@/redux/apis/product.api";
import { useState } from "react";

export default function useProductStatusActions() {
  const { toast, toastError } = useStore();
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [publish, publishState] = usePublishProductMutation();
  const [unpublish, unpublishState] = useUnpublishProductMutation();
  const [archive, archiveState] = useArchiveProductMutation();
  const [restore, restoreState] = useRestoreProductMutation();
  const [remove, removeState] = useDeleteProductMutation();
  const busy =
    publishState.isLoading ||
    unpublishState.isLoading ||
    archiveState.isLoading ||
    restoreState.isLoading ||
    removeState.isLoading;
  const run = async (
    action: () => Promise<unknown>,
    success: string,
  ): Promise<boolean> => {
    try {
      await action();
      toast(success);
      return true;
    } catch (error) {
      toastError(apiErrorMessage(error, "The action could not be completed."));
      return false;
    }
  };
  return {
    confirmDelete,
    setConfirmDelete,
    publish,
    unpublish,
    archive,
    restore,
    remove,
    removeState,
    busy,
    run,
  };
}
