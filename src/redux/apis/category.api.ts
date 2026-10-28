import { baseApi } from "../baseApi";
import { unwrapData } from "../api.utils";
import type {
  Category,
  CreateCategoryPayload,
  DeleteCategoryResult,
  UpdateCategoryPayload,
} from "./types/category.types";

const categoryTag = (id: string) => ({ type: "Category" as const, id });

export const categoryApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    /* ------------------------------------------------------------- public */
    getCategories: builder.query<Category[], void>({
      query: () => "/categories",
      transformResponse: unwrapData<Category[]>,
      providesTags: ["Categories"],
    }),

    getCategory: builder.query<Category, { slug: string }>({
      query: ({ slug }) => `/categories/${encodeURIComponent(slug)}`,
      transformResponse: unwrapData<Category>,
      providesTags: (_result, _error, { slug }) => [
        { type: "Category", id: slug },
        "Categories",
      ],
    }),

    /* -------------------------------------------------------------- admin */
    getAdminCategories: builder.query<Category[], void>({
      query: () => "/admin/categories",
      transformResponse: unwrapData<Category[]>,
      providesTags: (result) =>
        result
          ? [
              "Categories",
              ...result.map((category) => categoryTag(category.id)),
            ]
          : ["Categories"],
    }),

    createCategory: builder.mutation<Category, CreateCategoryPayload>({
      query: (data) => ({
        url: "/admin/categories",
        method: "POST",
        body: data,
      }),
      transformResponse: unwrapData<Category>,
      invalidatesTags: ["Categories"],
    }),

    updateCategory: builder.mutation<
      Category,
      { id: string; data: UpdateCategoryPayload }
    >({
      query: ({ id, data }) => ({
        url: `/admin/categories/${id}`,
        method: "PATCH",
        body: data,
      }),
      transformResponse: unwrapData<Category>,
      invalidatesTags: (_result, _error, { id }) => [
        categoryTag(id),
        "Categories",
        "Products",
      ],
    }),

    deleteCategory: builder.mutation<DeleteCategoryResult, string>({
      query: (id) => ({
        url: `/admin/categories/${id}`,
        method: "DELETE",
      }),
      transformResponse: unwrapData<DeleteCategoryResult>,
      invalidatesTags: (_result, _error, id) => [
        categoryTag(id),
        "Categories",
        "Products",
      ],
    }),

    uploadCategoryImage: builder.mutation<
      Category,
      { categoryId: string; file: File }
    >({
      query: ({ categoryId, file }) => {
        const formData = new FormData();
        formData.append("file", file);
        return {
          url: `/admin/categories/${categoryId}/image`,
          method: "POST",
          body: formData,
        };
      },
      transformResponse: unwrapData<Category>,
      invalidatesTags: (_result, _error, { categoryId }) => [
        categoryTag(categoryId),
        "Categories",
      ],
    }),

    removeCategoryImage: builder.mutation<Category, string>({
      query: (categoryId) => ({
        url: `/admin/categories/${categoryId}/image`,
        method: "DELETE",
      }),
      transformResponse: unwrapData<Category>,
      invalidatesTags: (_result, _error, categoryId) => [
        categoryTag(categoryId),
        "Categories",
      ],
    }),
  }),
});

export type { Category };

export const {
  useGetCategoriesQuery,
  useGetCategoryQuery,
  useGetAdminCategoriesQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
  useUploadCategoryImageMutation,
  useRemoveCategoryImageMutation,
} = categoryApi;
