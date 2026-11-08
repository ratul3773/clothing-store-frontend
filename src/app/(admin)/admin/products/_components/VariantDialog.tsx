"use client";

import useCreateVariantDialog, { type Props } from "../_hooks/useCreateVariantDialog";
import useEditVariantDialog from "../_hooks/useEditVariantDialog";

import Modal from "@/components/cms/Modal";
import { Btn } from "@/components/cms/ui";
import type {
  AdminVariant
} from "@/redux/apis/types/product.types";

import { FormField } from "@/components/common/form-field";

export default function VariantDialog(props: Props) {
  return props.variant ? (
    <EditVariantDialog {...props} variant={props.variant} />
  ) : (
    <CreateVariantDialog {...props} />
  );
}

function CreateVariantDialog({ productId, colors, open, onOpenChange }: Props) {
  const { createState, form, onSubmit } = useCreateVariantDialog({ productId, colors, open, onOpenChange });

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title="Add variant"
      description="Every colour / size pair is unique. The SKU is generated from the product code."
      footer={
        <>
          <Btn onClick={() => onOpenChange(false)}>Cancel</Btn>
          <Btn
            type="submit"
            form="variant-create-form"
            variant="primary"
            disabled={createState.isLoading || !form.formState.isDirty}
          >
            {createState.isLoading ? "Saving…" : "Add variant"}
          </Btn>
        </>
      }
    >
      <form id="variant-create-form" onSubmit={onSubmit} className="space-y-4">
        {colors.length === 0 ? (
          <p className="rounded border border-border bg-muted/40 px-3 py-2 text-xs text-muted-foreground">
            Add a colour first.
          </p>
        ) : (
          <FormField isAdmin isSelect id="colorId" form={form}
            name="colorId"
            label="Colour"
            options={colors.map((color) => ({
              value: color.id,
              label: color.name,
            }))}
            placeholder="Select a colour" />
        )}
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField isAdmin isInput id="size" form={form}
            name="size"
            label="Size"
            placeholder="e.g. M" />
          <FormField isAdmin isInput id="sizeOrder" form={form}
            name="sizeOrder"
            label="Size order"
            inputMode="numeric"
            placeholder="e.g. 2"
            description="Controls the size order in the store." />
          <FormField isAdmin isInput id="onHand" form={form}
            name="onHand"
            label="Opening stock"
            inputMode="numeric"
            placeholder="0" />
          <FormField isAdmin isInput id="lowStockThreshold" form={form}
            name="lowStockThreshold"
            label="Low stock threshold"
            inputMode="numeric"
            placeholder="3" />
        </div>
        <FormField isAdmin isSwitch id="isActive" form={form}
          name="isActive"
          label="Active"
          description="Inactive variants are hidden from the storefront." />
      </form>
    </Modal>
  );
}

function EditVariantDialog({
  productId,
  variant,
  open,
  onOpenChange,
}: Props & { variant: AdminVariant }) {
  const { updateState, form, onSubmit } = useEditVariantDialog({
    productId,
    variant,
    open,
    onOpenChange,
  });

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title={`Edit ${variant.colorName} / ${variant.size}`}
      description={variant.sku}
      footer={
        <>
          <Btn onClick={() => onOpenChange(false)}>Cancel</Btn>
          <Btn
            type="submit"
            form="variant-edit-form"
            variant="primary"
            disabled={updateState.isLoading || !form.formState.isDirty}
          >
            {updateState.isLoading ? "Saving…" : "Save variant"}
          </Btn>
        </>
      }
    >
      <form id="variant-edit-form" onSubmit={onSubmit} className="space-y-4">
        <div className="rounded border border-border bg-muted/40 px-3 py-2 text-xs text-muted-foreground">
          Colour: {variant.colorName} · SKU: {variant.sku} · On hand:{" "}
          {variant.onHand}
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField isAdmin isInput id="size" form={form}
            name="size"
            label="Size" />
          <FormField isAdmin isInput id="sizeOrder" form={form}
            name="sizeOrder"
            label="Size order"
            inputMode="numeric" />
          <FormField isAdmin isInput id="lowStockThreshold" form={form}
            name="lowStockThreshold"
            label="Low stock threshold"
            inputMode="numeric" />
        </div>
        <FormField isAdmin isSwitch id="isActive" form={form}
          name="isActive"
          label="Active"
          description="Inactive variants are hidden from the storefront." />
      </form>
    </Modal>
  );
}
