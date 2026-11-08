"use client";

import { useStore } from "@/components/providers/StoreProvider";
import { apiErrorMessage } from "@/redux/api.utils";
import { useUpdateImageMutation } from "@/redux/apis/product.api";
import type {
  ProductImage,
} from "@/redux/apis/types/product.types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import {
  imageMetaSchema,
  type ImageMetaFormValues,
} from "../_schemas/product.schema";

type Props = {
  productId: string;
  image: ProductImage;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export default function useImageMetaDialog({
  productId,
  image,
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
  return { updateState, form, onSubmit };
}
