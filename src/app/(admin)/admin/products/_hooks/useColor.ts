"use client";
import { useStore } from "@/components/providers/StoreProvider";
import { useCreateColorMutation, useUpdateColorMutation } from "@/redux/apis/product.api";
import { colorFormSchema, ColorFormValues } from "../_schemas/product.schema";
import { useForm, UseFormReturn } from "react-hook-form";
import { ProductColor } from "@/redux/apis/types/product.types";
import { apiErrorMessage } from "@/redux/api.utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";

export function useColor(
    productId: string,
    color: ProductColor | undefined,
    onOpenChange: (open: boolean) => void,
) {
    const { toast } = useStore();
      const [createColor, createState] = useCreateColorMutation();
      const [updateColor, updateState] = useUpdateColorMutation();
      const [errorMsg, setErrorMsg] = useState<string>("");
    const form = useForm<ColorFormValues>({
          resolver: zodResolver(colorFormSchema),
          defaultValues: { name: "", hex: "" },
        });
      const hex = form.watch("hex");
      const isSaving = createState.isLoading || updateState.isLoading;
    
      useEffect(() => {
        if (!open) return;
    
        form.reset({
          name: color?.name ?? "",
          hex: color?.hex ?? "",
        });
      }, [open, color, form]);
    
      const onSubmit = form.handleSubmit(async (values) => {
        const payload = {
          name: values.name.trim(),
          hex: values.hex.trim() === "" ? null : values.hex.trim().toUpperCase(),
        };
    
        try {
          if (color) {
            await updateColor({
              productId,
              colorId: color.id,
              data: payload,
            }).unwrap();
    
            toast("Colour updated.");
          } else {
            await createColor({ productId, data: payload }).unwrap();
    
            toast("Colour added.");
          }
    
          onOpenChange(false);
        } catch (error) {
          setErrorMsg(apiErrorMessage(error, "The colour could not be saved."));
        }
      });

    return {
        onSubmit,
        isSaving,
        form,
        hex,
        errorMsg,
        setErrorMsg,
    };
}