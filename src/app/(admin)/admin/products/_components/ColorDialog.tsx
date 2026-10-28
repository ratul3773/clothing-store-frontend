"use client";

import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import Modal from "@/components/cms/Modal";
import { Btn } from "@/components/cms/ui";
import { useStore } from "@/components/providers/StoreProvider";
import { apiErrorMessage } from "@/redux/api.utils";
import {
  useCreateColorMutation,
  useUpdateColorMutation,
} from "@/redux/apis/product.api";
import type { ProductColor } from "@/redux/apis/types/product.types";

import {
  colorFormSchema,
  type ColorFormValues,
} from "../_schemas/product.schema";
import { TextField } from "../../_components/form-controls";

type Props = {
  productId: string;
  color?: ProductColor;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export default function ColorDialog({
  productId,
  color,
  open,
  onOpenChange,
}: Props) {
  const { toast, toastError } = useStore();
  const [createColor, createState] = useCreateColorMutation();
  const [updateColor, updateState] = useUpdateColorMutation();

  const form = useForm<ColorFormValues>({
    resolver: zodResolver(colorFormSchema),
    defaultValues: { name: "", hex: "" },
  });

  useEffect(() => {
    if (!open) return;
    form.reset({ name: color?.name ?? "", hex: color?.hex ?? "" });
  }, [open, color, form]);

  const onSubmit = form.handleSubmit(async (values) => {
    const payload = {
      name: values.name.trim(),
      hex: values.hex.trim() === "" ? null : values.hex.trim().toUpperCase(),
    };

    try {
      if (color) {
        await updateColor({
          productId,
          colorId: color.id,
          data: payload,
        }).unwrap();
        toast("Colour updated.");
      } else {
        await createColor({ productId, data: payload }).unwrap();
        toast("Colour added.");
      }
      onOpenChange(false);
    } catch (error) {
      toastError(apiErrorMessage(error, "The colour could not be saved."));
    }
  });

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title={color ? "Edit colour" : "Add colour"}
      description="Colours can be assigned to variants and images."
      size="md"
      footer={
        <>
          <Btn onClick={() => onOpenChange(false)}>Cancel</Btn>
          <Btn
            type="submit"
            form="color-form"
            variant="primary"
            disabled={
              createState.isLoading || 
              updateState.isLoading || 
              !form.formState.isDirty
            }
          >
            {createState.isLoading || updateState.isLoading ? "Saving…" : "Save colour"}
          </Btn>
        </>
      }
    >
      <form id="color-form" onSubmit={onSubmit} className="space-y-4">
        <TextField
          form={form}
          name="name"
          label="Colour name"
          placeholder="e.g. Navy"
        />
        <TextField
          form={form}
          name="hex"
          label="Hex colour"
          placeholder="#1F2937"
          hint="Optional, but improves swatches in the store."
        />
      </form>
    </Modal>
  );
}
