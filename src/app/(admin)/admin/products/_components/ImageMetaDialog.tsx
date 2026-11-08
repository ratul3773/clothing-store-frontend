"use client";

import useImageMetaDialog from "../_hooks/useImageMetaDialog";

import Image from 'next/image';

import Modal from "@/components/cms/Modal";
import { Btn } from "@/components/cms/ui";
import type {
  ProductColor,
  ProductImage,
} from "@/redux/apis/types/product.types";

import { FormField } from "@/components/common/form-field";

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
  const { updateState, form, onSubmit } = useImageMetaDialog({
    productId,
    image,
    open,
    onOpenChange,
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
          <Image width={800} height={600}
            src={image.url}
            alt={image.alt ?? ""}
            className="h-auto max-h-56 w-full object-cover"
          />
        </div>
        <FormField isAdmin isInput id="alt" form={form}
          name="alt"
          label="Alt text"
          placeholder="e.g. Navy oxford shirt, front view" />
        <FormField isAdmin isSelect id="colorId" form={form}
          name="colorId"
          label="Colour"
          options={colors.map((color) => ({
            value: color.id,
            label: color.name,
          }))}
          placeholder="No colour" />
      </form>
    </Modal>
  );
}
