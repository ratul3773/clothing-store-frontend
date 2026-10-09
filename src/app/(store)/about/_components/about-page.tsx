import Image from "next/image";
import { StoreShell, TrustStrip } from "@/components/layout/site-header";
export default function AboutPage() {
  return (
    <StoreShell>
      <main>
        <section className="mx-auto grid max-w-7xl lg:grid-cols-2">
          <div className="flex flex-col justify-center bg-surface px-5 py-16 sm:px-12 lg:px-16">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-accent-foreground">
              Our story
            </p>
            <h1 className="mt-4 font-display text-6xl font-black leading-[0.88] tracking-[-0.07em] text-primary">
              Clothes with
              <br />a point of view.
            </h1>
            <p className="mt-7 max-w-md leading-7 text-muted-foreground">
              Neel started with a simple question: why should well-made everyday
              clothes feel so hard to find in Bangladesh? We make the answer in
              small, considered runs.
            </p>
          </div>
          <div className="relative min-h-[480px]">
            <Image
              src="/images/lookbook.png"
              fill
              alt="Neel lookbook"
              className="object-cover"
            />
          </div>
        </section>
        <TrustStrip />
        <section className="mx-auto max-w-3xl px-4 py-20 sm:px-6">
          <h2 className="font-display text-4xl font-bold text-primary">
            Made here. Worn everywhere.
          </h2>
          <div className="mt-6 grid gap-5 text-muted-foreground leading-7">
            <p>
              We work with local makers and choose fabrics for the reality of
              our climate: cotton that softens, linen that breathes, trousers
              that hold their shape through a full day.
            </p>
            <p>
              Every style is designed to earn its place in your wardrobe. Less
              seasonal churn. More clothes you actually reach for.
            </p>
          </div>
          <div id="delivery" className="mt-16 border-t border-border pt-8">
            <h2 className="font-display text-3xl font-bold text-primary">
              Delivery & exchanges
            </h2>
            <p className="mt-4 leading-7 text-muted-foreground">
              Dhaka delivery takes 2–3 working days; nationwide delivery takes
              3–5. Exchange unused items within 7 days of delivery. Contact us
              from your order page and we’ll guide you through it.
            </p>
          </div>
          <div id="sizing" className="mt-12 border-t border-border pt-8">
            <h2 className="font-display text-3xl font-bold text-primary">
              Need help with sizing?
            </h2>
            <p className="mt-4 leading-7 text-muted-foreground">
              Product pages include a size guide and fit notes. If you’re
              between sizes, message us with your height, weight and usual fit —
              we’re happy to help.
            </p>
          </div>
        </section>
      </main>
    </StoreShell>
  );
}
