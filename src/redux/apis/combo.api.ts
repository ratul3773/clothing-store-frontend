import { baseApi } from "../baseApi";
import { unwrapData, unwrapPaged, type Paged, type PaginationQuery } from "../api.utils";
import type { Combo, CreateCombo, UpdateCombo } from "./types/combo.types";

export const comboApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCombos: builder.query<Paged<Combo>, PaginationQuery>({
      query: (params) => ({ url: "/combos", params }),
      transformResponse: unwrapPaged<Combo>,
      providesTags: ["Combos"],
    }),
    getAdminCombos: builder.query<Paged<Combo>, PaginationQuery>({
      query: (params) => ({ url: "/admin/combos", params }),
      transformResponse: unwrapPaged<Combo>,
      providesTags: ["Combos"],
    }),
    getAdminCombo: builder.query<Combo, string>({
      query: (id) => `/admin/combos/${id}`,
      transformResponse: unwrapData<Combo>,
      providesTags: (_result, _error, id) => [{ type: "Combo", id }],
    }),
    createCombo: builder.mutation<Combo, CreateCombo>({
      query: (body) => ({ url: "/admin/combos", method: "POST", body }),
      transformResponse: unwrapData<Combo>,
      invalidatesTags: (result) => result ? ["Combos", "Products", "Cart"] : [],
    }),
    updateCombo: builder.mutation<Combo, { id: string; data: UpdateCombo }>({
      query: ({ id, data }) => ({ url: `/admin/combos/${id}`, method: "PATCH", body: data }),
      transformResponse: unwrapData<Combo>,
      invalidatesTags: (result, _error, { id }) => result ? ["Combos", { type: "Combo", id }, "Products", "Cart"] : [],
    }),
  }),
});
export const { useGetCombosQuery, useGetAdminCombosQuery, useGetAdminComboQuery, useLazyGetAdminComboQuery, useCreateComboMutation, useUpdateComboMutation } = comboApi;
