"use client";

import { useStore } from "@/components/providers/StoreProvider";
import { apiErrorMessage } from "@/redux/api.utils";
import {
  useCreateOfferMutation,
  useUpdateOfferMutation,
} from "@/redux/apis/product.api";
import type { ProductOffer } from "@/redux/apis/types/product.types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import {
  offerFormSchema,
  type OfferFormValues,
} from "../_schemas/product.schema";
import {
  dateInputToISO,
  dateInputToISOOrNull,
  formatDateTimeInput,
} from "../_utils/products.utils";

export type Props = {
  productId: string;
  regularPrice: number;
  offer?: ProductOffer;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export default function useOfferDialog({
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
  return { createState, updateState, form, onSubmit };
}
