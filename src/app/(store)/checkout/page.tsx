import { Button } from "@/components/ui/button";

export default function Page() {
  return <section className="mx-auto max-w-lg py-20 text-center"><h1 className="font-display text-3xl">Checkout is coming soon</h1><p className="mt-4 text-sm text-muted-foreground">You can save and select items in your bag. Ordering is not available yet, and no items have been removed.</p><Button to="/cart" variant="accent" className="mt-6">Return to your bag</Button></section>;
}
