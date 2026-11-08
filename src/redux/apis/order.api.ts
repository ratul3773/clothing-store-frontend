import { baseApi } from "../baseApi";
import { unwrapData, unwrapPaged, type Paged } from "../api.utils";
import { guestOrderToken } from "@/lib/order-storage";
import type {
  CheckoutPayload,
  CustomerOption,
  ManualOrderPayload,
  OrderAccess,
  DeliveryPolicy,
  OrderQuery,
  OrderReceipt,
  OrderStatus,
  OrderSummary,
  ReturnInspection,
} from "./types/order.types";

const changed = [
  "Order",
  "Cart",
  "Products",
  "Product",
  "Combos",
  "Combo",
  "Inventory",
  "Customer",
] as const;
const accessHeaders = (access: OrderAccess) =>
  access.guest
    ? { Authorization: `Bearer ${guestOrderToken(access.id) ?? ""}` }
    : undefined;
const orderUrl = (access: OrderAccess) =>
  `/orders/${access.id}${access.guest ? "/guest" : ""}`;

export const orderApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getOrderDeliveryPolicy: builder.query<DeliveryPolicy, void>({
      query: () => ({ url: "/orders/delivery-policy", cache: "no-store" }),
      transformResponse: unwrapData<DeliveryPolicy>,
      providesTags: ["Order"],
    }),
    createOrder: builder.mutation<
      OrderReceipt,
      { body: CheckoutPayload; key: string }
    >({
      query: ({ body, key }) => ({
        url: "/orders",
        method: "POST",
        body,
        headers: { "Idempotency-Key": key },
        timeout: 90_000,
      }),
      transformResponse: unwrapData<OrderReceipt>,
      invalidatesTags: (result) => (result ? [...changed] : []),
    }),
    getOrders: builder.query<
      Paged<OrderSummary>,
      OrderQuery & { owner: string }
    >({
      query: ({ q, status, source, from, to, page, limit }) => ({
        url: "/orders",
        params: { q, status, source, from, to, page, limit },
        cache: "no-store",
      }),
      transformResponse: unwrapPaged<OrderSummary>,
      providesTags: ["Order"],
    }),
    getOrder: builder.query<OrderReceipt, OrderAccess>({
      query: (access) => ({
        url: orderUrl(access),
        headers: accessHeaders(access),
        cache: "no-store",
      }),
      transformResponse: unwrapData<OrderReceipt>,
      providesTags: (_result, _error, { id }) => [{ type: "Order", id }],
      keepUnusedDataFor: 0,
    }),
    cancelOrder: builder.mutation<
      OrderReceipt,
      OrderAccess & { version: number }
    >({
      query: (access) => ({
        url: `${orderUrl(access)}/cancel`,
        method: "POST",
        headers: accessHeaders(access),
        body: { version: access.version },
        timeout: 90_000,
      }),
      transformResponse: unwrapData<OrderReceipt>,
      invalidatesTags: (result) => (result ? [...changed] : []),
    }),
    getAdminOrders: builder.query<
      Paged<OrderSummary>,
      OrderQuery & { owner: string }
    >({
      query: ({ q, status, source, from, to, page, limit }) => ({
        url: "/admin/orders",
        params: { q, status, source, from, to, page, limit },
        cache: "no-store",
      }),
      transformResponse: unwrapPaged<OrderSummary>,
      providesTags: ["Order"],
    }),
    getAdminOrder: builder.query<OrderReceipt, { id: string; owner: string }>({
      query: ({ id }) => ({ url: `/admin/orders/${id}`, cache: "no-store" }),
      transformResponse: unwrapData<OrderReceipt>,
      providesTags: (_result, _error, { id }) => [{ type: "Order", id }],
      keepUnusedDataFor: 0,
    }),
    createManualOrder: builder.mutation<
      OrderReceipt,
      { body: ManualOrderPayload; key: string }
    >({
      query: ({ body, key }) => ({
        url: "/admin/orders",
        method: "POST",
        body,
        headers: { "Idempotency-Key": key },
        timeout: 90_000,
      }),
      transformResponse: unwrapData<OrderReceipt>,
      invalidatesTags: (result) => (result ? [...changed] : []),
    }),
    changeOrderStatus: builder.mutation<
      OrderReceipt,
      {
        id: string;
        version: number;
        status: Exclude<OrderStatus, "PENDING_CONFIRMATION" | "RETURNED">;
        reason?: string;
      }
    >({
      query: ({ id, ...body }) => ({
        url: `/admin/orders/${id}/status`,
        method: "PATCH",
        body,
        timeout: 90_000,
      }),
      transformResponse: unwrapData<OrderReceipt>,
      invalidatesTags: (result) => (result ? [...changed] : []),
    }),
    receiveOrderReturn: builder.mutation<
      OrderReceipt,
      {
        id: string;
        version: number;
        reason: string;
        components: ReturnInspection[];
      }
    >({
      query: ({ id, ...body }) => ({
        url: `/admin/orders/${id}/return-receipt`,
        method: "POST",
        body,
        timeout: 90_000,
      }),
      transformResponse: unwrapData<OrderReceipt>,
      invalidatesTags: (result) => (result ? [...changed] : []),
    }),
    searchOrderCustomers: builder.query<
      CustomerOption[],
      { q: string; owner: string }
    >({
      query: ({ q }) => ({
        url: "/admin/orders/customer-search",
        params: { q },
        cache: "no-store",
      }),
      transformResponse: unwrapData<CustomerOption[]>,
      keepUnusedDataFor: 0,
    }),
  }),
});

export const {
  useGetOrderDeliveryPolicyQuery,
  useCreateOrderMutation,
  useGetOrdersQuery,
  useGetOrderQuery,
  useCancelOrderMutation,
  useGetAdminOrdersQuery,
  useGetAdminOrderQuery,
  useCreateManualOrderMutation,
  useChangeOrderStatusMutation,
  useReceiveOrderReturnMutation,
  useSearchOrderCustomersQuery,
} = orderApi;
