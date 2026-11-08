"use client";
import { useWatch } from "react-hook-form";

import { useStore } from "@/components/providers/StoreProvider";
import { apiErrorMessage } from "@/redux/api.utils";
import {
  useCreateCategoryMutation,
  useRemoveCategoryImageMutation,
  useUpdateCategoryMutation,
  useUploadCategoryImageMutation,
} from "@/redux/apis/category.api";
import {
  categoryDescendantIds,
  toCategoryRows,
  type Category,
} from "@/redux/apis/types/category.types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import {
  categoryFormSchema,
  type CategoryFormValues,
} from "../_schemas/category.schema";

export type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  categories: Category[];
  editing?: Category;
};

const nullable = (value: string) => (value.trim() === "" ? null : value.trim());

export default function useCategoryModalForm({ onOpenChange, categories, editing }: Omit<Props, "open">) {
  const { toast, toastError } = useStore();
  const inputRef = useRef<HTMLInputElement>(null);
  const [createCategory, createState] = useCreateCategoryMutation();
  const [updateCategory, updateState] = useUpdateCategoryMutation();
  const [uploadImage, uploadState] = useUploadCategoryImageMutation();
  const [removeImage, removeState] = useRemoveCategoryImageMutation();
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const imagePreview = useMemo(() => selectedImage ? URL.createObjectURL(selectedImage) : null, [selectedImage]);
  const [imageRemoved, setImageRemoved] = useState(false);
  useEffect(() => () => {
    if (imagePreview) URL.revokeObjectURL(imagePreview);
  }, [imagePreview]);
  const forbiddenParentIds = useMemo(() => {
    if (!editing) return new Set<string>();
    const ids = categoryDescendantIds(categories, editing.id);
    ids.add(editing.id);
    return ids;
  }, [categories, editing]);
  const schema = useMemo(
    () => categoryFormSchema(forbiddenParentIds),
    [forbiddenParentIds],
  );
  const rows = useMemo(() => toCategoryRows(categories), [categories]);
  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: editing?.name ?? "",
      parentId: editing?.parentId ?? "",
      description: editing?.description ?? "",
      sortOrder: editing ? String(editing.sortOrder) : "",
      isActive: editing?.isActive ?? true,
      seoTitle: editing?.seoTitle ?? "",
      seoDescription: editing?.seoDescription ?? "",
    },
  });
  const saving = createState.isLoading || updateState.isLoading;
  const parentId = useWatch({ control: form.control, name: "parentId" });
  const existingImageUrl = imageRemoved ? null : editing?.imageUrl;
  const imageRequired = !parentId;
  const hasImage = Boolean(selectedImage || existingImageUrl);
  const onSubmit = form.handleSubmit(async (values) => {
    const sortOrder =
      values.sortOrder.trim() === "" ? undefined : Number(values.sortOrder);

    const payload = {
      name: values.name.trim(),
      parentId: values.parentId === "" ? null : values.parentId,
      description: nullable(values.description),
      isActive: values.isActive,
      seoTitle: nullable(values.seoTitle),
      seoDescription: nullable(values.seoDescription),
      ...(sortOrder !== undefined ? { sortOrder } : {}),
    };

    try {
      if (editing) {
        await updateCategory({ id: editing.id, data: payload }).unwrap();

        if (selectedImage) {
          if (values.parentId) {
            setSelectedImage(null);
          } else {
            await uploadImage({
              categoryId: editing.id,
              file: selectedImage,
            }).unwrap();
          }
        }

        toast("Category updated.");
      } else {
        const created = await createCategory(payload).unwrap();

        if (selectedImage) {
          if (values.parentId) {
            setSelectedImage(null);
          } else {
            await uploadImage({
              categoryId: created.id,
              file: selectedImage,
            }).unwrap();

            toast("Category created with image.");
          }
        } else {
          toast("Category created.");
        }
      }

      onOpenChange(false);
    } catch (error) {
      toastError(apiErrorMessage(error, "The category could not be saved."));
    }
  });
  return {
    toast,
    toastError,
    inputRef,
    uploadState,
    removeImage,
    removeState,
    selectedImage,
    setSelectedImage,
    imagePreview,
    setImageRemoved,
    forbiddenParentIds,
    rows,
    form,
    saving,
    parentId,
    existingImageUrl,
    imageRequired,
    hasImage,
    onSubmit,
  };
}
