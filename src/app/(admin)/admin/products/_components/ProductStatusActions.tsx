"use client";

import { useState } from "react";
import { Archive, RotateCcw, Send, Trash2, Undo2 } from "lucide-react";

import AlertDialogText from "@/components/common/Alert-Dialogue";
import { Btn } from "@/components/cms/ui";
import { useStore } from "@/components/providers/StoreProvider";
import { apiErrorMessage } from "@/redux/api.utils";
import {
  useArchiveProductMutation,
  useDeleteProductMutation,
  usePublishProductMutation,
  useRestoreProductMutation,
  useUnpublishProductMutation,
} from "@/redux/apis/product.api";
import type { AdminProduct } from "@/redux/apis/types/product.types";

type Props = {
  product: AdminProduct;
  onDeleted?: () => void;
  size?: "sm" | "md";
};

export default function ProductStatusActions({
  product,
  onDeleted,
  size = "md",
}: Props) {
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

  return (
    <div className="flex flex-wrap items-center gap-2">
      {product.status === "DRAFT" && (
        <Btn
          size={size}
          variant="primary"
          disabled={busy}
          onClick={() =>
            void run(
              () => publish(product.id).unwrap(),
              "Product published.",
            )
          }
        >
          <Send className="size-3.5" /> Publish
        </Btn>
      )}

      {product.status === "ACTIVE" && (
        <Btn
          size={size}
          disabled={busy}
          onClick={() =>
            void run(
              () => unpublish(product.id).unwrap(),
              "Product moved back to draft.",
            )
          }
        >
          <Undo2 className="size-3.5" /> Unpublish
        </Btn>
      )}

      {product.status === "ARCHIVED" ? (
        <Btn
          size={size}
          disabled={busy}
          onClick={() =>
            void run(
              () => restore(product.id).unwrap(),
              "Product restored as a draft.",
            )
          }
        >
          <RotateCcw className="size-3.5" /> Restore
        </Btn>
      ) : (
        <Btn
          size={size}
          disabled={busy}
          onClick={() =>
            void run(
              () => archive(product.id).unwrap(),
              "Product archived.",
            )
          }
        >
          <Archive className="size-3.5" /> Archive
        </Btn>
      )}

      {product.status === "DRAFT" && (
        <>
          <Btn
            size={size}
            variant="dangerOutline"
            disabled={busy}
            onClick={() => setConfirmDelete(true)}
          >
            <Trash2 className="size-3.5" /> Delete
          </Btn>
          <AlertDialogText
            open={confirmDelete}
            onOpenChange={setConfirmDelete}
            actionType="delete"
            title="Delete this product?"
            description={`"${product.name}" will be permanently deleted. Only drafts without stock history or reservations can be deleted; otherwise archive it instead.`}
            confirmButtonText="Delete product"
            disabled={removeState.isLoading}
            onConfirm={async () => {
              const ok = await run(
                () => remove(product.id).unwrap(),
                "Product deleted.",
              );
              if (ok) {
                setConfirmDelete(false);
                onDeleted?.();
              }
            }}
          />
        </>
      )}
    </div>
  );
}
