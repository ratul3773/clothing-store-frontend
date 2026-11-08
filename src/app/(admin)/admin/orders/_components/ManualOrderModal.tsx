"use client";

import { useState } from "react";
import { useForm, useFieldArray, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import Modal from "@/components/cms/Modal";
import { Btn } from "@/components/cms/ui";
import { FormField } from "@/components/common/form-field";
import OrderReceipt from "@/components/common/OrderReceipt";
import { Skeleton } from "@/components/ui/skeleton";
import { productApi, useGetProductsQuery } from "@/redux/apis/product.api";
import { useAppDispatch } from "@/redux/hooks";
import {
  useGetOrderDeliveryPolicyQuery,
  useSearchOrderCustomersQuery,
} from "@/redux/apis/order.api";
import { apiErrorMessage } from "@/redux/api.utils";
import type { PublicProduct } from "@/redux/apis/types/product.types";
import type {
  CustomerOption,
  OrderDisplay,
} from "@/redux/apis/types/order.types";
import {
  addressFieldLabels,
  emptyOrderAddress,
  zoneOptions,
} from "@/lib/order-form";
import { orderLabel } from "@/lib/order-rules";
import { manualOrderLines, orderTotals } from "@/lib/order-summary";
import useOrderAttempt from "@/hooks/useOrderAttempt";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import {
  manualOrderFormSchema,
  manualOrderPayload,
  type ManualOrderFormValues,
} from "../_schemas/manual-order.schema";
import ManualOrderLines from "./ManualOrderLines";
import { CmsButton } from "@/components/ui/button";

export default function ManualOrderModal({
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
  return (
    <Modal
      open={open}
      onOpenChange={(value) => {
        if (!attempt.pending) onOpenChange(value);
      }}
      variant="dialog"
      size="xl"
      title="Create manual order"
      description="Record a COD order taken by phone, chat, or in person."
      errorMsg={
        attempt.error ||
        reviewError ||
        (policy.error ? apiErrorMessage(policy.error) : "")
      }
      footer={
        <>
          <CmsButton
            variant="outline"
            disabled={attempt.pending}
            onClick={() => onOpenChange(false)}
          >
            Close
          </CmsButton>
          {attempt.attempt ? (
            <CmsButton
              disabled={attempt.pending}
              onClick={() => void attempt.submit()}
            >
              {attempt.pending ? "Confirming…" : "Retry original order"}
            </CmsButton>
          ) : (
            <>
              {(attempt.conflict || policy.error) && (
                <CmsButton
                  variant="outline"
                  disabled={locked} onClick={() => void refreshPrices()}>
                  Refresh prices and availability
                </CmsButton>
              )}
              <CmsButton
                disabled={
                  locked ||
                  attempt.conflict ||
                  policy.isFetching ||
                  !!policy.error ||
                  !policy.currentData
                }
                onClick={() => void create()}
              >
                Create COD order
              </CmsButton>
            </>
          )}
        </>
      }
    >
      {attempt.attempt ? (
        <p className="text-sm">
          A previous submission needs its result confirmed. Retry that exact
          order before creating another.
        </p>
      ) : (
        <form onSubmit={create} noValidate className="space-y-6">
          <fieldset disabled={locked} className="space-y-5">
            <FormField
              form={form}
              id="manual-customer-search"
              name="customerSearch"
              label="Find an account (optional)"
              isInput
              placeholder="Name, phone or email — at least 2 characters"
              disabled={locked}
            />
            {customerQuery.isFetching && (
              <p role="status">Finding customers…</p>
            )}
            {customerQuery.error && (
              <p role="alert">{apiErrorMessage(customerQuery.error)}</p>
            )}
            <FormField
              form={form}
              id="manual-customer"
              name="customerId"
              label="Link to customer"
              isSelect
              disabled={locked}
              onValueChange={(id) => {
                const customer = customerOptions.find((item) => item.id === id);
                setSelectedCustomer(customer ?? null);
                if (customer) {
                  form.setValue("address.recipientName", customer.name);
                  form.setValue("address.recipientPhone", customer.phone ?? "");
                }
              }}
              options={[
                { value: "none", label: "Unlinked — managed by admin" },
                ...customerOptions.map((customer) => ({
                  value: customer.id,
                  label: `${customer.name} · ${customer.phone ?? customer.email}`,
                })),
              ]}
            />
            <div className="grid gap-3 sm:grid-cols-2">
              {(
                Object.keys(addressFieldLabels) as Array<
                  keyof typeof addressFieldLabels
                >
              ).map((name) => (
                <FormField
                  key={name}
                  form={form}
                  id={`manual-${name}`}
                  name={`address.${name}`}
                  label={addressFieldLabels[name]}
                  isInput={name !== "zone" && name !== "addressLine"}
                  isTextArea={name === "addressLine"}
                  isSelect={name === "zone"}
                  options={name === "zone" ? zoneOptions : undefined}
                  disabled={locked}
                  isAdmin
                  type={name === "recipientPhone" ? "tel" : "text"}
                  className={
                    name === "addressLine" ? "sm:col-span-2" : undefined
                  }
                />
              ))}
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <FormField
                form={form}
                id="manual-source"
                name="source"
                label="Source"
                isSelect
                isAdmin
                disabled={locked}
                options={[
                  "ADMIN_MANUAL",
                  "WHATSAPP",
                  "FACEBOOK",
                  "INSTAGRAM",
                  "PHONE",
                ].map((value) => ({ value, label: orderLabel(value) }))}
              />
              <FormField
                form={form}
                id="manual-status"
                name="status"
                label="Initial status"
                isSelect
                isAdmin
                disabled={locked}
                options={["CONFIRMED", "PENDING_CONFIRMATION"].map((value) => ({
                  value,
                  label: orderLabel(value),
                }))}
              />
            </div>
            <FormField
              form={form}
              id="manual-catalog-search"
              name="catalogSearch"
              label="Find products or combos"
              isInput
              isAdmin
              placeholder="Search catalog — at least 2 characters"
              disabled={locked}
            />
            {catalogQuery.isFetching && <Skeleton className="h-20" />}
            {catalogQuery.error && (
              <p role="alert">{apiErrorMessage(catalogQuery.error)}</p>
            )}
            <div className="flex flex-wrap gap-2">
              {catalogQuery.currentData?.items.map((product) => (
                <CmsButton
                  key={product.id}
                  disabled={locked || array.fields.length >= 50}
                  onClick={() => {
                    setCatalogs((current) => ({
                      ...current,
                      [product.id]: product,
                    }));
                    array.append({
                      type: product.type === "COMBO" ? "COMBO" : "VARIANT",
                      catalogId: product.id,
                      name: product.name,
                      variantId: "",
                      quantity: "1",
                      selections:
                        product.type === "COMBO"
                          ? product.items.map((item) => ({
                              comboItemId: item.id,
                              variantId: "",
                            }))
                          : [],
                    });
                  }}
                >
                  Add {product.name}
                  {product.type === "COMBO" ? " (combo)" : ""}
                </CmsButton>
              ))}
            </div>
            <ManualOrderLines
              form={form}
              catalogs={catalogs}
              fields={array.fields}
              remove={array.remove}
              disabled={locked}
            />
            <div className="grid gap-3 sm:grid-cols-2">
              <FormField
                form={form}
                id="manual-discount"
                name="discount"
                label="Discount (taka)"
                type="number"
                min={0}
                isInput
                isAdmin
                disabled={locked}
              />
              <FormField
                form={form}
                id="manual-delivery"
                name="deliveryOverride"
                label="Delivery override (optional)"
                type="number"
                min={0}
                isInput
                isAdmin
                disabled={locked}
              />
            </div>
            <FormField
              form={form}
              id="manual-adjustment"
              name="adjustmentReason"
              label="Pricing adjustment reason"
              isTextArea
              isAdmin
              disabled={locked}
            />
            <FormField
              form={form}
              id="manual-note"
              name="note"
              label="Order note (visible on receipt)"
              isTextArea
              isAdmin
              disabled={locked}
            />
            <p className="text-sm text-muted-foreground">
              Cash on delivery only. Confirmed orders cannot be cancelled;
              pending orders expire after 24 hours.
            </p>
          </fieldset>
          {summary && (
            <div className="border-t border-border pt-5">
              <OrderReceipt order={summary} />
            </div>
          )}
        </form>
      )}
    </Modal>
  );
}
