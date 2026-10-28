
"use client";

import Modal from "@/components/cms/Modal";
import { Btn } from "@/components/cms/ui";

import type { ProductColor } from "@/redux/apis/types/product.types";
import { TextField } from "../../_components/form-controls";
import { useColor } from "../_hooks/useColor";

type Props = {
  productId: string;
  color?: ProductColor;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export default function ColorDialog({
  productId,
  color,
  open,
  onOpenChange,
}: Props) {

      const {
        form,
        hex,
        onSubmit,
        isSaving,
        errorMsg,
        setErrorMsg,
      } = useColor(
        productId,
        color,
        onOpenChange
      );



  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      errorMsg={errorMsg}
      setErrorMsg={setErrorMsg}
      title={color ? "Edit colour" : "Add colour"}
      description="Colours can be assigned to variants and images."
      size="md"
      footer={
        <>
          <Btn onClick={() => onOpenChange(false)}>Cancel</Btn>
          <Btn
            type="submit"
            form="color-form"
            variant="primary"
            disabled={isSaving || !form.formState.isDirty}
          >
            {isSaving ? "Saving…" : "Save colour"}
          </Btn>
        </>
      }
    >
      <form id="color-form" onSubmit={onSubmit} className="space-y-4">
        <TextField
          form={form}
          name="name"
          label="Colour name"
          placeholder="e.g. Navy"
        />

        <TextField
          form={form}
          name="hex"
          label="Hex colour"
          placeholder="#1F2937"
          hint="Optional. Choose a colour or enter its hex value."
        />

        <div className="space-y-2">
          <label
            htmlFor="color-picker"
            className="block text-sm font-medium"
          >
            Choose colour
          </label>

          <div className="flex items-center gap-3">
            <input
              id="color-picker"
              type="color"
              value={
                /^#[0-9a-fA-F]{6}$/.test(hex)
                  ? hex
                  : "#000000"
              }
              onChange={(event) => {
                form.setValue("hex", event.target.value.toUpperCase(), {
                  shouldDirty: true,
                  shouldValidate: true,
                });
              }}
              aria-label="Choose colour"
              className="size-10 cursor-pointer rounded border border-border bg-card p-1"
            />

            <div
              className="size-10 rounded-md border border-border"
              style={{
                backgroundColor: /^#[0-9a-fA-F]{6}$/.test(hex)
                  ? hex
                  : "transparent",
              }}
              aria-label="Colour preview"
            />

            <span className="font-mono text-sm text-muted-foreground">
              {/^#[0-9a-fA-F]{6}$/.test(hex) ? hex.toUpperCase() : "No colour"}
            </span>
          </div>
        </div>
      </form>
    </Modal>
  );
}
