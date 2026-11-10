"use client";

import { CmsButton } from "@/components/ui/button";
import useImageMetaDialog from "../_hooks/useImageMetaDialog";

import Image from 'next/image';

import Modal from "@/components/cms/Modal";

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
          <CmsButton variant="outline" onClick={() => onOpenChange(false)}>Cancel</CmsButton>
          <CmsButton
            type="submit"
            form="image-meta-form"
            variant="default"
            disabled={updateState.isLoading || !form.formState.isDirty}
          >
            {updateState.isLoading ? "Saving…" : "Save details"}
          </CmsButton>
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
