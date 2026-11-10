"use client";
import { useWatch } from "react-hook-form";

import { useStore } from "@/components/providers/StoreProvider";
import { apiErrorMessage } from "@/redux/api.utils";
import {
  useAdjustStockMutation,
  useGetStockMovementsQuery,
} from "@/redux/apis/product.api";
import type {
  AdminVariant,
  StockAdjustmentPayload,
} from "@/redux/apis/types/product.types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import {
  stockAdjustmentFormSchema,
  type StockAdjustmentFormValues,
} from "../_schemas/product.schema";

export type Props = {
  productId: string;
  variant: AdminVariant;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const emptyValues: StockAdjustmentFormValues = {
  type: "RESTOCK",
  quantity: "",
  onHand: "",
  note: "",
};

export default function useStockAdjustDialog({
  productId,
  variant,
  open,
  onOpenChange,
}: Props) {
  const { toast, toastError } = useStore();
  const [tab, setTab] = useState<"adjust" | "history">("adjust");
  const [historyPage, setHistoryPage] = useState(1);
  const [adjustStock, adjustState] = useAdjustStockMutation();
  const form = useForm<StockAdjustmentFormValues>({
    resolver: zodResolver(stockAdjustmentFormSchema),
    defaultValues: emptyValues,
  });
  const type = useWatch({ control: form.control, name: "type" });
  const { data: history, isFetching: historyLoading } =
    useGetStockMovementsQuery(
      { productId, variantId: variant.id, page: historyPage, limit: 10 },
      { skip: !open || tab !== "history" },
    );
  const onSubmit = form.handleSubmit(async (values) => {
    const payload: StockAdjustmentPayload = {
      type: values.type,
      note: values.note.trim() === "" ? null : values.note.trim(),
    };

    if (values.type === "STOCKTAKE") {
      payload.onHand = Number(values.onHand);
    } else {
      payload.quantity = Number(values.quantity);
    }

    try {
      await adjustStock({
        productId,
        variantId: variant.id,
        data: payload,
      }).unwrap();
      toast("Stock updated.");
      form.reset(emptyValues);
      onOpenChange(false);
    } catch (error) {
      toastError(apiErrorMessage(error, "Stock could not be adjusted."));
    }
  });
  return {
    tab,
    setTab,
    setHistoryPage,
    adjustState,
    form,
    type,
    history,
    historyLoading,
    onSubmit,
  };
}
