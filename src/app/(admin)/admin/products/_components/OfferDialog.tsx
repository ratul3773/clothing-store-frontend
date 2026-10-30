"use client";

import { useEffect, useMemo } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import Modal from "@/components/cms/Modal";
import { Btn } from "@/components/cms/ui";
import { useStore } from "@/components/providers/StoreProvider";
import { apiErrorMessage } from "@/redux/api.utils";
import {
  useCreateOfferMutation,
  useUpdateOfferMutation,
} from "@/redux/apis/product.api";
import type { ProductOffer } from "@/redux/apis/types/product.types";
import { bdt } from "@/lib/utils";

import {
  offerFormSchema,
  type OfferFormValues,
} from "../_schemas/product.schema";
import {
  dateInputToISO,
  dateInputToISOOrNull,
  formatDateTimeInput,
} from "../_utils/products.utils";
import { SwitchField, TextField } from "../../_components/form-controls";

type Props = {
  productId: string;
  regularPrice: number;
  offer?: ProductOffer;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export default function OfferDialog({
  productId,
  regularPrice,
  offer,
  open,
  onOpenChange,
}: Props) {
  const { toast, toastError } = useStore();
  const [createOffer, createState] = useCreateOfferMutation();
  const [updateOffer, updateState] = useUpdateOfferMutation();

  const schema = useMemo(() => offerFormSchema(regularPrice), [regularPrice]);

  const form = useForm<OfferFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      offerPrice: "",
      startsAt: "",
      endsAt: "",
      isActive: true,
    },
  });

  useEffect(() => {
    if (!open) return;
    form.reset({
      offerPrice: offer ? String(offer.offerPrice) : "",
      startsAt: formatDateTimeInput(offer?.startsAt ?? new Date().toISOString()),
      endsAt: formatDateTimeInput(offer?.endsAt),
      isActive: offer?.isActive ?? true,
    });
  }, [open, offer, form]);

  const onSubmit = form.handleSubmit(async (values) => {
    const payload = {
      offerPrice: Number(values.offerPrice),
      startsAt: dateInputToISO(values.startsAt),
      endsAt: dateInputToISOOrNull(values.endsAt),
      isActive: values.isActive,
    };

    try {
      if (offer) {
        await updateOffer({
          productId,
          offerId: offer.id,
          data: payload,
        }).unwrap();
        toast("Offer updated.");
      } else {
        await createOffer({ productId, data: payload }).unwrap();
        toast("Offer created.");
      }
      onOpenChange(false);
    } catch (error) {
      toastError(apiErrorMessage(error, "The offer could not be saved."));
    }
  });

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title={offer ? "Edit offer" : "Add offer"}
      description={`Regular price is ${bdt(regularPrice)}. Offer price must be lower.`}
      footer={
        <>
          <Btn onClick={() => onOpenChange(false)}>Cancel</Btn>
          <Btn
            type="submit"
            form="offer-form"
            variant="primary"
            disabled={
              createState.isLoading || 
              updateState.isLoading || 
              !form.formState.isDirty
            }
          >
            {createState.isLoading || updateState.isLoading
              ? "Saving…"
              : "Save offer"}
          </Btn>
        </>
      }
    >
      <form id="offer-form" onSubmit={onSubmit} className="space-y-4">
        <TextField
          form={form}
          name="offerPrice"
          label="Offer price (৳)"
          inputMode="numeric"
          placeholder="e.g. 1990"
        />
        <div className="grid gap-4 sm:grid-cols-2">
          <TextField
            form={form}
            name="startsAt"
            label="Starts at"
            type="datetime-local"
          />
          <TextField
            form={form}
            name="endsAt"
            label="Ends at"
            type="datetime-local"
            hint="Leave empty for no end date."
          />
        </div>
        <SwitchField
          form={form}
          name="isActive"
          label="Active"
          description="Inactive offers stay on the product but do not affect the price."
        />
      </form>
    </Modal>
  );
}
