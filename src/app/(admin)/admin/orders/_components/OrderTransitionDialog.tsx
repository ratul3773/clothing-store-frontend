"use client";

import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Modal from "@/components/cms/Modal";
import { Btn } from "@/components/cms/ui";
import { FormField } from "@/components/common/form-field";
import { integerField } from "@/lib/order-form";
import { orderLabel } from "@/lib/order-rules";
import { apiErrorMessage, isConflictError } from "@/redux/api.utils";
import {
  useChangeOrderStatusMutation,
  useReceiveOrderReturnMutation,
} from "@/redux/apis/order.api";
import type { OrderReceipt, OrderStatus } from "@/redux/apis/types/order.types";

const schema = z.object({
  reason: z.string().trim().max(500),
  components: z.array(
    z.object({
      id: z.string(),
      sellable: integerField(0, 2_147_483_647),
      damaged: integerField(0, 2_147_483_647),
    }),
  ),
});

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
  const [error, setError] = useState("");
  const [changeStatus, statusState] = useChangeOrderStatusMutation();
  const [receiveReturn, returnState] = useReceiveOrderReturnMutation();
  const components = order.lines.flatMap((line) => line.components);
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      reason: "",
      components:
        target === "RETURNED"
          ? components.map((item) => ({
              id: item.id,
              sellable: "0",
              damaged: "0",
            }))
          : [],
    },
  });
  const array = useFieldArray({
    control: form.control,
    name: "components",
    keyName: "fieldId",
  });
  const pending = statusState.isLoading || returnState.isLoading;
  const submit = form.handleSubmit(async (values) => {
    if (pending) return;
    if (
      ["CANCELLED", "DELIVERY_FAILED", "RETURNED"].includes(target) &&
      !values.reason
    ) {
      form.setError("reason", { message: "A reason is required" });
      return;
    }
    if (target === "RETURNED") {
      let invalid = false;
      values.components.forEach((item, index) => {
        if (
          Number(item.sellable) + Number(item.damaged) !==
          components[index]!.quantity
        ) {
          form.setError(`components.${index}.sellable`, {
            message: `Account for all ${components[index]!.quantity} pieces`,
          });
          invalid = true;
        }
      });
      if (invalid) return;
    }
    setError("");
    try {
      if (target === "RETURNED")
        await receiveReturn({
          id: order.id,
          version: order.version,
          reason: values.reason,
          components: values.components.map((item) => ({
            id: item.id,
            sellable: Number(item.sellable),
            damaged: Number(item.damaged),
          })),
        }).unwrap();
      else if (target !== "PENDING_CONFIRMATION")
        await changeStatus({
          id: order.id,
          version: order.version,
          status: target,
          ...(values.reason ? { reason: values.reason } : {}),
        }).unwrap();
      onClose();
    } catch (failure) {
      setError(apiErrorMessage(failure));
      if (isConflictError(failure)) {
        onConflict();
      }
    }
  });
  return (
    <Modal
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
      errorMsg={error}
      footer={
        <>
          <Btn disabled={pending} onClick={onClose}>
            Back
          </Btn>
          <Btn
            variant="primary"
            disabled={pending}
            onClick={() => void submit()}
          >
            {pending ? "Saving…" : "Confirm"}
          </Btn>
        </>
      }
    >
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
                {components[index]!.productName} · {components[index]!.color} /{" "}
                {components[index]!.size} × {components[index]!.quantity}
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
    </Modal>
  );
}
