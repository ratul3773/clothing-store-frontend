import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const baseApi = createApi({
  reducerPath: "api",

  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_URL,
    credentials: "include",
  }),

  tagTypes: ["Auth", "Products", "Product" ,"Categories", "Category", "Variant","Catalog", "Image", "Offer", "Inventory", "Order", "Customer", "Message"] as const,

  endpoints: () => ({}),
});