import { useStore } from "@/components/providers/StoreProvider";
import { useNavigate } from "@/lib/nav";
import { AdminProduct, useUpdateProductMutation } from "@/redux/apis/product.api";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { ProductCoreFormValues, productCoreSchema } from "../_schemas/product.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { toCoreFormValues, toCorePayload } from "../_utils/products.utils";
import { apiErrorMessage, isConflictError } from "@/redux/api.utils";

export function useEditProduct(product: AdminProduct, reload: () => Promise<AdminProduct>) {
  const { toast, toastError } = useStore();
  const go = useNavigate();
  const [updateProduct, updateState] = useUpdateProductMutation();
  const [conflict, setConflict] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string>("");

  const form = useForm<ProductCoreFormValues>({
    resolver: zodResolver(productCoreSchema),
    defaultValues: toCoreFormValues(product),
  });

  useEffect(() => {
    form.reset(toCoreFormValues(product));
  }, [product.id]);

  const values = form.watch();
  const images = [...product.images]
    .sort(
      (a, b) =>
        Number(b.isPrimary) - Number(a.isPrimary) || a.sortOrder - b.sortOrder,
    )
    .map((image) => image.url);

  const onSubmit = form.handleSubmit(async (core) => {
    try {
      const updated = await updateProduct({
        id: product.id,
        data: { ...toCorePayload(core), version: product.version },
      }).unwrap();
      form.reset(toCoreFormValues(updated));
      setConflict(null);
      toast("Product saved.");
    } catch (error) {
      if (isConflictError(error)) {
        const message =
          "This product was changed elsewhere. The latest values have been loaded — review them and save again.";
        setConflict(message);
        toast(message);
        try {
          const fresh = await reload();
          form.reset(toCoreFormValues(fresh));
        } catch {
          toast("Could not reload the latest product values.");
        }
        return;
      }
      setErrorMsg(apiErrorMessage(error, "The product could not be saved."));
    }
  });

  return {
    form,
    values,
    images,
    conflict,
    setConflict,
    errorMsg,
    setErrorMsg,
    onSubmit,
    isSubmitting: updateState.isLoading,
    go,
    toast,
  };
}