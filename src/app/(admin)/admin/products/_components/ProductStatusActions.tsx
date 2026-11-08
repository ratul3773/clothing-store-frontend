"use client";

import useProductStatusActions from "../_hooks/useProductStatusActions";

import { Archive, RotateCcw, Send, Trash2, Undo2 } from "lucide-react";

import { Btn } from "@/components/cms/ui";
import AlertDialogText from "@/components/common/Alert-Dialogue";
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
  const {
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
  } = useProductStatusActions();

  return (
    <div className="flex flex-wrap items-center gap-2">
      {product.status === "DRAFT" && (
        <Btn
          size={size}
          variant="primary"
          disabled={busy}
          onClick={() =>
            void run(() => publish(product.id).unwrap(), "Product published.")
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
            void run(() => archive(product.id).unwrap(), "Product archived.")
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
