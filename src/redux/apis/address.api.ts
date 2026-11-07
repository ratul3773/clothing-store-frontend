import { unwrapData } from "../api.utils";
import { baseApi } from "../baseApi";
import {
  Address,
  CreateAddressPayload,
  UpdateAddressPayload,
} from "./types/address.types";

export const addressApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    addAddress: builder.mutation<Address, CreateAddressPayload>({
      query: (data) => ({
        url: "/addresses",
        method: "POST",
        body: data,
      }),
      transformResponse: unwrapData<Address>,
      invalidatesTags: ["Address"],
    }),
    getAddresses: builder.query<Address[], void>({
      query: () => "/addresses",
      transformResponse: unwrapData<Address[]>,
      providesTags: ["Address"],
    }),
    getAddress: builder.query<Address, string>({
      query: (id) => `/addresses/${id}`,
      transformResponse: unwrapData<Address>,
      providesTags: ["Address"],
    }),
    updateAddress: builder.mutation<
      Address,
      { id: string; data: UpdateAddressPayload }
    >({
      query: ({ id, data }) => ({
        url: `/addresses/${id}`,
        method: "PATCH",
        body: data,
      }),
      transformResponse: unwrapData<Address>,
      invalidatesTags: ["Address"],
    }),
    deleteAddress: builder.mutation<void, string>({
      query: (id) => ({
        url: `/addresses/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Address"],
    }),
  }),
});

export const {
  useAddAddressMutation,
  useGetAddressesQuery,
  useGetAddressQuery,
  useUpdateAddressMutation,
  useDeleteAddressMutation,
} = addressApi;
