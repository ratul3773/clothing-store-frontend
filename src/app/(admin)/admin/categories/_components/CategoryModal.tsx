"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { ImagePlus, Trash2 } from "lucide-react";
import { useForm } from "react-hook-form";

import Modal from "@/components/cms/Modal";
import { Btn } from "@/components/cms/ui";
import { useStore } from "@/components/providers/StoreProvider";
import { IMAGE_ACCEPT, validateImageFile } from "@/lib/image";
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

import {
  categoryFormSchema,
  type CategoryFormValues,
} from "../_schemas/category.schema";
import {
  SelectField,
  SwitchField,
  TextareaField,
  TextField,
} from "../../_components/form-controls";
import Image from "next/image";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  categories: Category[];
  editing?: Category;
};

const nullable = (value: string) =>
  value.trim() === "" ? null : value.trim();

export default function CategoryModal(props: Props) {
  if (!props.open) return null;
  return <CategoryModalContent key={props.editing?.id ?? "new"} {...props} />;
}

function CategoryModalContent({
  onOpenChange,
  categories,
  editing,
}: Props) {
  const { toast, toastError } = useStore();
  const inputRef = useRef<HTMLInputElement>(null);
  const [createCategory, createState] = useCreateCategoryMutation();
  const [updateCategory, updateState] = useUpdateCategoryMutation();
  const [uploadImage, uploadState] = useUploadCategoryImageMutation();
  const [removeImage, removeState] = useRemoveCategoryImageMutation();

const [selectedImage, setSelectedImage] = useState<File | null>(null);
const [imagePreview, setImagePreview] = useState<string | null>(null);
const [imageRemoved, setImageRemoved] = useState(false);

useEffect(() => {
  if (!selectedImage) {
    setImagePreview(null);
    return;
  }

  const url = URL.createObjectURL(selectedImage);
  setImagePreview(url);

  return () => URL.revokeObjectURL(url);
}, [selectedImage]);
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
  const parentId = form.watch("parentId");
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
        if(values.parentId) {
          setSelectedImage(null);
        }
      else{
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
        if(values.parentId) {
          setSelectedImage(null);
        }
        else {
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

  return (
    <Modal
      open
      onOpenChange={onOpenChange}
      title={editing ? "Edit category" : "New category"}
      description="Categories can be nested. Slugs are generated by the server."
      size="lg"
      footer={
        <>
          <Btn onClick={() => onOpenChange(false)} disabled={saving}>
            Cancel
          </Btn>
          <Btn
            type="submit"
            form="category-form"
            variant="primary"
            disabled={saving || (imageRequired && !hasImage)}
          >
            {saving
              ? "Saving…"
              : editing
                ? "Save category"
                : "Create category"}
          </Btn>
        </>
      }
    >
      <form id="category-form" onSubmit={onSubmit} className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <TextField
            form={form}
            name="name"
            label="Name"
            placeholder="e.g. Shirts"
          />
          <SelectField
            form={form}
            name="parentId"
            label="Parent category"
            placeholder="No parent (top level)"
            options={rows.map((category) => ({
              value: category.id,
              label: `${"— ".repeat(category.depth)}${category.name}`,
              disabled: forbiddenParentIds.has(category.id),
            }))}
            hint="A category cannot be its own parent or a descendant."
          />
          <TextField
            form={form}
            name="sortOrder"
            label="Sort order"
            inputMode="numeric"
            placeholder="0"
            hint="Lower numbers appear first."
          />
          <SwitchField
            form={form}
            name="isActive"
            label="Active"
            description="Inactive categories cannot be used for publishing products."
          />
        </div>

        <TextareaField
          form={form}
          name="description"
          label="Description"
          rows={3}
          placeholder="Optional category description"
        />

        <div className="grid gap-4 sm:grid-cols-2">
          <TextField
            form={form}
            name="seoTitle"
            label="SEO title"
            placeholder="Optional search title"
          />
          <TextField
            form={form}
            name="seoDescription"
            label="SEO description"
            placeholder="Optional search description"
          />
        </div>

        {!parentId && (<div className="rounded border border-border p-3">
          <p className="mb-2 text-xs font-medium text-foreground/80">
             Category image {imageRequired && <span className="text-destructive">*</span>}
          </p>

          <div className="flex items-center gap-3">
            <div className="size-20 shrink-0 overflow-hidden rounded border border-border bg-muted">
              {imagePreview || existingImageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <Image
                   src={imagePreview ?? existingImageUrl ?? ""}
                  width={80}
                  height={80}
                  alt="Category preview"
                  className="size-full object-cover"
                />
              ) : null}
            </div>

            <div className="flex flex-wrap gap-2">
              <Btn
                size="sm"
                onClick={() => inputRef.current?.click()}
                disabled={uploadState.isLoading || saving}
              >
                <ImagePlus className="size-3.5" />
                 {(selectedImage || existingImageUrl) ? "Change image" : "Choose image"}
              </Btn>

              {selectedImage && (
                <Btn
                  size="sm"
                  variant="dangerOutline"
                  onClick={() => setSelectedImage(null)}
                  disabled={saving || uploadState.isLoading}
                >
                  <Trash2 className="size-3.5" />
                </Btn>
              )}

              {editing && existingImageUrl && !selectedImage && (
                <Btn
                  size="sm"
                  variant="dangerOutline"
                  disabled={uploadState.isLoading || removeState.isLoading}
                  onClick={async () => {
                    try {
                       await removeImage(editing.id).unwrap();
                       setImageRemoved(true);
                       toast("Category image removed.");
                    } catch (error) {
                      toast(
                        apiErrorMessage(
                          error,
                          "The category image could not be removed.",
                        ),
                      );
                    }
                  }}
                >
                  <Trash2 className="size-3.5" />
                </Btn>
              )}

              {imageRequired ? (
                 <p className="mt-2 text-xs text-muted-foreground">
                   An image is required for top-level categories. JPEG, PNG, WebP, or AVIF · max 5 MB.
                 </p>
               ) : (
                 <p className="mt-2 text-xs text-muted-foreground">
                   Optional for subcategories. JPEG, PNG, WebP, or AVIF · max 5 MB.
                 </p>
               )}
            </div>
          </div>

          <input
            ref={inputRef}
            type="file"
            accept={IMAGE_ACCEPT}
            className="hidden"
            onChange={(event) => {
              const file = event.target.files?.[0];

              if (file) {
                const problem = validateImageFile(file);

                if (problem) {
                  toastError(problem);
                } else {
                  setSelectedImage(file);
                }
              }
              event.target.value = "";
            }}
          />
        </div>)}
      </form>
    </Modal>
  );
}
