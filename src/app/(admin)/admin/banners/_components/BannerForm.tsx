"use client";
import { useWatch } from "react-hook-form";

import { FormField } from "@/components/common/form-field";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { bannerFormSchema } from "../_schemas/banner.schema";

import ImageField from "@/components/cms/ImageField";
import Modal from "@/components/cms/Modal";
import { Btn } from "@/components/cms/ui";
import { useStore } from "@/components/providers/StoreProvider";
import { saveBanner, uid } from "@/data/cms";
import { banners, type Banner } from "@/data/site";
import {
  bannerToDraft,
  draftToBanner,
  type BannerDraft,
} from "../_utils/banner.utils";
import BannerPreview from "./BannerPreview";

type Props = {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  banner: Banner | null;
};

export default function BannerForm({ open, onOpenChange, banner }: Props) {
  return open ? (
    <Inner
      key={banner?.id ?? "new"}
      onOpenChange={onOpenChange}
      banner={banner}
    />
  ) : null;
}

function Inner({ onOpenChange, banner }: Omit<Props, "open">) {
  const { toast } = useStore();
  const form = useForm<BannerDraft>({
    resolver: zodResolver(bannerFormSchema),
    defaultValues: bannerToDraft(
      banner,
      Math.max(0, ...banners.map((b) => b.order)) + 1,
    ),
  });
  const d = useWatch({ control: form.control, compute: (values) => values });
  const err = (key: keyof BannerDraft) => form.formState.errors[key]?.message;

  const submit = form.handleSubmit(() => {
    saveBanner(draftToBanner(d, banner?.id ?? uid("b")));
    toast(banner ? "Banner updated" : "Banner created");
    onOpenChange(false);
  });

  return (
    <Modal
      open
      onOpenChange={onOpenChange}
      size="lg"
      title={banner ? "Edit banner" : "New banner"}
      footer={
        <>
          <Btn onClick={() => onOpenChange(false)}>Cancel</Btn>
          <Btn variant="primary" type="submit" form="banner-form">
            Save
          </Btn>
        </>
      }
    >
      <form
        id="banner-form"
        onSubmit={submit}
        noValidate
        className="grid gap-4"
      >
        <BannerPreview d={d} />
        <FormField
          form={form}
          id="banner-title"
          name="title"
          isAdmin
          isInput
          label="Title"
        />
        <FormField
          form={form}
          id="banner-subtitle"
          name="subtitle"
          isAdmin
          isInput
          label="Subtitle"
        />
        <div>
          <p className="mb-1 text-xs font-medium text-foreground/80">Image</p>
          <ImageField
            value={d.image}
            onChange={(v) =>
              form.setValue("image", v, {
                shouldDirty: true,
                shouldValidate: form.formState.isSubmitted,
              })
            }
          />
          {err("image") && (
            <p className="mt-1 text-xs text-red-600">{err("image")}</p>
          )}
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField
            form={form}
            id="banner-ctaLabel"
            name="ctaLabel"
            isAdmin
            isInput
            label="Button label"
          />
          <FormField
            form={form}
            id="banner-ctaLink"
            name="ctaLink"
            isAdmin
            isInput
            label="Button link"
          />
          <FormField
            form={form}
            id="banner-placement"
            name="placement"
            isAdmin
            isSelect
            label="Placement"
            options={[
              { value: "hero", label: "Hero" },
              { value: "promo", label: "Promo" },
            ]}
          />
          <FormField
            form={form}
            id="banner-order"
            name="order"
            isAdmin
            isInput
            label="Order"
            type="number"
            min={0}
          />
          <FormField
            form={form}
            id="banner-startsAt"
            name="startsAt"
            isAdmin
            isInput
            label="Starts (optional)"
            type="datetime-local"
          />
          <FormField
            form={form}
            id="banner-endsAt"
            name="endsAt"
            isAdmin
            isInput
            label="Ends (optional)"
            type="datetime-local"
          />
        </div>
        <FormField
          form={form}
          id="banner-active"
          name="active"
          isAdmin
          isSwitch
          label="Active"
        />
      </form>
    </Modal>
  );
}
