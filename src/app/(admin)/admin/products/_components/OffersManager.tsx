"use client";

import { useState } from "react";
import { Pencil, Plus, Power } from "lucide-react";

import AlertDialogText from "@/components/common/Alert-Dialogue";
import { Badge, Btn, Card, CardHeader, Empty } from "@/components/cms/ui";
import { useStore } from "@/components/providers/StoreProvider";
import { bdt } from "@/lib/utils";
import { apiErrorMessage } from "@/redux/api.utils";
import {
  useDeactivateOfferMutation,
  useUpdateOfferMutation,
} from "@/redux/apis/product.api";
import type {
  AdminProduct,
  ProductOffer,
} from "@/redux/apis/types/product.types";

import {
  formatDate,
  offerStateTone,
} from "../_utils/products.utils";
import OfferDialog from "./OfferDialog";

export default function OffersManager({ product }: { product: AdminProduct }) {
  const { toast, toastError } = useStore();
  const [updateOffer, updateState] = useUpdateOfferMutation();
  const [deactivateOffer, deactivateState] = useDeactivateOfferMutation();

  const [dialog, setDialog] = useState<{ open: boolean; offer?: ProductOffer }>({
    open: false,
  });
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

  return (
    <Card>
      <CardHeader
        title="Offers"
        description="Offers must be lower than the regular price and cannot overlap other active offers."
        actions={
          <Btn size="sm" onClick={() => setDialog({ open: true })}>
            <Plus className="size-3.5" /> Add offer
          </Btn>
        }
      />
      {offers.length === 0 ? (
        <Empty
          title="No offers"
          description="The product uses its regular price until an offer is active."
        />
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-[13px]">
            <thead>
              <tr className="border-b border-border bg-muted/50 text-xs text-muted-foreground">
                <th className="px-3 py-2 font-medium">Offer price</th>
                <th className="px-3 py-2 font-medium">State</th>
                <th className="px-3 py-2 font-medium">Starts</th>
                <th className="px-3 py-2 font-medium">Ends</th>
                <th className="px-3 py-2 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {offers.map((offer) => (
                <tr key={offer.id} className="border-b border-border last:border-0">
                  <td className="px-3 py-2 font-medium tabular-nums">
                    {bdt(offer.offerPrice)}
                  </td>
                  <td className="px-3 py-2">
                    <Badge tone={offerStateTone(offer.state)}>{offer.state}</Badge>
                  </td>
                  <td className="px-3 py-2 text-xs text-muted-foreground">
                    {formatDate(offer.startsAt)}
                  </td>
                  <td className="px-3 py-2 text-xs text-muted-foreground">
                    {offer.endsAt ? formatDate(offer.endsAt) : "No end date"}
                  </td>
                  <td className="px-3 py-2">
                    <div className="flex items-center justify-end gap-1">
                      <Btn
                        size="sm"
                        disabled={updateState.isLoading}
                        onClick={() => void toggleActive(offer)}
                      >
                        <Power className="size-3.5" />
                        {offer.isActive ? "Pause" : "Activate"}
                      </Btn>
                      <Btn
                        size="sm"
                        onClick={() => setDialog({ open: true, offer })}
                      >
                        <Pencil className="size-3.5" /> Edit
                      </Btn>
                      <Btn
                        size="sm"
                        variant="dangerOutline"
                        onClick={() => setTarget(offer)}
                      >
                        Deactivate
                      </Btn>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <OfferDialog
        productId={product.id}
        regularPrice={product.regularPrice}
        offer={dialog.offer}
        open={dialog.open}
        onOpenChange={(open) => setDialog((current) => ({ ...current, open }))}
      />

      <AlertDialogText
        open={!!target}
        onOpenChange={(open) => {
          if (!open) setTarget(null);
        }}
        actionType="warning"
        title="Deactivate this offer?"
        description="The offer is kept on the product but stops affecting the storefront price."
        confirmButtonText="Deactivate offer"
        disabled={deactivateState.isLoading}
        onConfirm={() => void confirmDeactivate()}
      />
    </Card>
  );
}
