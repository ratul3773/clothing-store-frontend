import { z } from "zod";

const digitsText = /^\d+$/;

const optionalSortOrder = z
  .string()
  .trim()
  .refine(
    (value) => value === "" || digitsText.test(value),
    "Sort order must be a whole number",
  )
  .refine(
    (value) => value === "" || Number(value) <= 100000,
    "Sort order must be 100000 or less",
  );

export const categoryFormSchema = (forbiddenParentIds?: Set<string>) =>
  z
    .object({
      name: z
        .string()
        .trim()
        .min(1, "Category name is required")
        .max(100, "Category name must be 100 characters or fewer"),
      parentId: z.string().uuid().or(z.literal("")),
      description: z
        .string()
        .max(5000, "Description must be 5000 characters or fewer"),
      sortOrder: optionalSortOrder,
      isActive: z.boolean(),
      seoTitle: z.string().max(200, "SEO title must be 200 characters or fewer"),
      seoDescription: z
        .string()
        .max(500, "SEO description must be 500 characters or fewer"),
    })
    .superRefine((value, ctx) => {
      if (value.parentId && forbiddenParentIds?.has(value.parentId)) {
        ctx.addIssue({
          code: "custom",
          path: ["parentId"],
          message: "A category cannot use itself or one of its descendants",
        });
      }
    });

export type CategoryFormValues = z.infer<ReturnType<typeof categoryFormSchema>>;
