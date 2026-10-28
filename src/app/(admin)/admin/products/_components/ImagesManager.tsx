"use client";

import { useRef, useState } from "react";
import {
  ArrowDown,
  ArrowUp,
  ImagePlus,
  Pencil,
  Star,
  Trash2,
} from "lucide-react";

import AlertDialogText from "@/components/common/Alert-Dialogue";
import { Badge, Btn, Card, CardHeader } from "@/components/cms/ui";
import { useStore } from "@/components/providers/StoreProvider";
import { apiErrorMessage } from "@/redux/api.utils";
import {
  useDeleteImageMutation,
  useReorderImagesMutation,
  useUpdateImageMutation,
  useUploadImageMutation,
} from "@/redux/apis/product.api";
import type {
  AdminProduct,
  ProductImage,
} from "@/redux/apis/types/product.types";

import { IMAGE_ACCEPT, MAX_IMAGES } from "../_constants/products.constants";
import { arrayMove, validateImageFile } from "../_utils/products.utils";
import ImageMetaDialog from "./ImageMetaDialog";
import { Tip } from "@/components/ui/controls";

export default function ImagesManager({ product }: { product: AdminProduct }) {
  const { toast, toastError } = useStore();
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploadImage, uploadState] = useUploadImageMutation();
  const [reorderImages, reorderState] = useReorderImagesMutation();
  const [updateImage, updateState] = useUpdateImageMutation();
  const [deleteImage, deleteState] = useDeleteImageMutation();

  const [metaImage, setMetaImage] = useState<ProductImage | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<ProductImage | null>(null);
  const [busyImageId, setBusyImageId] = useState<string | null>(null);

  const sorted = [...product.images].sort(
    (a, b) => Number(b.isPrimary) - Number(a.isPrimary) || a.sortOrder - b.sortOrder,
  );

  const busy =
    uploadState.isLoading ||
    reorderState.isLoading ||
    updateState.isLoading ||
    deleteState.isLoading ||
    busyImageId !== null;

  const addFiles = async (list: FileList | null) => {
    if (!list || list.length === 0) return;

    const remaining = MAX_IMAGES - product.images.length;
    if (remaining <= 0) {
      toast(`A product can have at most ${MAX_IMAGES} images.`);
      if (inputRef.current) inputRef.current.value = "";
      return;
    }

    const incoming = Array.from(list);
    const accepted: File[] = [];
    for (const file of incoming) {
      if (accepted.length >= remaining) {
        toast(`Only ${remaining} more image${remaining === 1 ? "" : "s"} can be added.`);
        break;
      }
      const problem = validateImageFile(file);
      if (problem) {
        toastError(problem);
        continue;
      }
      accepted.push(file);
    }

    if (inputRef.current) inputRef.current.value = "";

    let failures = 0;
    for (const file of accepted) {
      try {
        await uploadImage({ productId: product.id, file }).unwrap();
      } catch (error) {
        failures += 1;
      toastError(apiErrorMessage(error, `${file.name} could not be uploaded.`));
      }
    }

    if (accepted.length > failures) {
      toast(
        `${accepted.length - failures} image${accepted.length - failures === 1 ? "" : "s"} uploaded.`,
      );
    }
  };

  const move = async (from: number, to: number) => {
    if (to < 0 || to >= sorted.length) return;
    const next = arrayMove(sorted, from, to);
    try {
      await reorderImages({
        productId: product.id,
        imageIds: next.map((image) => image.id),
      }).unwrap();
    } catch (error) {
      toastError(apiErrorMessage(error, "Images could not be reordered."));
    }
  };

  const makePrimary = async (image: ProductImage) => {
    if (image.isPrimary) return;
    setBusyImageId(image.id);
    try {
      await updateImage({
        productId: product.id,
        imageId: image.id,
        data: { isPrimary: true },
      }).unwrap();
      toast("Primary image updated.");
    } catch (error) {
      toastError(apiErrorMessage(error, "The primary image could not be changed."));
    } finally {
      setBusyImageId(null);
    }
  };

  const removeImage = async () => {
    if (!deleteTarget) return;
    setBusyImageId(deleteTarget.id);
    try {
      await deleteImage({
        productId: product.id,
        imageId: deleteTarget.id,
      }).unwrap();
      toast("Image deleted.");
      setDeleteTarget(null);
    } catch (error) {
      toastError(apiErrorMessage(error, "The image could not be deleted."));
    } finally {
      setBusyImageId(null);
    }
  };

  return (
    <Card>
      <CardHeader
        title="Images"
        description={`${product.images.length} of ${MAX_IMAGES} images · JPEG, PNG, WebP, or AVIF · max 5 MB each.`}
        actions={
          <Btn
            size="sm"
            onClick={() => inputRef.current?.click()}
            disabled={busy || product.images.length >= MAX_IMAGES}
          >
            <ImagePlus className="size-3.5" />{" "}
            {uploadState.isLoading ? "Uploading…" : "Add image"}
          </Btn>
        }
      />
      <input
        ref={inputRef}
        type="file"
        accept={IMAGE_ACCEPT}
        multiple
        className="hidden"
        onChange={(event) => void addFiles(event.target.files)}
      />

      <div className="p-4">
        {sorted.length === 0 ? (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="flex min-h-28 w-full flex-col items-center justify-center gap-1 rounded border border-dashed border-border bg-muted/30 px-4 py-8 text-center text-sm text-muted-foreground hover:bg-muted/50"
          >
            <ImagePlus className="size-5" />
            <span>Add the first image</span>
            <span className="text-xs">At least one image is required to publish.</span>
          </button>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-4">
            {sorted.map((image, index) => {
              const color = product.colors.find(
                (entry) => entry.id === image.colorId,
              );
              return (
                <div
                  key={image.id}
                  className="group overflow-hidden rounded border border-border bg-card"
                >
                  <div className="relative aspect-square bg-muted">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={image.url}
                      alt={image.alt ?? ""}
                      className="size-full object-cover"
                    />
                    {image.isPrimary && (
                      <Badge
                        tone="green"
                        className="absolute left-1.5 top-1.5"
                      >
                        Primary
                      </Badge>
                    )}
                    {busyImageId === image.id && (
                      <span className="absolute inset-0 flex items-center justify-center bg-black/40 text-[11px] font-medium text-white">
                        Working…
                      </span>
                    )}
                  </div>
                  <div className="space-y-1.5 p-2">
                    <p className="truncate text-xs text-muted-foreground">
                      {image.alt || "No alt text"}
                    </p>
                    <div className="flex items-center justify-between gap-1">
                      <span className="truncate text-[11px] text-muted-foreground">
                        {color ? color.name : "No colour"}
                      </span>
                      <div className="flex items-center gap-0.5">
                        <Tip
                          label="Move image to the top"
                          children={
                            <Btn
                              size="icon"
                              variant="ghost"
                              className="size-6"
                              disabled={busy || index === 0}
                              onClick={() => void move(index, index - 1)}
                              aria-label="Move image earlier"
                            >
                              <ArrowUp className="size-3.5" />
                            </Btn>
                          } />
                        <Tip
                          label="Move image to the bottom"
                          children={
                        <Btn
                          size="icon"
                          variant="ghost"
                          className="size-6"
                          disabled={busy || index === sorted.length - 1}
                          onClick={() => void move(index, index + 1)}
                          aria-label="Move image later"
                        >
                          <ArrowDown className="size-3.5" />
                        </Btn>
                      }/>
                      <Tip
                        label="Set as primary image"
                        children={
                          <Btn
                            size="icon"
                            variant="ghost"
                            className="size-6"
                            disabled={busy || image.isPrimary}
                            onClick={() => void makePrimary(image)}
                            aria-label="Set as primary image"
                          >
                            <Star className="size-3.5" />
                          </Btn>}
                        />
                        <Tip
                          label="Edit"
                          children={
                        <Btn
                          size="icon"
                          variant="ghost"
                          className="size-6"
                          disabled={busy}
                          onClick={() => setMetaImage(image)}
                          aria-label="Edit image details"
                        >
                          <Pencil className="size-3.5" />
                        </Btn>}/>
                        <Tip
                          label="Delete"
                          children={
                        <Btn
                          size="icon"
                          variant="ghost"
                          className="size-6 text-destructive"
                          disabled={busy}
                          onClick={() => setDeleteTarget(image)}
                          aria-label="Delete image"
                        >
                          <Trash2 className="size-3.5" />
                        </Btn>}/>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {metaImage && (
        <ImageMetaDialog
          productId={product.id}
          image={metaImage}
          colors={product.colors}
          open={!!metaImage}
          onOpenChange={(open) => {
            if (!open) setMetaImage(null);
          }}
        />
      )}

      <AlertDialogText
        open={!!deleteTarget}
        mode="normal"
        onOpenChange={(open) => {
          if (!open) setDeleteTarget(null);
        }}
        actionType="delete"
        title="Delete image?"
        description="The image will be removed from this product and storage."
        confirmButtonText="Delete image"
        disabled={deleteState.isLoading}
        onConfirm={() => void removeImage()}
      />
    </Card>
  );
}
