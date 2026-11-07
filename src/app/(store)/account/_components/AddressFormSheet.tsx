"use client";

import type { UseFormReturn } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Sheet } from "@/components/ui/sheeet";

import type { AddressFormValues } from "@/app/(store)/account/_schemas/address.schema";
import { FormField } from "@/components/common/form-field";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  form: UseFormReturn<AddressFormValues>;
  editing: boolean;
  isSaving: boolean;
  onSubmit: () => void;
}

const ZONE_OPTIONS = [
  { value: "INSIDE_DHAKA", label: "Inside Dhaka" },
  { value: "OUTSIDE_DHAKA", label: "Outside Dhaka" },
];

export default function AddressFormSheet({
  open,
  onOpenChange,
  form,
  editing,
  isSaving,
  onSubmit,
}: Props) {
  return (
    <Sheet
      open={open}
      onOpenChange={onOpenChange}
      title={editing ? "Edit address" : "Add address"}
      description="Used for delivery at checkout."
      side="center"
    >
      <form onSubmit={onSubmit} noValidate className="space-y-4 p-5">
        {/* <TextField
          form={form}
          name="label"
          label="Label (optional)"
          placeholder="Home, Office…"
        /> */}
        <FormField
          form={form}
          name="label"
          type="text"
          id="label"
          isInput
          label="Label (optional)"
          placeholder="Home, Office…"
          // startIcon={}
        />
        {/* <TextField
          form={form}
          name="recipientName"
          label="Recipient name"
          autoComplete="name"
        /> */}
        <FormField
          form={form}
          name="recipientName"
          type="text"
          id="recipientName"
          isInput
          placeholder="Recipient name"
          label="Recipient name"
          autoComplete="name"
        />
        <FormField
          form={form}
          name="recipientPhone"
          type="tel"
          id="recipientPhone"
          isInput
          label="Mobile number"
          inputMode="tel"
          autoComplete="tel"
          placeholder="01XXX XXXXXX"
        />
        <FormField
          form={form}
          name="addressLine"
          type="text"
          id="addressLine"
          isTextArea
          label="Address"
          placeholder="House, road, area"
        />
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField
            form={form}
            name="district"
            type="text"
            id="district"
            isInput
            label="District"
          />
          <FormField
            form={form}
            name="area"
            type="text"
            id="area"
            isInput
            label="Area / thana"
          />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField
            form={form}
            name="postalCode"
            type="text"
            id="postalCode"
            isInput
            label="Postal code (optional)"
          />
          <FormField
            form={form}
            name="zone"
            isSelect
            id="zone"
            options={ZONE_OPTIONS}
            label="Delivery zone"
          />
        </div>
        <FormField
          form={form}
          name="isDefault"
          isSwitch
          id="isDefault"
          label="Set as default address"
        />
        <Button
          type="submit"
          className="w-full"
          size="lg"
          variant="accent"
          disabled={isSaving}
        >
          {isSaving ? "Saving…" : editing ? "Save changes" : "Add address"}
        </Button>
      </form>
    </Sheet>
  );
}
