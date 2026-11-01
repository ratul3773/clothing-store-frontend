import CartContents from "@/app/(store)/cart/_components/CartContents";

export default function CartView() {
  return <>
    <p className="label-mono text-muted-foreground">Your selections</p>
    <h1 className="mt-2 border-b border-border pb-6 font-display text-2xl font-medium">Your cart</h1>
    <CartContents />
  </>;
}
