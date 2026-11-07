"use client";

import { motion } from "motion/react";
import { MapPin, Pencil, Star, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Address } from "@/redux/apis/types/address.types";
import { cn } from "@/lib/utils";
import { FadeArc } from "@/components/animation/fade-arc";
import { Badge } from "@/components/ui/badge";

interface Props {
  address: Address;
  onEdit: () => void;
  onMakeDefault: () => void;
  onDelete: () => void;
  isLoading?: boolean;
  isDeleting?: boolean;
}

export default function AddressCard({
  address,
  onEdit,
  onMakeDefault,
  onDelete,
  isLoading,
  isDeleting,
}: Props) {
  const location = [address.addressLine, address.area, address.district]
    .filter(Boolean)
    .join(", ");
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className={cn(
        "flex flex-col rounded-[3px] space-y-2 border p-5 transition hover:border-foreground",
        address.isDefault ? "border-accent bg-accent/5" : "border-border",
      )}
    >
      <div className="mb-3 flex items-start justify-between">
        <MapPin className="text-accent" />
        {address.isDefault && <Badge variant="accent">Default</Badge>}
      </div>
      <p className="font-display text-lg sm:text-xl">
        {address.label ?? address.recipientName}
      </p>
      <p className="text-sm">
        {address.recipientName} · {address.recipientPhone}
      </p>
      <p className="text-sm text-muted-foreground">
        {location}
        {address.postalCode ? ` ${address.postalCode}` : ""}
      </p>
      <p className="label-mono text-muted-foreground">
        {address.zone === "INSIDE_DHAKA" ? "Inside Dhaka" : "Outside Dhaka"}
      </p>
      <div className="mt-auto flex flex-wrap gap-2 border-t border-border pt-3">
        <Button size="sm" variant="outline" onClick={onEdit}>
          <Pencil size={13} /> Edit
        </Button>
        {!address.isDefault && (
          <Button
            size="sm"
            variant="ghost"
            onClick={onMakeDefault}
            disabled={isLoading || isDeleting}
          >
            {isLoading ? (
              <>
                <FadeArc className="size-4" /> Updating...
              </>
            ) : (
              <>
                <Star size={13} /> Make default
              </>
            )}
          </Button>
        )}
        <Button
          size="sm"
          variant="ghost"
          className="ml-auto text-accent"
          onClick={onDelete}
          disabled={isLoading || isDeleting}
        >
          {isDeleting ? (
            <>
              <FadeArc className="size-4" /> Deleting...
            </>
          ) : (
            <>
              <Trash2 size={13} /> Delete
            </>
          )}
        </Button>
      </div>
    </motion.div>
  );
}
