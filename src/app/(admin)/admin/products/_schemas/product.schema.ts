import { z } from "zod";

import {
  PRODUCT_BADGES,
  PRODUCT_FITS,
  STOCK_ADJUSTMENT_TYPES,
} from "../_constants/products.constants";

/* ------------------------------------------------------------------ helpers */

const integerText = /^-?\d+$/;
const digitsText = /^\d+$/;
const hexColour = /^#[0-9a-fA-F]{6}$/;
const productCode = /^[A-Za-z0-9][A-Za-z0-9_-]*$/;

const positivePrice = (label: string) =>
  z
    .string()
    .trim()
    .min(1, `${label} is required`)
    .regex(digitsText, `${label} must be a whole number`)
    .refine((value) => Number(value) > 0, `${label} must be greater than zero`)
    .refine((value) => Number(value) <= 1_000_000_000, `${label} is too large`);

const optionalNonNegativeInt = (label: string) =>
  z
    .string()
    .trim()
    .refine(
      (value) => value === "" || digitsText.test(value),
      `${label} must be a whole number`,
    )
    .refine(
      (value) => value === "" || Number(value) <= 10_000_000,
      `${label} is too large`,
    );

/* -------------------------------------------------------------- product core */

export const productCoreSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Product name is required")
    .max(200, "Product name must be 200 characters or fewer"),
  code: z
    .string()
    .trim()
    .min(1, "Product code is required")
    .max(50, "Product code must be 50 characters or fewer")
    .regex(
      productCode,
      "Code may contain letters, numbers, underscores, and hyphens",
    ),
  parentCategoryId: z.string().uuid("Select a category"),
  categoryId: z.string().uuid("Select a subcategory"),
  regularPrice: positivePrice("Regular price"),
  description: z
    .string()
    .max(20000, "Description must be 20000 characters or fewer"),
  material: z.string().max(200, "Material must be 200 characters or fewer"),
  fit: z.enum(PRODUCT_FITS).or(z.literal("")),
  careInstructions: z
    .string()
    .max(2000, "Care instructions must be 2000 characters or fewer"),
  badges: z
    .array(z.enum(PRODUCT_BADGES))
    .max(5, "Choose at most 5 badges"),
  isExchangeEligible: z.boolean(),
  seoTitle: z.string().max(200, "SEO title must be 200 characters or fewer"),
  seoDescription: z
    .string()
    .max(500, "SEO description must be 500 characters or fewer"),
});

export type ProductCoreFormValues = z.infer<typeof productCoreSchema>;

/* ------------------------------------------------------------------- colours */

export const colorFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Colour name is required")
    .max(50, "Colour name must be 50 characters or fewer"),
  hex: z
    .string()
    .trim()
    .refine(
      (value) => value === "" || hexColour.test(value),
      "Use a hex colour like #1F2937",
    ),
});

export type ColorFormValues = z.infer<typeof colorFormSchema>;

/** Colours staged on the create screen before the product exists. */
export const createColorsSchema = z
  .array(colorFormSchema)
  .max(20, "A product may have at most 20 colours")
  .superRefine((colors, ctx) => {
    const seen = new Set<string>();
    colors.forEach((color, index) => {
      const key = color.name.trim().toLowerCase();
      if (seen.has(key)) {
        ctx.addIssue({
          code: "custom",
          path: [index, "name"],
          message: "Colour names must be unique",
        });
      }
      seen.add(key);
    });
  });

/* ------------------------------------------------------------------ variants */

export const createVariantFormSchema = z.object({
  colorId: z.string().uuid("Select a colour"),
  size: z
    .string()
    .trim()
    .min(1, "Size is required")
    .max(20, "Size must be 20 characters or fewer"),
  sizeOrder: optionalNonNegativeInt("Size order"),
  onHand: optionalNonNegativeInt("Opening stock"),
  lowStockThreshold: optionalNonNegativeInt("Low stock threshold"),
  isActive: z.boolean(),
});

export type CreateVariantFormValues = z.infer<typeof createVariantFormSchema>;

export const updateVariantFormSchema = z.object({
  size: z
    .string()
    .trim()
    .min(1, "Size is required")
    .max(20, "Size must be 20 characters or fewer"),
  sizeOrder: optionalNonNegativeInt("Size order"),
  lowStockThreshold: optionalNonNegativeInt("Low stock threshold"),
  isActive: z.boolean(),
});

export type UpdateVariantFormValues = z.infer<typeof updateVariantFormSchema>;

/* --------------------------------------------------------------------- stock */

export const stockAdjustmentFormSchema = z
  .object({
    type: z.enum(STOCK_ADJUSTMENT_TYPES),
    quantity: z.string().trim(),
    onHand: z.string().trim(),
    note: z.string().trim().max(500, "Note must be 500 characters or fewer"),
  })
  .superRefine((value, ctx) => {
    const quantityText = value.quantity.trim();
    const onHandText = value.onHand.trim();
    const quantity = integerText.test(quantityText)
      ? Number(quantityText)
      : null;
    const onHand = digitsText.test(onHandText) ? Number(onHandText) : null;

    if (value.type === "STOCKTAKE") {
      if (onHandText === "") {
        ctx.addIssue({
          code: "custom",
          path: ["onHand"],
          message: "Enter the counted stock",
        });
      } else if (onHand === null) {
        ctx.addIssue({
          code: "custom",
          path: ["onHand"],
          message: "Counted stock must be a whole number",
        });
      } else if (onHand > 10_000_000) {
        ctx.addIssue({
          code: "custom",
          path: ["onHand"],
          message: "Counted stock is too large",
        });
      }

      if (quantityText !== "") {
        ctx.addIssue({
          code: "custom",
          path: ["quantity"],
          message: "Quantity is not allowed for a stocktake",
        });
      }
      return;
    }

    if (quantityText === "") {
      ctx.addIssue({
        code: "custom",
        path: ["quantity"],
        message: "Enter a quantity",
      });
      return;
    }

    if (quantity === null) {
      ctx.addIssue({
        code: "custom",
        path: ["quantity"],
        message: "Quantity must be a whole number",
      });
      return;
    }

    if (Math.abs(quantity) > 10_000_000) {
      ctx.addIssue({
        code: "custom",
        path: ["quantity"],
        message: "Quantity is too large",
      });
      return;
    }

    if (
      (value.type === "RESTOCK" || value.type === "DAMAGED") &&
      quantity <= 0
    ) {
      ctx.addIssue({
        code: "custom",
        path: ["quantity"],
        message: "Quantity must be greater than zero",
      });
    }

    if (value.type === "ADJUSTMENT" && quantity === 0) {
      ctx.addIssue({
        code: "custom",
        path: ["quantity"],
        message: "Quantity cannot be zero",
      });
    }
  });

export type StockAdjustmentFormValues = z.infer<
  typeof stockAdjustmentFormSchema
>;

/* -------------------------------------------------------------------- offers */

export const offerFormSchema = (regularPrice: number) =>
  z
    .object({
      offerPrice: z
        .string()
        .trim()
        .min(1, "Offer price is required")
        .regex(digitsText, "Offer price must be a whole number")
        .refine(
          (value) => Number(value) > 0,
          "Offer price must be greater than zero",
        )
        .refine(
          (value) => Number(value) <= 1_000_000_000,
          "Offer price is too large",
        )
        .refine(
          (value) =>
            !Number.isFinite(regularPrice) ||
            Number(value) < regularPrice,
          "Offer price must be lower than the regular price",
        ),
      startsAt: z.string(),
      endsAt: z.string(),
      isActive: z.boolean(),
    })
    .superRefine((value, ctx) => {
      if (!value.startsAt || !value.endsAt) return;

      const startsAt = new Date(value.startsAt);
      const endsAt = new Date(value.endsAt);

      if (Number.isNaN(startsAt.getTime())) {
        ctx.addIssue({
          code: "custom",
          path: ["startsAt"],
          message: "Enter a valid start date",
        });
        return;
      }

      if (Number.isNaN(endsAt.getTime())) {
        ctx.addIssue({
          code: "custom",
          path: ["endsAt"],
          message: "Enter a valid end date",
        });
        return;
      }

      if (endsAt <= startsAt) {
        ctx.addIssue({
          code: "custom",
          path: ["endsAt"],
          message: "End date must be after the start date",
        });
      }
    });

export type OfferFormValues = z.infer<ReturnType<typeof offerFormSchema>>;

/* -------------------------------------------------------------------- images */

export const imageMetaSchema = z.object({
  alt: z.string().trim().max(300, "Alt text must be 300 characters or fewer"),
  colorId: z.string().uuid().or(z.literal("")),
});

export type ImageMetaFormValues = z.infer<typeof imageMetaSchema>;
