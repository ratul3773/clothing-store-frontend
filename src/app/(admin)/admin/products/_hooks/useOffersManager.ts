"use client";

import { useStore } from "@/components/providers/StoreProvider";
import { apiErrorMessage } from "@/redux/api.utils";
import {
  useDeactivateOfferMutation,
  useUpdateOfferMutation,
} from "@/redux/apis/product.api";
import type {
  AdminProduct,
  ProductOffer,
} from "@/redux/apis/types/product.types";
import { useState } from "react";

export default function useOffersManager({ product }: { product: AdminProduct }) {
  const { toast, toastError } = useStore();
  const [updateOffer, updateState] = useUpdateOfferMutation();
  const [deactivateOffer, deactivateState] = useDeactivateOfferMutation();
  const [dialog, setDialog] = useState<{ open: boolean; offer?: ProductOffer }>(
    {
      open: false,
    },
  );
  const [target, setTarget] = useState<ProductOffer | null>(null);
  const offers = [...product.offers].sort(
    (a, b) =>
      Number(b.isActive) - Number(a.isActive) ||
      new Date(b.startsAt).getTime() - new Date(a.startsAt).getTime(),
  );
  const toggleActive = async (offer: ProductOffer) => {
    try {
      await updateOffer({
        productId: product.id,
        offerId: offer.id,
        data: { isActive: !offer.isActive },
      }).unwrap();
      toast(offer.isActive ? "Offer paused." : "Offer activated.");
    } catch (error) {
      toastError(apiErrorMessage(error, "The offer could not be updated."));
    }
  };
  const confirmDeactivate = async () => {
    if (!target) return;
    try {
      await deactivateOffer({
        productId: product.id,
        offerId: target.id,
      }).unwrap();
      toast("Offer deactivated.");
      setTarget(null);
    } catch (error) {
      toastError(apiErrorMessage(error, "The offer could not be deactivated."));
    }
  };
  return {
    updateState,
    deactivateState,
    dialog,
    setDialog,
    target,
    setTarget,
    offers,
    toggleActive,
    confirmDeactivate,
  };
}
