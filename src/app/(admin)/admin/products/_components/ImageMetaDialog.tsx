"use client";

import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import Modal from "@/components/cms/Modal";
import { Btn } from "@/components/cms/ui";
import { useStore } from "@/components/providers/StoreProvider";
import { apiErrorMessage } from "@/redux/api.utils";
import { useUpdateImageMutation } from "@/redux/apis/product.api";
import type {
  ProductColor,
  ProductImage,
} from "@/redux/apis/types/product.types";

import {
  imageMetaSchema,
  type ImageMetaFormValues,
} from "../_schemas/product.schema";
import { SelectField, TextField } from "../../_components/form-controls";

type Props = {
  productId: string;
  image: ProductImage;
  colors: ProductColor[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export default function ImageMetaDialog({
  productId,
  image,
  colors,
  open,
  onOpenChange,
}: Props) {
  const { toast, toastError } = useStore();
  const [updateImage, updateState] = useUpdateImageMutation();

  const form = useForm<ImageMetaFormValues>({
    resolver: zodResolver(imageMetaSchema),
    defaultValues: { alt: "", colorId: "" },
  });

  useEffect(() => {
    if (!open) return;
    form.reset({ alt: image.alt ?? "", colorId: image.colorId ?? "" });
  }, [open, image, form]);

  const onSubmit = form.handleSubmit(async (values) => {
    try {
      await updateImage({
        productId,
        imageId: image.id,
        data: {
          alt: values.alt.trim() === "" ? null : values.alt.trim(),
          colorId: values.colorId === "" ? null : values.colorId,
        },
      }).unwrap();
      toast("Image details updated.");
      onOpenChange(false);
    } catch (error) {
      toastError(apiErrorMessage(error, "The image could not be updated."));
    }
  });

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title="Image details"
      description="Alt text improves accessibility. A colour tag links the image to a variant."
      size="md"
      footer={
        <>
          <Btn onClick={() => onOpenChange(false)}>Cancel</Btn>
          <Btn
            type="submit"
            form="image-meta-form"
            variant="primary"
            disabled={updateState.isLoading || !form.formState.isDirty}
          >
            {updateState.isLoading ? "Saving…" : "Save details"}
          </Btn>
        </>
      }
    >
      <form id="image-meta-form" onSubmit={onSubmit} className="space-y-4">
        <div className="overflow-hidden rounded border border-border bg-muted">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={image.url}
            alt={image.alt ?? ""}
            className="max-h-56 w-full object-cover"
          />
        </div>
        <TextField
          form={form}
          name="alt"
          label="Alt text"
          placeholder="e.g. Navy oxford shirt, front view"
        />
        <SelectField
          form={form}
          name="colorId"
          label="Colour"
          options={colors.map((color) => ({
            value: color.id,
            label: color.name,
          }))}
          placeholder="No colour"
        />
      </form>
    </Modal>
  );
}
