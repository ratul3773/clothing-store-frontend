"use client";

import type { UseFormReturn } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Sheet } from "@/components/ui/sheeet";

import type { AddressFormValues } from "@/app/(store)/account/_schemas/address.schema";
import { FormField } from "@/components/common/form-field";
import { Globe, House, Landmark, MapPin, Milestone, Phone, User } from "lucide-react";
import AlertText from "@/components/common/Alert";
import { FadeArc } from "@/components/animation/fade-arc";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  form: UseFormReturn<AddressFormValues>;
  editing: boolean;
  isSaving: boolean;
  onSubmit: () => void;
  error?: string;
  setError?: (error: string) => void;
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
  error,
  setError,
}: Props) {
  return (
    <Sheet
      open={open}
      onOpenChange={onOpenChange}
      title={editing ? "Edit address" : "Add address"}
      description="Used for delivery at checkout."
      side="center"
    >
      {error && (
        <div className="p-5">
          <AlertText
            title="Error"
            description={error}
            setSubmitError={setError}
          />
        </div>
      )}
      <form onSubmit={onSubmit} noValidate className="space-y-4 p-3">
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
          startIcon={User}
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
          startIcon={Phone}
        />
        <FormField
          form={form}
          name="addressLine"
          type="text"
          id="addressLine"
          isTextArea
          label="Address"
          placeholder="House, road, area"
          startIcon={House}
        />
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField
            form={form}
            name="district"
            type="text"
            id="district"
            isInput
            label="District"
            placeholder="e.g. Dhaka"
            startIcon={Landmark}
          />
          <FormField
            form={form}
            name="area"
            type="text"
            id="area"
            isInput
            label="Area / thana"
            placeholder="e.g. Mirpur"
            startIcon={MapPin}
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
            placeholder="e.g. 1216"
            startIcon={Milestone}
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
          className="py-2"
        />
        <div className="flex items-center justify-end">
        <Button
          type="submit"
          // className="w-full"
          size="md"
          variant="accent"
          disabled={isSaving}
        >
          {isSaving ? <><FadeArc className="size-4" /> Saving...</> : editing ? "Save changes" : "Add address"}
        </Button>
        </div>
      </form>
    </Sheet>
  );
}
