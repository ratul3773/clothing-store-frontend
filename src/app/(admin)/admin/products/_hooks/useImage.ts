"use client";
import { useStore } from "@/components/providers/StoreProvider";
import { 
  useReorderImagesMutation, 
  useUploadImageMutation,
  useUpdateImageMutation,
  useDeleteImageMutation,
  ProductImage,
  AdminProduct,
} from "@/redux/apis/product.api";
import { 
  useRef,
  useState,
} from "react";
import { MAX_IMAGES } from "../_constants/products.constants";
import { validateImageFile } from "@/lib/image";
import { apiErrorMessage } from "@/redux/api.utils";
import { arrayMove } from "../_utils/products.utils";


export function useImage(product: AdminProduct) {
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

      return {
        inputRef,
        sorted,
        metaImage,
        setMetaImage,
        deleteTarget,
        setDeleteTarget,
        move,
        makePrimary,
        removeImage,
        addFiles,
        busy,
        busyImageId,
        uploadState,
        deleteState,
      };
    }