"use client";

import useManualOrderModal from "../_hooks/useManualOrderModal";

import Modal from "@/components/cms/Modal";
import { FormField } from "@/components/common/form-field";
import OrderReceipt from "@/components/common/OrderReceipt";
import { CmsButton } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  addressFieldLabels,
  zoneOptions
} from "@/lib/order-form";
import { orderLabel } from "@/lib/order-rules";
import { apiErrorMessage } from "@/redux/api.utils";
import ManualOrderLines from "./ManualOrderLines";
import { FadeArc } from "@/components/animation/fade-arc";

export default function ManualOrderModal({
  owner,
  open,
  onOpenChange,
}: {
  owner: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const {
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
  } = useManualOrderModal({
    owner,
    open,
    onOpenChange,
  });
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
                {attempt.pending ? <><FadeArc className="size-3.5" /> Creating…</> : "Create order"}
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
