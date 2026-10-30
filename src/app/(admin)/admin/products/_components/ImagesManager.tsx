"use client";

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

import type {
  AdminProduct,
} from "@/redux/apis/types/product.types";

import { IMAGE_ACCEPT, MAX_IMAGES } from "../_constants/products.constants";
import ImageMetaDialog from "./ImageMetaDialog";
import { Tip } from "@/components/ui/controls";
import { useImage } from "../_hooks/useImage";

export default function ImagesManager({ product }: { product: AdminProduct }) {
  const {
    inputRef,
    uploadState,
    sorted,
    busy,
    addFiles,
    move,
    makePrimary,
    deleteTarget,
    setDeleteTarget,
    removeImage,
    metaImage,
    setMetaImage,
    busyImageId,
    deleteState
  } = useImage(product);

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
