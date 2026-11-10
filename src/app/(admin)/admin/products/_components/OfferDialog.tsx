"use client";

import { CmsButton } from "@/components/ui/button";
import useOfferDialog, { type Props } from "../_hooks/useOfferDialog";

import Modal from "@/components/cms/Modal";

import { bdt } from "@/lib/utils";

import { FormField } from "@/components/common/form-field";
import { FadeArc } from "@/components/animation/fade-arc";

export default function OfferDialog({
  productId,
  regularPrice,
  offer,
  open,
  onOpenChange,
}: Props) {
  const { createState, updateState, form, onSubmit } = useOfferDialog({
    productId,
    regularPrice,
    offer,
    open,
    onOpenChange,
  });

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title={offer ? "Edit offer" : "Add offer"}
      description={`Regular price is ${bdt(regularPrice)}. Offer price must be lower.`}
      footer={
        <>
          <CmsButton variant="outline" onClick={() => onOpenChange(false)}>Cancel</CmsButton>
          <CmsButton
            type="submit"
            form="offer-form"
            variant="default"
            disabled={
              createState.isLoading ||
              updateState.isLoading ||
              !form.formState.isDirty
            }
          >
            {createState.isLoading || updateState.isLoading
              ? <><FadeArc className="size-3.5" /> Saving…</>
              : "Save offer"}
          </CmsButton>
        </>
      }
    >
      <form id="offer-form" onSubmit={onSubmit} className="space-y-4">
        <FormField isAdmin isInput id="offerPrice" form={form}
          name="offerPrice"
          label="Offer price (৳)"
          inputMode="numeric"
          placeholder="e.g. 1990" />
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField isAdmin isInput id="startsAt" form={form}
            name="startsAt"
            label="Starts at"
            type="datetime-local" />
          <FormField isAdmin isInput id="endsAt" form={form}
            name="endsAt"
            label="Ends at"
            type="datetime-local"
            description="Leave empty for no end date." />
        </div>
        <FormField isAdmin isSwitch id="isActive" form={form}
          name="isActive"
          label="Active"
          description="Inactive offers stay on the product but do not affect the price." />
      </form>
    </Modal>
  );
}
