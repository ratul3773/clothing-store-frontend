"use client";

import useCart from "@/hooks/useCart";
import useCheckout from "../_hooks/useCheckout";
import CheckoutForm from "./CheckoutForm";
import OrderSummary from "./OrderSummary";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useStore } from "@/components/providers/StoreProvider";

export default function CheckoutView() {
  const { cart, retrySession } = useCart({ page: 1, limit: 50 }, true);
  if (
    cart.mode === "resolving" ||
    cart.loading ||
    (!cart.ready && !cart.error && ["guest", "account"].includes(cart.mode))
  )
    return <Skeleton className="my-12 h-96 w-full" />;
  if (!cart.ready)
    return (
      <div className="space-y-4 py-12" role="alert">
        <p>
          {cart.error ||
            "Use a verified customer account or continue as a guest."}
        </p>
        <Button onClick={() => void retrySession()}>Retry</Button>
        <Button to="/cart">Return to cart</Button>
      </div>
    );
  return <CheckoutContent key={cart.identityKey} cart={cart} />;
}

function CheckoutContent({
  cart,
}: {
  cart: ReturnType<typeof useCart>["cart"];
}) {
  const checkout = useCheckout(cart.identityKey, cart);
  const { setAuthOpen } = useStore();
  const locked =
    checkout.attempt.pending || !!checkout.attempt.attempt || cart.busy;
  if (cart.refreshing && !checkout.attempt.attempt && !checkout.completed)
    return <Skeleton className="my-12 h-96 w-full" />;
  if (checkout.completed)
    return (
      <div className="py-12">
        <p>Order placed.</p>
        <Button to={`/order?id=${checkout.completed.id}`}>
          View your receipt
        </Button>
      </div>
    );
  if (!checkout.validSelection && !checkout.attempt.attempt)
    return (
      <div className="space-y-4 py-12">
        <h1 className="font-display text-2xl">Review your bag</h1>
        <p>
          Your checkout selection is missing or has changed. Review the current
          items before continuing.
        </p>
        {checkout.attempt.error && <p role="alert" className="text-destructive">{checkout.attempt.error}</p>}
        <Button to="/cart">Return to cart</Button>
      </div>
    );
  return (
    <section className="py-8">
      <h1 className="mb-6 font-display text-3xl">Checkout</h1>
      {cart.mode === "guest" && !locked && (
        <p className="mb-6 text-sm">
          No account needed.{" "}
          <Button
            type="button"
            variant="link"
            onClick={() => {
              try {
                sessionStorage.setItem("orders:login-return", "/cart");
              } catch {}
              setAuthOpen(true);
            }}
          >
            Sign in
          </Button>{" "}
          to use saved addresses. Your bag will be reviewed again after sign-in.
        </p>
      )}
      {(checkout.policyError || checkout.attempt.error) && (
        <p role="alert" className="mb-4 text-destructive">
          {checkout.policyError || checkout.attempt.error}
          {checkout.policyError && <Button type="button" variant="link" onClick={() => void checkout.retryPolicy()}>Retry delivery charges</Button>}
        </p>
      )}
      {checkout.attempt.attempt ? (
        <div className="space-y-4 rounded border border-border p-6">
          <p>
            A previous submission needs its result confirmed. Retry it before
            starting another order.
          </p>
          <Button
            disabled={checkout.attempt.pending}
            onClick={() => void checkout.attempt.submit()}
          >
            {checkout.attempt.pending ? "Confirming…" : "Retry original order"}
          </Button>
        </div>
      ) : (
        <form
          onSubmit={checkout.place}
          noValidate
          className="grid items-start gap-8 lg:grid-cols-[1.2fr_1fr]"
        >
          <div className="space-y-5">
            {checkout.addressError && (
              <p role="alert">
                Saved addresses could not be loaded. Enter your address below or{" "}
                <Button
                  type="button"
                  variant="link"
                  onClick={() => void checkout.retryAddresses()}
                >
                  Retry addresses
                </Button>
                .
              </p>
            )}
            <CheckoutForm
              form={checkout.form}
              addresses={checkout.addresses}
              onSelectAddress={checkout.selectAddress}
              disabled={locked}
            />
            <div className="flex flex-wrap gap-3">
              <Button type="submit" variant="accent" disabled={locked || checkout.policyLoading || !!checkout.policyError || !checkout.summary}>
                Place COD order
              </Button>
            </div>
          </div>
          <OrderSummary order={checkout.summary} />
        </form>
      )}
    </section>
  );
}
