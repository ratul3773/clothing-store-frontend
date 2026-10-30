import { baseApi } from "../baseApi";
import {
  unwrapData,
  unwrapPaged,
  type Paged,
} from "../api.utils";
import type {
  AdminProduct,
  AdminProductQuery,
  AdminVariant,
  CreateColorPayload,
  CreateOfferPayload,
  CreateProductPayload,
  CreateVariantPayload,
  ProductImage,
  PublicProduct,
  PublicProductQuery,
  StockAdjustmentPayload,
  StockAdjustmentResult,
  StockMovement,
  UpdateColorPayload,
  UpdateImagePayload,
  UpdateOfferPayload,
  UpdateProductPayload,
  UpdateVariantPayload,
} from "./types/product.types";

const productTag = (id: string) => ({ type: "Product" as const, id });
const inventoryTag = (id: string) => ({ type: "Inventory" as const, id });

const productTags = (id: string) => [productTag(id), "Products" as const];

export const productApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    /* ------------------------------------------------------------- public */
    getProducts: builder.query<Paged<PublicProduct>, PublicProductQuery | void>({
      query: (params) => ({ url: "/products", params: params ?? undefined }),
      transformResponse: unwrapPaged<PublicProduct>,
      providesTags: (result) =>
        result
          ? [
              "Products",
              ...result.items.map((product) => productTag(product.id)),
            ]
          : ["Products"],
    }),

    getProduct: builder.query<PublicProduct, { slug: string }>({
      query: ({ slug }) => `/products/${encodeURIComponent(slug)}`,
      transformResponse: unwrapData<PublicProduct>,
      providesTags: ["Products"],
    }),

    /* -------------------------------------------------------------- admin */
    getAdminProducts: builder.query<Paged<AdminProduct>, AdminProductQuery | void>({
      query: (params) => ({
        url: "/admin/products",
        params: params ?? undefined,
      }),
      transformResponse: unwrapPaged<AdminProduct>,
      providesTags: (result) =>
        result
          ? [
              "Products",
              ...result.items.map((product) => productTag(product.id)),
            ]
          : ["Products"],
    }),

    getAdminProduct: builder.query<AdminProduct, { id: string }>({
      query: ({ id }) => `/admin/products/${id}`,
      transformResponse: unwrapData<AdminProduct>,
      providesTags: (_result, _error, { id }) => [productTag(id)],
    }),

    createProduct: builder.mutation<AdminProduct, CreateProductPayload>({
      query: (data) => ({
        url: "/admin/products",
        method: "POST",
        body: data,
      }),
      transformResponse: unwrapData<AdminProduct>,
      invalidatesTags: ["Products"],
    }),

    updateProduct: builder.mutation<
      AdminProduct,
      { id: string; data: UpdateProductPayload }
    >({
      query: ({ id, data }) => ({
        url: `/admin/products/${id}`,
        method: "PATCH",
        body: data,
      }),
      transformResponse: unwrapData<AdminProduct>,
      invalidatesTags: (_result, _error, { id }) => productTags(id),
    }),

    deleteProduct: builder.mutation<null, string>({
      query: (id) => ({ url: `/admin/products/${id}`, method: "DELETE" }),
      transformResponse: unwrapData<null>,
      invalidatesTags: (_result, _error, id) => productTags(id),
    }),

    publishProduct: builder.mutation<AdminProduct, string>({
      query: (id) => ({
        url: `/admin/products/${id}/publish`,
        method: "POST",
      }),
      transformResponse: unwrapData<AdminProduct>,
      invalidatesTags: (_result, _error, id) => productTags(id),
    }),

    unpublishProduct: builder.mutation<AdminProduct, string>({
      query: (id) => ({
        url: `/admin/products/${id}/unpublish`,
        method: "POST",
      }),
      transformResponse: unwrapData<AdminProduct>,
      invalidatesTags: (_result, _error, id) => productTags(id),
    }),

    archiveProduct: builder.mutation<AdminProduct, string>({
      query: (id) => ({
        url: `/admin/products/${id}/archive`,
        method: "POST",
      }),
      transformResponse: unwrapData<AdminProduct>,
      invalidatesTags: (_result, _error, id) => productTags(id),
    }),

    restoreProduct: builder.mutation<AdminProduct, string>({
      query: (id) => ({
        url: `/admin/products/${id}/restore`,
        method: "POST",
      }),
      transformResponse: unwrapData<AdminProduct>,
      invalidatesTags: (_result, _error, id) => productTags(id),
    }),

    /* ------------------------------------------------------------- colours */
    createColor: builder.mutation<
      AdminProduct,
      { productId: string; data: CreateColorPayload }
    >({
      query: ({ productId, data }) => ({
        url: `/admin/products/${productId}/colors`,
        method: "POST",
        body: data,
      }),
      transformResponse: unwrapData<AdminProduct>,
      invalidatesTags: (_result, _error, { productId }) =>
        productTags(productId),
    }),

    updateColor: builder.mutation<
      AdminProduct,
      { productId: string; colorId: string; data: UpdateColorPayload }
    >({
      query: ({ productId, colorId, data }) => ({
        url: `/admin/products/${productId}/colors/${colorId}`,
        method: "PATCH",
        body: data,
      }),
      transformResponse: unwrapData<AdminProduct>,
      invalidatesTags: (_result, _error, { productId }) =>
        productTags(productId),
    }),

    deleteColor: builder.mutation<
      AdminProduct,
      { productId: string; colorId: string }
    >({
      query: ({ productId, colorId }) => ({
        url: `/admin/products/${productId}/colors/${colorId}`,
        method: "DELETE",
      }),
      transformResponse: unwrapData<AdminProduct>,
      invalidatesTags: (_result, _error, { productId }) =>
        productTags(productId),
    }),

    /* ------------------------------------------------------------ variants */
    createVariant: builder.mutation<
      AdminProduct,
      { productId: string; data: CreateVariantPayload }
    >({
      query: ({ productId, data }) => ({
        url: `/admin/products/${productId}/variants`,
        method: "POST",
        body: data,
      }),
      transformResponse: unwrapData<AdminProduct>,
      invalidatesTags: (_result, _error, { productId }) =>
        productTags(productId),
    }),

    updateVariant: builder.mutation<
      AdminProduct,
      { productId: string; variantId: string; data: UpdateVariantPayload }
    >({
      query: ({ productId, variantId, data }) => ({
        url: `/admin/products/${productId}/variants/${variantId}`,
        method: "PATCH",
        body: data,
      }),
      transformResponse: unwrapData<AdminProduct>,
      invalidatesTags: (_result, _error, { productId }) =>
        productTags(productId),
    }),

    deleteVariant: builder.mutation<
      AdminProduct,
      { productId: string; variantId: string }
    >({
      query: ({ productId, variantId }) => ({
        url: `/admin/products/${productId}/variants/${variantId}`,
        method: "DELETE",
      }),
      transformResponse: unwrapData<AdminProduct>,
      invalidatesTags: (_result, _error, { productId }) =>
        productTags(productId),
    }),

    /* --------------------------------------------------------------- stock */
    adjustStock: builder.mutation<
      StockAdjustmentResult,
      { productId: string; variantId: string; data: StockAdjustmentPayload }
    >({
      query: ({ productId, variantId, data }) => ({
        url: `/admin/products/${productId}/variants/${variantId}/stock`,
        method: "POST",
        body: data,
      }),
      transformResponse: unwrapData<StockAdjustmentResult>,
      invalidatesTags: (_result, _error, { productId, variantId }) => [
        ...productTags(productId),
        inventoryTag(variantId),
      ],
    }),

    getStockMovements: builder.query<
      Paged<StockMovement>,
      { productId: string; variantId: string; page?: number; limit?: number }
    >({
      query: ({ productId, variantId, page, limit }) => ({
        url: `/admin/products/${productId}/variants/${variantId}/movements`,
        params: { page, limit },
      }),
      transformResponse: unwrapPaged<StockMovement>,
      providesTags: (_result, _error, { variantId }) => [
        inventoryTag(variantId),
      ],
    }),

    /* -------------------------------------------------------------- offers */
    createOffer: builder.mutation<
      AdminProduct,
      { productId: string; data: CreateOfferPayload }
    >({
      query: ({ productId, data }) => ({
        url: `/admin/products/${productId}/offers`,
        method: "POST",
        body: data,
      }),
      transformResponse: unwrapData<AdminProduct>,
      invalidatesTags: (_result, _error, { productId }) =>
        productTags(productId),
    }),

    updateOffer: builder.mutation<
      AdminProduct,
      { productId: string; offerId: string; data: UpdateOfferPayload }
    >({
      query: ({ productId, offerId, data }) => ({
        url: `/admin/products/${productId}/offers/${offerId}`,
        method: "PATCH",
        body: data,
      }),
      transformResponse: unwrapData<AdminProduct>,
      invalidatesTags: (_result, _error, { productId }) =>
        productTags(productId),
    }),

    deactivateOffer: builder.mutation<
      AdminProduct,
      { productId: string; offerId: string }
    >({
      query: ({ productId, offerId }) => ({
        url: `/admin/products/${productId}/offers/${offerId}`,
        method: "DELETE",
      }),
      transformResponse: unwrapData<AdminProduct>,
      invalidatesTags: (_result, _error, { productId }) =>
        productTags(productId),
    }),

    /* -------------------------------------------------------------- images */
    uploadImage: builder.mutation<
      AdminProduct,
      { productId: string; file: File }
    >({
      query: ({ productId, file }) => {
        const formData = new FormData();
        formData.append("file", file);
        return {
          url: `/admin/products/${productId}/images`,
          method: "POST",
          body: formData,
        };
      },
      transformResponse: unwrapData<AdminProduct>,
      invalidatesTags: (_result, _error, { productId }) =>
        productTags(productId),
    }),

    updateImage: builder.mutation<
      AdminProduct,
      { productId: string; imageId: string; data: UpdateImagePayload }
    >({
      query: ({ productId, imageId, data }) => ({
        url: `/admin/products/${productId}/images/${imageId}`,
        method: "PATCH",
        body: data,
      }),
      transformResponse: unwrapData<AdminProduct>,
      invalidatesTags: (_result, _error, { productId }) =>
        productTags(productId),
    }),

    reorderImages: builder.mutation<
      AdminProduct,
      { productId: string; imageIds: string[] }
    >({
      query: ({ productId, imageIds }) => ({
        url: `/admin/products/${productId}/images/reorder`,
        method: "PATCH",
        body: { imageIds },
      }),
      transformResponse: unwrapData<AdminProduct>,
      invalidatesTags: (_result, _error, { productId }) =>
        productTags(productId),
    }),

    deleteImage: builder.mutation<
      AdminProduct,
      { productId: string; imageId: string }
    >({
      query: ({ productId, imageId }) => ({
        url: `/admin/products/${productId}/images/${imageId}`,
        method: "DELETE",
      }),
      transformResponse: unwrapData<AdminProduct>,
      invalidatesTags: (_result, _error, { productId }) =>
        productTags(productId),
    }),
  }),
});

// Convenience aliases for consumers that want the raw DTO shapes.
export type { AdminProduct, AdminVariant, ProductImage, PublicProduct };

export const {
  useGetProductsQuery,
  useGetProductQuery,
  useGetAdminProductsQuery,
  useGetAdminProductQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
  usePublishProductMutation,
  useUnpublishProductMutation,
  useArchiveProductMutation,
  useRestoreProductMutation,
  useCreateColorMutation,
  useUpdateColorMutation,
  useDeleteColorMutation,
  useCreateVariantMutation,
  useUpdateVariantMutation,
  useDeleteVariantMutation,
  useAdjustStockMutation,
  useGetStockMovementsQuery,
  useCreateOfferMutation,
  useUpdateOfferMutation,
  useDeactivateOfferMutation,
  useUploadImageMutation,
  useUpdateImageMutation,
  useReorderImagesMutation,
  useDeleteImageMutation,
} = productApi;
