"use client";

import { useEffect, useMemo, useRef } from "react";
import { ImagePlus, X } from "lucide-react";

import { Btn, Card, CardHeader } from "@/components/cms/ui";
import { useStore } from "@/components/providers/StoreProvider";

import {
  IMAGE_ACCEPT,
  MAX_IMAGES,
} from "../_constants/products.constants";
import { validateImageFile } from "../_utils/products.utils";

type Props = {
  files: File[];
  onChange: (files: File[]) => void;
  error?: string;
};

export default function ImagesCreateSection({ files, onChange, error }: Props) {
  const { toast, toastError } = useStore();
  const inputRef = useRef<HTMLInputElement>(null);

  const previews = useMemo(
    () => files.map((file) => ({ file, url: URL.createObjectURL(file) })),
    [files],
  );

  useEffect(
    () => () => previews.forEach((preview) => URL.revokeObjectURL(preview.url)),
    [previews],
  );

  const addFiles = (list: FileList | null) => {
    if (!list || list.length === 0) return;
    const incoming = Array.from(list);
    const accepted: File[] = [];

    for (const file of incoming) {
      if (files.length + accepted.length >= MAX_IMAGES) {
        toast(`You can add at most ${MAX_IMAGES} images.`);
        break;
      }
      const problem = validateImageFile(file);
      if (problem) {
        toastError(problem);
        continue;
      }
      accepted.push(file);
    }

    if (accepted.length > 0) onChange([...files, ...accepted]);
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <Card>
      <CardHeader
        title="Images"
        description={`Staged locally now and uploaded after the draft is created. Up to ${MAX_IMAGES} images, 5 MB each. The first image becomes the primary image.`}
        actions={
          <Btn
            size="sm"
            onClick={() => inputRef.current?.click()}
            disabled={files.length >= MAX_IMAGES}
          >
            <ImagePlus className="size-3.5" /> Add images
          </Btn>
        }
      />
      <input
        ref={inputRef}
        type="file"
        accept={IMAGE_ACCEPT}
        multiple
        className="hidden"
        onChange={(event) => addFiles(event.target.files)}
      />
      <div className="p-4">
        {previews.length === 0 ? (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="flex min-h-32 w-full flex-col items-center justify-center gap-1 rounded border border-dashed border-border bg-muted/30 px-4 py-8 text-center text-sm text-muted-foreground hover:bg-muted/50"
          >
            <ImagePlus className="size-5" />
            <span>Drop images here or click to choose files</span>
            <span className="text-xs">JPEG, PNG, WebP, or AVIF · max 5 MB</span>
          </button>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {previews.map((preview, index) => (
              <div
                key={`${preview.file.name}-${preview.file.lastModified}-${index}`}
                className="group relative aspect-square overflow-hidden rounded border border-border bg-muted"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={preview.url}
                  alt={preview.file.name}
                  className="size-full object-cover"
                />
                {index === 0 && (
                  <span className="absolute left-1.5 top-1.5 rounded bg-black/65 px-1.5 py-0.5 text-[10px] font-medium text-white">
                    Primary
                  </span>
                )}
                <button
                  type="button"
                  aria-label={`Remove ${preview.file.name}`}
                  onClick={() =>
                    onChange(files.filter((_, position) => position !== index))
                  }
                  className="absolute right-1.5 top-1.5 rounded bg-black/65 p-1 text-white opacity-0 transition-opacity group-hover:opacity-100"
                >
                  <X className="size-3.5" />
                </button>
                <p className="absolute inset-x-0 bottom-0 truncate bg-black/55 px-1.5 py-1 text-[10px] text-white">
                  {preview.file.name}
                </p>
              </div>
            ))}
          </div>
        )}
        {error && <p className="mt-2 text-xs text-red-600">{error}</p>}
      </div>
    </Card>
  );
}
