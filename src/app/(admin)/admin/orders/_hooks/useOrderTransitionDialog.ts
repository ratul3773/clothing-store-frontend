"use client";

import { integerField } from "@/lib/order-form";
import { apiErrorMessage, isConflictError } from "@/redux/api.utils";
import {
  useChangeOrderStatusMutation,
  useReceiveOrderReturnMutation,
} from "@/redux/apis/order.api";
import type { OrderReceipt, OrderStatus } from "@/redux/apis/types/order.types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRef, useState, type BaseSyntheticEvent } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";

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

export default function useOrderTransitionDialog({
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
  const submitting = useRef(false);
  const needsReason = ["CANCELLED", "DELIVERY_FAILED", "RETURNED"].includes(target);
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
  const submit = (event?: BaseSyntheticEvent) => form.handleSubmit(async (values) => {
    if (pending || submitting.current) return;
    if (
      needsReason &&
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
    submitting.current = true;
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
          ...(needsReason ? { reason: values.reason } : {}),
        }).unwrap();
      onClose();
    } catch (failure) {
      setError(apiErrorMessage(failure));
      if (isConflictError(failure)) {
        onConflict();
      }
    } finally { submitting.current = false; }
  })(event);
  return { error, components, form, array, pending, submit, needsReason };
}
