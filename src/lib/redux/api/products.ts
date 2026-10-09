import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";
import { products } from "@/lib/data/products";
import type { Product } from "@/lib/types";

/**
 * RTK Query service. Endpoints resolve from local fixtures with a short
 * latency so loading and error states behave like the real API will.
 * Swap `fakeBaseQuery` for `fetchBaseQuery({ baseUrl })` when the backend is ready.
 */
const LATENCY_MS = 450;

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const catalogApi = createApi({
  reducerPath: "catalogApi",
  baseQuery: fakeBaseQuery<{ message: string }>(),
  endpoints: (build) => ({
    getProducts: build.query<Product[], { simulateError?: boolean } | void>({
      async queryFn(args) {
        await wait(LATENCY_MS);
        if (args && args.simulateError) {
          return { error: { message: "We couldn't load products right now." } };
        }
        return { data: products };
      },
    }),
    searchProducts: build.query<Product[], string>({
      async queryFn(term) {
        await wait(200);
        const q = term.trim().toLowerCase();
        if (!q) return { data: [] };
        const tokens = q.split(/\s+/);
        const data = products.filter((p) => {
          const haystack =
            `${p.name} ${p.category} ${p.fit} ${p.fabric} ${p.colors.map((c) => c.name).join(" ")}`.toLowerCase();
          return tokens.every((t) => haystack.includes(t.replace(/s$/, "")));
        });
        return { data };
      },
    }),
  }),
});

export const { useGetProductsQuery, useSearchProductsQuery } = catalogApi;
