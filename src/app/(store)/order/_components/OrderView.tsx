"use client";

import { useState, useSyncExternalStore } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { authClient } from "@/lib/auth-client";
import { FormField } from "@/components/common/form-field";
import OrderReceipt from "@/components/common/OrderReceipt";
import AlertDialogText from "@/components/common/Alert-Dialogue";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useGetOrderQuery,
  useCancelOrderMutation,
  orderApi,
} from "@/redux/apis/order.api";
import { useAppDispatch } from "@/redux/hooks";
import { apiErrorMessage } from "@/redux/api.utils";
import {
  forgetGuestOrder,
  guestOrderToken,
  guestOrderPersisted,
  rememberedGuestOrders,
  rememberGuestOrder,
} from "@/lib/order-storage";
import { orderLabel } from "@/lib/order-rules";
import type { OrderAccess } from "@/redux/apis/types/order.types";

const accessSchema = z.object({
  id: z.string().uuid("Enter a valid order ID"),
  token: z
    .string()
    .trim()
    .regex(
      /^[A-Za-z0-9_-]{43}$/,
      "Enter the private access code supplied with your receipt",
    ),
});
const noSubscription = () => () => {};
const cancellationSchema = z.object({ reason: z.string().trim().min(1, "A reason is required").max(500) });

export default function OrderView() {
  const params = useSearchParams();
  const ready = useSyncExternalStore(
    noSubscription,
    () => true,
    () => false,
  );
  const session = authClient.useSession();
  if (!ready || session.isPending) return <Skeleton className="my-8 h-96" />;
  return (
    <OrderContent
      key={`${params.get("id")}:${session.data?.user.id ?? "guest"}`}
      id={params.get("id") ?? ""}
      owner={session.data?.user.id ?? "guest"}
      customer={
        session.data?.user.role === "customer" &&
        !!session.data.user.emailVerified
      }
      sessionError={!!session.error}
    />
  );
}

function OrderContent({
  id,
  owner,
  customer,
  sessionError,
}: {
  id: string;
  owner: string;
  customer: boolean;
  sessionError: boolean;
}) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [token, setToken] = useState(() => guestOrderToken(id));
  const [remembered, setRemembered] = useState(rememberedGuestOrders);
  const [error, setError] = useState("");
  const [confirmCancel, setConfirmCancel] = useState(false);
  const [showCode, setShowCode] = useState(() => !!token && !guestOrderPersisted(id));
  const form = useForm<z.infer<typeof accessSchema>>({
    resolver: zodResolver(accessSchema),
    defaultValues: { id, token: "" },
  });
  const validId = z.string().uuid().safeParse(id).success;
  const access: OrderAccess = { id, owner, guest: !!token };
  const query = useGetOrderQuery(access, {
    skip: !validId || (!token && (!customer || sessionError)),
    refetchOnMountOrArgChange: true,
  });
  const [cancel, cancelState] = useCancelOrderMutation();
  const cancelForm = useForm<z.infer<typeof cancellationSchema>>({
    resolver: zodResolver(cancellationSchema), defaultValues: { reason: "" },
  });
  const openWithCode = form.handleSubmit((values) => {
    if (!rememberGuestOrder(values.id, values.token))
      setError(
        "This browser cannot remember your code. Keep it somewhere safe before closing this tab.",
      );
    if (values.id === id) {
      setToken(values.token);
      dispatch(orderApi.util.invalidateTags([{ type: "Order", id }]));
    } else router.push(`/order?id=${values.id}`);
  });
  const cancelOrder = cancelForm.handleSubmit(async ({ reason }) => {
    if (!query.currentData || query.currentData.status !== "PENDING_CONFIRMATION" || cancelState.isLoading) return;
    try {
      await cancel({ ...access, version: query.currentData.version, reason }).unwrap();
      setConfirmCancel(false);
    } catch (failure) {
      setError(apiErrorMessage(failure));
      setConfirmCancel(false);
      void query.refetch();
    }
  });
  return (
    <section className="space-y-6 py-8">
      <div className="flex flex-wrap justify-between gap-3">
        <h1 className="font-display text-3xl">Your order</h1>
        <Button to="/shop" variant="outline">
          Continue shopping
        </Button>
      </div>
      {error && (
        <p role="alert" className="text-destructive">
          {error}
        </p>
      )}
      {query.isLoading ? (
        <Skeleton className="h-96" />
      ) : query.currentData ? (
        <>
          <div className="border border-border p-5">
            <OrderReceipt order={query.currentData} printable />
          </div>
          <div className="flex flex-wrap gap-3">
            <Button variant="outline" onClick={() => window.print()}>
              Print receipt
            </Button>
            <Button
              variant="outline"
              disabled={query.isFetching}
              onClick={() => void query.refetch()}
            >
              Refresh status
            </Button>
            {query.currentData.status === "PENDING_CONFIRMATION" && (
              <Button
                variant="destructive"
                disabled={cancelState.isLoading || query.isFetching}
                onClick={() => setConfirmCancel(true)}
              >
                Cancel order
              </Button>
            )}
            {token && (
              <>
                <Button
                  variant="ghost"
                  onClick={() => setShowCode((value) => !value)}
                >
                  Show private access code
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => {
                    forgetGuestOrder(id);
                    setToken(null);
                    setRemembered(rememberedGuestOrders());
                  }}
                >
                  Forget this order
                </Button>
              </>
            )}
          </div>
          {showCode && token && (
            <p className="break-all border border-border p-4 text-sm">
              Order ID: {id}
              <br />
              Private access code: <code>{token}</code>
              <br />
              Keep this code private. It grants access to this order.
            </p>
          )}
          <div className="space-y-3">
            <h2 className="font-semibold">Order history</h2>
            <ol className="space-y-3 border-l border-border pl-4">
              {query.currentData.history.map((event) => (
                <li key={event.id}>
                  <p>
                    {event.event === "EXPIRED"
                      ? "Expired — stock released"
                      : orderLabel(event.toStatus)}
                  </p>
                  <time className="text-sm text-muted-foreground">
                    {new Date(event.createdAt).toLocaleString("en-GB")}
                  </time>
                </li>
              ))}
            </ol>
          </div>
        </>
      ) : (
        <div className="space-y-4">
          {query.error && (
            <div role="alert">
              <p>
                {apiErrorMessage(
                  query.error,
                  "Order unavailable. Check your account or access code.",
                )}
              </p>
              <Button variant="outline" onClick={() => void query.refetch()}>
                Retry
              </Button>
            </div>
          )}
          {sessionError && (
            <p role="alert">
              Your session could not be verified. Use a guest access code or
              sign in again.
            </p>
          )}
          {token && <Button variant="outline" onClick={() => { forgetGuestOrder(id); setToken(null); setRemembered(rememberedGuestOrders()); }}>Forget saved code and try another method</Button>}
          <p>
            Enter the order ID and private access code from your guest receipt,
            or sign in to the customer account that owns the order.
          </p>
          <form
            onSubmit={openWithCode}
            noValidate
            className="max-w-lg space-y-4"
          >
            <FormField
              form={form}
              id="receipt-order-id"
              name="id"
              label="Order ID"
              isInput
            />
            <FormField
              form={form}
              id="receipt-access-code"
              name="token"
              label="Private access code"
              isInput
              type="password"
              autoComplete="off"
            />
            <Button type="submit">Open receipt</Button>
          </form>
        </div>
      )}
      {!!remembered.length && (
        <div className="space-y-3 border-t border-border pt-5">
          <h2 className="font-semibold">Remembered on this device</h2>
          <div className="flex flex-wrap gap-3">
            {remembered.map((orderId) => (
              <Button
                key={orderId}
                to={`/order?id=${orderId}`}
                variant="outline"
                size="sm"
              >
                Order {orderId.slice(0, 8)}
              </Button>
            ))}
          </div>
        </div>
      )}
      <AlertDialogText
        title="Cancel this order?"
        description="Cancellation releases the reserved items. It is only available before confirmation."
        actionType="warning"
        confirmButtonText="Cancel order"
        open={confirmCancel}
        onOpenChange={(open) => { if (!cancelState.isLoading) setConfirmCancel(open); }}
        onConfirm={(event) => { event.preventDefault(); void cancelOrder(); }}
        warningMessage={<FormField form={cancelForm} id="customer-cancellation-reason" name="reason" label="Reason" isTextArea disabled={cancelState.isLoading} />}
        disabled={cancelState.isLoading}
      />
    </section>
  );
}
