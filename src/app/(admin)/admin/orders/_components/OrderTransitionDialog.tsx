"use client";

import useOrderTransitionDialog from "../_hooks/useOrderTransitionDialog";
import AlertDialogText from "@/components/common/Alert-Dialogue";

import { FormField } from "@/components/common/form-field";
import { orderLabel } from "@/lib/order-rules";
import type { OrderReceipt, OrderStatus } from "@/redux/apis/types/order.types";

export default function OrderTransitionDialog({
  order,
  target,
  onClose,
  onConflict,
}: {
  order: OrderReceipt;
  target: OrderStatus;
  onClose: () => void;
  onConflict: () => void;
}) {
  const { error, components, form, array, pending, submit, needsReason } =
    useOrderTransitionDialog({
      order,
      target,
      onClose,
      onConflict,
    });
  return (
    <AlertDialogText
      open
      title={
        target === "RETURNED"
          ? "Inspect returned goods"
          : `Mark ${orderLabel(target).toLowerCase()}?`
      }
      description="This action updates order history and applicable stock balances."
      onOpenChange={(open) => {
        if (!open && !pending) onClose();
      }}
      mode="normal"
      actionType={needsReason ? "warning" : "update"}
      size={target === "RETURNED" ? "default" : "sm"}
      disabled={pending}
      confirmButtonText={pending ? "Saving…" : "Confirm"}
      onConfirm={(event) => {
        event.preventDefault();
        void submit();
      }}
      warningMessage={
        <div className="max-h-[60vh] space-y-4 overflow-y-auto">
          {error && (
            <p role="alert" className="text-destructive">
              {error}
            </p>
          )}
          {needsReason && (
            <form onSubmit={submit} noValidate className="space-y-4">
              <fieldset disabled={pending} className="space-y-4">
                <FormField
                  form={form}
                  id="order-action-reason"
                  name="reason"
                  label="Reason"
                  isTextArea
                  disabled={pending}
                />
                {array.fields.map((field, index) => (
                  <div
                    key={field.fieldId}
                    className="space-y-3 rounded border border-border p-3"
                  >
                    <p className="text-sm font-medium">
                      {components[index]!.productName} ·{" "}
                      {components[index]!.color} / {components[index]!.size} ×{" "}
                      {components[index]!.quantity}
                    </p>
                    <div className="grid grid-cols-2 gap-3">
                      <FormField
                        form={form}
                        id={`return-${index}-sellable`}
                        name={`components.${index}.sellable`}
                        label="Sellable"
                        isInput
                        type="number"
                        min={0}
                        disabled={pending}
                      />
                      <FormField
                        form={form}
                        id={`return-${index}-damaged`}
                        name={`components.${index}.damaged`}
                        label="Damaged"
                        isInput
                        type="number"
                        min={0}
                        disabled={pending}
                      />
                    </div>
                  </div>
                ))}
              </fieldset>
            </form>
          )}
        </div>
      }
    />
  );
}
