"use client";

import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useGetAddressesQuery } from "@/redux/apis/address.api";
import { useGetOrderDeliveryPolicyQuery } from "@/redux/apis/order.api";
import type {
  CheckoutPayload,
  OrderDisplay,
  OrderReceipt,
} from "@/redux/apis/types/order.types";
import { apiErrorMessage } from "@/redux/api.utils";
import { clearCheckoutHandoff, readCheckoutHandoff } from "@/lib/order-storage";
import { emptyOrderAddress, orderAddressPayload } from "@/lib/order-form";
import { cartOrderLines, orderTotals } from "@/lib/order-summary";
import useOrderAttempt from "@/hooks/useOrderAttempt";
import type useCart from "@/hooks/useCart";
import {
  checkoutFormSchema,
  type CheckoutFormValues,
} from "../_schemas/checkout.schema";

export default function useCheckout(
  owner: string,
  cart: ReturnType<typeof useCart>["cart"],
) {
  const router = useRouter();
  const [handoff] = useState(() => readCheckoutHandoff(owner));
  const [completed, setCompleted] = useState<OrderReceipt | null>(null);
  const policy = useGetOrderDeliveryPolicyQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });
  const {
    currentData: addresses = [],
    error: addressError,
    refetch: retryAddresses,
  } = useGetAddressesQuery(undefined, { skip: cart.mode !== "account" });
  const form = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutFormSchema),
    defaultValues: {
      savedAddressId: "new",
      address: emptyOrderAddress,
      note: "",
    },
    mode: "onChange",
  });
  const address = useWatch({ control: form.control, name: "address" });
  const attempt = useOrderAttempt(owner, false, (order) => {
    clearCheckoutHandoff();
    setCompleted(order);
    router.push(`/order?id=${order.id}`);
  });
  const selectAddress = (id: string) => {
    const selected = addresses.find((item) => item.id === id);
    if (selected)
      form.setValue("address", {
        recipientName: selected.recipientName,
        recipientPhone: selected.recipientPhone,
        district: selected.district,
        area: selected.area,
        addressLine: selected.addressLine,
        postalCode: selected.postalCode ?? "",
        zone: selected.zone,
      });
  };
  const selected = cart.lines.filter((line) =>
    handoff?.lines.some(
      (item) => item.id === line.id && item.type === line.type,
    ),
  );
  const validSelection =
    !!handoff &&
    cart.ready &&
    !attempt.conflict &&
    handoff.version === cart.version &&
    selected.length === handoff.lines.length &&
    selected.every((line) => line.status === "AVAILABLE");
  const lines = validSelection ? cartOrderLines(selected) : [];
  const totals = policy.currentData
    ? orderTotals(
        lines.reduce((sum, line) => sum + line.unitPrice * line.quantity, 0),
        address.zone,
        policy.currentData,
      )
    : null;
  const summary: OrderDisplay | null =
    totals && validSelection ? { ...address, ...totals, lines } : null;
  const place = (event?: React.BaseSyntheticEvent) =>
    form.handleSubmit(async (values) => {
      if (
        !handoff ||
        !validSelection ||
        !totals ||
        policy.isFetching ||
        policy.error ||
        attempt.attempt ||
        attempt.pending ||
        cart.busy ||
        cart.refreshing
      )
        return;
      const saved = addresses.find((item) => item.id === values.savedAddressId);
      const unchanged =
        saved &&
        Object.entries(values.address).every(
          ([key, value]) => value === (saved[key as keyof typeof saved] ?? ""),
        );
      const body: CheckoutPayload = {
        lines: handoff.lines,
        version: handoff.version,
        destination: unchanged
          ? { addressId: values.savedAddressId }
          : { address: orderAddressPayload(values.address) },
        ...(values.note ? { note: values.note } : {}),
        expected: totals,
      };
      await attempt.submit(body);
    })(event);
  return {
    form,
    addresses,
    selectAddress,
    addressError,
    retryAddresses,
    validSelection,
    summary,
    place,
    attempt,
    completed,
    policyLoading: policy.isFetching,
    policyError: policy.error ? apiErrorMessage(policy.error) : "",
    retryPolicy: policy.refetch,
  };
}
