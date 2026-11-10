"use client";

import type { UseFormReturn } from "react-hook-form";
import { FormField } from "@/components/common/form-field";
import { addressFieldLabels, zoneOptions } from "@/lib/order-form";
import type { Address } from "@/redux/apis/types/address.types";
import type { CheckoutFormValues } from "../_schemas/checkout.schema";

export default function CheckoutForm({
  form,
  addresses,
  disabled,
  onSelectAddress,
}: {
  form: UseFormReturn<CheckoutFormValues>;
  addresses: Address[];
  disabled: boolean;
  onSelectAddress: (id: string) => void;
}) {
  const isAddressSelected = form.watch("savedAddressId") !== "new";
  return (
    <fieldset disabled={disabled} className="space-y-5">
      <legend className="mb-4 px-2 font-display text-xl">Contact & delivery</legend>
      {addresses.length > 0 && (
        <FormField
          form={form}
          id="checkout-saved-address"
          name="savedAddressId"
          onValueChange={onSelectAddress}
          label="Saved address"
          isSelect
          disabled={disabled}
          options={[
            { value: "new", label: "Enter a new address" },
            ...addresses.map((address) => ({
              value: address.id,
              label: `${address.label || address.recipientName} — ${address.addressLine}`,
            })),
          ]}
        />
      )}
      <div className="grid gap-4 sm:grid-cols-2">
        {(
          Object.keys(addressFieldLabels) as Array<
            keyof typeof addressFieldLabels
          >
        ).map((name) => (
          <FormField
            key={name}
            form={form}
            id={`checkout-${name}`}
            name={`address.${name}`}
            label={addressFieldLabels[name]}
            isInput={name !== "zone" && name !== "addressLine"}
            isTextArea={name === "addressLine"}
            isSelect={name === "zone"}
            options={name === "zone" ? zoneOptions : undefined}
            type={name === "recipientPhone" ? "tel" : "text"}
            disabled={disabled || (isAddressSelected)}
            className={name === "addressLine" ? "sm:col-span-2" : undefined}
          />
        ))}
      </div>
      <FormField
        form={form}
        id="checkout-note"
        name="note"
        label="Order note (optional)"
        isTextArea
        maxLength={1000}
        disabled={disabled}
      />
      <p className="rounded border border-border mx-2 p-4 text-sm">
        <strong>Cash on delivery</strong> — pay the full order total when it
        arrives.
      </p>
    </fieldset>
  );
}
