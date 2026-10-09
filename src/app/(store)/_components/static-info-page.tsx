import Link from "next/link";
import { ArrowRight, Mail, MapPin, Phone } from "lucide-react";
import { StoreShell } from "@/components/layout/site-header";

type StaticSection = {
  title: string;
  body: string;
  bullets?: string[];
};

type StaticInfoPageProps = {
  eyebrow: string;
  title: string;
  intro: string;
  sections: readonly StaticSection[];
  contact?: boolean;
};

export function StaticInfoPage({
  eyebrow,
  title,
  intro,
  sections,
  contact = false,
}: StaticInfoPageProps) {
  return (
    <StoreShell>
      <main>
        <header className="border-b border-border bg-surface">
          <div className="mx-auto max-w-4xl px-5 py-20 sm:px-8 lg:py-28">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-accent-foreground">
              {eyebrow}
            </p>
            <h1 className="mt-4 max-w-3xl font-display text-5xl font-black leading-[0.92] tracking-[-0.07em] text-primary sm:text-7xl">
              {title}
            </h1>
            <p className="mt-7 max-w-2xl text-lg leading-8 text-muted-foreground">
              {intro}
            </p>
          </div>
        </header>

        <div className="mx-auto grid max-w-6xl gap-12 px-5 py-16 sm:px-8 lg:grid-cols-[1fr_0.35fr] lg:gap-20 lg:py-24">
          <div className="grid gap-10">
            {sections.map((section) => (
              <section
                key={section.title}
                className="border-t border-border pt-7"
              >
                <h2 className="font-display text-3xl font-bold text-primary">
                  {section.title}
                </h2>
                <p className="mt-4 max-w-2xl leading-7 text-muted-foreground">
                  {section.body}
                </p>
                {section.bullets ? (
                  <ul className="mt-5 grid gap-3 text-sm leading-6 text-muted-foreground">
                    {section.bullets.map((bullet) => (
                      <li key={bullet} className="flex gap-3">
                        <span className="mt-2 size-1.5 shrink-0 rounded-full bg-accent" />
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </section>
            ))}
          </div>

          {contact ? <ContactCard /> : <HelpfulCard />}
        </div>
      </main>
    </StoreShell>
  );
}

function ContactCard() {
  return (
    <aside className="h-fit border border-border bg-surface p-6 lg:sticky lg:top-8">
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-accent-foreground">
        Talk to us
      </p>
      <h2 className="mt-3 font-display text-3xl font-bold text-primary">
        We are here to help.
      </h2>
      <div className="mt-7 grid gap-5 text-sm text-muted-foreground">
        <a
          className="flex items-start gap-3 hover:text-foreground"
          href="mailto:hello@neelclothing.com"
        >
          <Mail className="mt-0.5 size-4 shrink-0" />
          hello@neelclothing.com
        </a>
        <a
          className="flex items-start gap-3 hover:text-foreground"
          href="tel:+8801700000000"
        >
          <Phone className="mt-0.5 size-4 shrink-0" />
          +880 1700 000000
        </a>
        <p className="flex items-start gap-3">
          <MapPin className="mt-0.5 size-4 shrink-0" />
          Dhaka, Bangladesh
        </p>
      </div>
      <Link
        href="/shop"
        className="mt-8 inline-flex items-center gap-2 text-sm font-semibold underline underline-offset-8"
      >
        Continue shopping
        <ArrowRight className="size-4" />
      </Link>
    </aside>
  );
}

function HelpfulCard() {
  return (
    <aside className="h-fit border border-border bg-surface p-6 lg:sticky lg:top-8">
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-accent-foreground">
        Need more help?
      </p>
      <h2 className="mt-3 font-display text-3xl font-bold text-primary">
        Speak with our team.
      </h2>
      <p className="mt-4 text-sm leading-6 text-muted-foreground">
        We can help with sizing, order updates, exchanges, and finding the right
        piece.
      </p>
      <Link
        href="/contact"
        className="mt-7 inline-flex items-center gap-2 text-sm font-semibold underline underline-offset-8"
      >
        Contact Neel
        <ArrowRight className="size-4" />
      </Link>
    </aside>
  );
}

export const staticPages = {
  contact: {
    eyebrow: "Contact Neel",
    title: "A real person is on the other side.",
    intro:
      "Questions about an order, a fit, or a piece you have been thinking about? Send us a note and we will get back to you during working hours.",
    contact: true,
    sections: [
      {
        title: "Customer care",
        body: "For order updates, exchanges, sizing help, and product questions, email us at hello@neelclothing.com. Our team replies Sunday through Thursday, 10am–6pm.",
      },
      {
        title: "Order support",
        body: "Keep your order number ready when contacting us. It helps us find your delivery and resolve things quickly.",
      },
      {
        title: "Press and partnerships",
        body: "For collaborations, retail partnerships, and press requests, use the same email with the subject line Partnership.",
      },
    ],
  },
  delivery: {
    eyebrow: "Delivery",
    title: "From our door to yours.",
    intro:
      "Every order is packed with care and handed to a tracked local delivery partner.",
    sections: [
      {
        title: "Delivery times",
        body: "Dhaka deliveries usually arrive within 2–3 working days. Nationwide deliveries usually arrive within 3–5 working days after confirmation.",
      },
      {
        title: "Delivery charge",
        body: "Enjoy free delivery on orders over ৳3,000. A small delivery fee is shown at checkout for orders below that amount.",
      },
      {
        title: "Cash on delivery",
        body: "Cash on delivery is available across Bangladesh. Please keep the exact or agreed amount ready when your parcel arrives.",
      },
      {
        title: "Tracking",
        body: "We will contact you with delivery updates. If you need an update, contact us with your order number.",
      },
    ],
  },
  returns: {
    eyebrow: "Returns",
    title: "A simple, fair returns policy.",
    intro:
      "We want you to feel good about what you order. If it is not right, contact us and we will guide you through the next step.",
    sections: [
      {
        title: "Eligibility",
        body: "Contact us within 7 days of delivery. Items must be unworn, unwashed, unused, and returned with original tags and packaging.",
      },
      {
        title: "Non-returnable items",
        body: "Items that have been worn, washed, altered, damaged, or returned without tags cannot be accepted.",
      },
      {
        title: "Refunds",
        body: "Once the item is inspected, approved refunds are issued to the original payment method where possible. Delivery charges are non-refundable.",
      },
    ],
  },
  exchanges: {
    eyebrow: "Exchanges",
    title: "Find the fit that feels like you.",
    intro:
      "Need another size or a different colour? Our 7-day exchange process keeps it straightforward.",
    sections: [
      {
        title: "Start an exchange",
        body: "Contact us within 7 days of delivery with your order number and the size or style you need. We will confirm availability before arranging the exchange.",
      },
      {
        title: "Condition",
        body: "Exchange items must be unworn, unwashed, unused, and have their original tags attached.",
      },
      {
        title: "Size help",
        body: "If you are between sizes, send us your height, weight, and usual fit. Our team can recommend a size before you place a new order.",
      },
    ],
  },
  faq: {
    eyebrow: "FAQ",
    title: "The useful answers, all in one place.",
    intro:
      "A few things customers ask us most often. If you cannot find what you need, our team is happy to help.",
    sections: [
      {
        title: "How do I choose a size?",
        body: "Use the size guide on each product page and compare the measurements with a garment you already own. Our team can also help.",
      },
      {
        title: "Can I change my order?",
        body: "Contact us as soon as possible. We can usually update an order before it has been packed.",
      },
      {
        title: "What payment methods do you accept?",
        body: "We accept bKash, Nagad, local card payments, and cash on delivery where available.",
      },
      {
        title: "How do I care for my clothes?",
        body: "Follow the care label on each garment. In general, wash cool, avoid unnecessary tumble drying, and air dry when possible.",
      },
    ],
  },
  privacy: {
    eyebrow: "Privacy",
    title: "Your information stays yours.",
    intro:
      "We only collect the information needed to process orders, provide support, and improve your experience with Neel.",
    sections: [
      {
        title: "What we collect",
        body: "This may include your name, contact details, delivery address, order information, and messages you send to customer care.",
      },
      {
        title: "How we use it",
        body: "We use your information to confirm and deliver orders, handle support requests, process exchanges, and send updates you choose to receive.",
      },
      {
        title: "Your choices",
        body: "You can ask us to update or remove your information, subject to records we need to keep for legal or order purposes.",
      },
    ],
  },
  terms: {
    eyebrow: "Terms",
    title: "Clear expectations on both sides.",
    intro:
      "These terms explain the basics of shopping with Neel, from placing an order to receiving and caring for your pieces.",
    sections: [
      {
        title: "Orders",
        body: "An order is confirmed after we verify product availability and delivery details. We may contact you if information is incomplete or a product becomes unavailable.",
      },
      {
        title: "Pricing",
        body: "Prices and offers may change. The price shown at checkout is the price that applies to your order.",
      },
      {
        title: "Product care",
        body: "Please follow the care instructions supplied with your garment. We cannot be responsible for damage caused by incorrect care or alterations.",
      },
    ],
  },
} as const;
