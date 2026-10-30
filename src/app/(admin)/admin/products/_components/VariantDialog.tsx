"use client";

import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import Modal from "@/components/cms/Modal";
import { Btn } from "@/components/cms/ui";
import { useStore } from "@/components/providers/StoreProvider";
import { apiErrorMessage } from "@/redux/api.utils";
import {
  useCreateVariantMutation,
  useUpdateVariantMutation,
} from "@/redux/apis/product.api";
import type {
  AdminVariant,
  ProductColor,
} from "@/redux/apis/types/product.types";

import {
  createVariantFormSchema,
  updateVariantFormSchema,
  type CreateVariantFormValues,
  type UpdateVariantFormValues,
} from "../_schemas/product.schema";
import { parseOptionalInt } from "../_utils/products.utils";
import {
  SelectField,
  SwitchField,
  TextField,
} from "../../_components/form-controls";

type Props = {
  productId: string;
  colors: ProductColor[];
  variant?: AdminVariant;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export default function VariantDialog(props: Props) {
  return props.variant ? (
    <EditVariantDialog {...props} variant={props.variant} />
  ) : (
    <CreateVariantDialog {...props} />
  );
}

function CreateVariantDialog({
  productId,
  colors,
  open,
  onOpenChange,
}: Props) {
  const { toast, toastError } = useStore();
  const [createVariant, createState] = useCreateVariantMutation();

  const form = useForm<CreateVariantFormValues>({
    resolver: zodResolver(createVariantFormSchema),
    defaultValues: {
      colorId: "",
      size: "",
      sizeOrder: "",
      onHand: "0",
      lowStockThreshold: "3",
      isActive: true,
    },
  });

  useEffect(() => {
    if (!open) return;
    form.reset({
      colorId: colors[0]?.id ?? "",
      size: "",
      sizeOrder: "",
      onHand: "0",
      lowStockThreshold: "3",
      isActive: true,
    });
  }, [open, colors, form]);

  const onSubmit = form.handleSubmit(async (values) => {
    try {
      await createVariant({
        productId,
        data: {
          colorId: values.colorId,
          size: values.size.trim(),
          sizeOrder: parseOptionalInt(values.sizeOrder),
          onHand: parseOptionalInt(values.onHand),
          lowStockThreshold: parseOptionalInt(values.lowStockThreshold),
          isActive: values.isActive,
        },
      }).unwrap();
      toast("Variant added.");
      onOpenChange(false);
    } catch (error) {
      toastError(apiErrorMessage(error, "The variant could not be created."));
    }
  });

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
          <SelectField
            form={form}
            name="colorId"
            label="Colour"
            options={colors.map((color) => ({
              value: color.id,
              label: color.name,
            }))}
            placeholder="Select a colour"
          />
        )}
        <div className="grid gap-4 sm:grid-cols-2">
          <TextField form={form} name="size" label="Size" placeholder="e.g. M" />
          <TextField
            form={form}
            name="sizeOrder"
            label="Size order"
            inputMode="numeric"
            placeholder="e.g. 2"
            hint="Controls the size order in the store."
          />
          <TextField
            form={form}
            name="onHand"
            label="Opening stock"
            inputMode="numeric"
            placeholder="0"
          />
          <TextField
            form={form}
            name="lowStockThreshold"
            label="Low stock threshold"
            inputMode="numeric"
            placeholder="3"
          />
        </div>
        <SwitchField
          form={form}
          name="isActive"
          label="Active"
          description="Inactive variants are hidden from the storefront."
        />
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
  const { toast, toastError } = useStore();
  const [updateVariant, updateState] = useUpdateVariantMutation();

  const form = useForm<UpdateVariantFormValues>({
    resolver: zodResolver(updateVariantFormSchema),
    defaultValues: {
      size: "",
      sizeOrder: "",
      lowStockThreshold: "",
      isActive: true,
    },
  });

  useEffect(() => {
    if (!open) return;
    form.reset({
      size: variant.size,
      sizeOrder:
        variant.sizeOrder === 0 ? "" : String(variant.sizeOrder),
      lowStockThreshold: String(variant.lowStockThreshold),
      isActive: variant.isActive,
    });
  }, [open, variant, form]);

  const onSubmit = form.handleSubmit(async (values) => {
    try {
      await updateVariant({
        productId,
        variantId: variant.id,
        data: {
          size: values.size.trim(),
          sizeOrder: parseOptionalInt(values.sizeOrder),
          lowStockThreshold: parseOptionalInt(values.lowStockThreshold),
          isActive: values.isActive,
          version: variant.version,
        },
      }).unwrap();
      toast("Variant updated.");
      onOpenChange(false);
    } catch (error) {
      toastError(apiErrorMessage(error, "The variant could not be updated."));
    }
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
          <TextField form={form} name="size" label="Size" />
          <TextField
            form={form}
            name="sizeOrder"
            label="Size order"
            inputMode="numeric"
          />
          <TextField
            form={form}
            name="lowStockThreshold"
            label="Low stock threshold"
            inputMode="numeric"
          />
        </div>
        <SwitchField
          form={form}
          name="isActive"
          label="Active"
          description="Inactive variants are hidden from the storefront."
        />
      </form>
    </Modal>
  );
}
