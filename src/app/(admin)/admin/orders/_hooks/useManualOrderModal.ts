"use client";

import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import useOrderAttempt from "@/hooks/useOrderAttempt";
import {
  emptyOrderAddress
} from "@/lib/order-form";
import { manualOrderLines, orderTotals } from "@/lib/order-summary";
import { apiErrorMessage } from "@/redux/api.utils";
import {
  useGetOrderDeliveryPolicyQuery,
  useSearchOrderCustomersQuery,
} from "@/redux/apis/order.api";
import { productApi, useGetProductsQuery } from "@/redux/apis/product.api";
import type {
  CustomerOption,
  OrderDisplay,
} from "@/redux/apis/types/order.types";
import type { PublicProduct } from "@/redux/apis/types/product.types";
import { useAppDispatch } from "@/redux/hooks";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useFieldArray, useForm, useWatch } from "react-hook-form";
import {
  manualOrderFormSchema,
  manualOrderPayload,
  type ManualOrderFormValues,
} from "../_schemas/manual-order.schema";

export default function useManualOrderModal({
  owner,
  open,
  onOpenChange,
}: {
  owner: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const router = useRouter();
  const [catalogs, setCatalogs] = useState<Record<string, PublicProduct>>({});
  const [selectedCustomer, setSelectedCustomer] =
    useState<CustomerOption | null>(null);
  const [reviewError, setReviewError] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const dispatch = useAppDispatch();
  const policy = useGetOrderDeliveryPolicyQuery(undefined, {
    skip: !open,
    refetchOnMountOrArgChange: true,
  });
  const form = useForm<ManualOrderFormValues>({
    resolver: zodResolver(manualOrderFormSchema),
    defaultValues: {
      address: emptyOrderAddress,
      customerSearch: "",
      customerId: "none",
      catalogSearch: "",
      lines: [],
      source: "ADMIN_MANUAL",
      status: "CONFIRMED",
      discount: "0",
      deliveryOverride: "",
      adjustmentReason: "",
      note: "",
    },
  });
  const array = useFieldArray({ control: form.control, name: "lines" });
  const searches = useWatch({
    control: form.control,
    name: ["catalogSearch", "customerSearch", "customerId"],
  });
  const catalogSearch = useDebouncedValue(searches[0].trim(), 350);
  const customerSearch = useDebouncedValue(searches[1].trim(), 350);
  const catalogQuery = useGetProductsQuery(
    { q: catalogSearch, page: 1, limit: 10, inStock: "true" },
    { skip: catalogSearch.length < 2 || !open },
  );
  const customerQuery = useSearchOrderCustomersQuery(
    { q: customerSearch, owner },
    { skip: customerSearch.length < 2 || !open },
  );
  const attempt = useOrderAttempt(owner, true, (order) => {
    onOpenChange(false);
    router.push(`/admin/orders?id=${order.id}`);
  });
  const locked = attempt.pending || !!attempt.attempt || refreshing;
  const values = useWatch({ control: form.control });
  const parsed = manualOrderFormSchema.safeParse(values);
  const draft = parsed.success ? manualOrderPayload(parsed.data) : null;
  const lines = draft ? manualOrderLines(draft.lines, catalogs) : [];
  const complete =
    !!draft &&
    lines.length === draft.lines.length &&
    lines.every(
      (line, index) =>
        line.components.length ===
        (draft.lines[index].type === "COMBO"
          ? draft.lines[index].selections.length
          : 1),
    );
  const totals =
    draft && policy.currentData && complete
      ? orderTotals(
        lines.reduce((sum, line) => sum + line.quantity * line.unitPrice, 0),
        values.address?.zone ?? "INSIDE_DHAKA",
        policy.currentData,
        draft.discount,
        draft.deliveryOverride,
      )
      : null;
  const summary: OrderDisplay | null =
    totals && parsed.success
      ? { ...parsed.data.address, ...totals, lines }
      : null;
  const customerOptions = [
    ...new Map(
      [
        ...(selectedCustomer ? [selectedCustomer] : []),
        ...(customerQuery.currentData ?? []),
      ].map((customer) => [customer.id, customer]),
    ).values(),
  ];
  const create = (event?: React.BaseSyntheticEvent) =>
    form.handleSubmit(async (values) => {
      if (locked || attempt.conflict || policy.isFetching || policy.error)
        return;
      setReviewError("");
      if (!totals) {
        setReviewError(
          "Selected products or sizes are unavailable. Remove or reselect them before creating the order.",
        );
        return;
      }
      if (totals.discount > totals.subtotal) {
        setReviewError("Discount cannot exceed subtotal");
        return;
      }
      await attempt.submit({ ...manualOrderPayload(values), expected: totals });
    })(event);
  const refreshPrices = async () => {
    setRefreshing(true);
    try {
      const ids = [
        ...new Set(form.getValues("lines").map((line) => line.catalogId)),
      ];
      const result = ids.length
        ? await dispatch(
          productApi.endpoints.getProducts.initiate(
            { ids, page: 1, limit: ids.length },
            { subscribe: false, forceRefetch: true },
          ),
        ).unwrap()
        : { items: [] };
      await policy.refetch().unwrap();
      setCatalogs(
        Object.fromEntries(result.items.map((item) => [item.id, item])),
      );
      attempt.clearConflict();
    } catch (error) {
      setReviewError(apiErrorMessage(error));
    } finally {
      setRefreshing(false);
    }
  };
  return {
    catalogs,
    setCatalogs,
    setSelectedCustomer,
    reviewError,
    policy,
    form,
    array,
    catalogQuery,
    customerQuery,
    attempt,
    locked,
    summary,
    customerOptions,
    create,
    refreshPrices,
  };
}
