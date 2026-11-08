This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

### COD orders

Checkout, customer receipts/account orders, and admin orders use the backend through
RTK Query. All connected form fields use `src/components/common/form-field.tsx`
with React Hook Form and Zod. Dashboard analytics and the legacy customer directory
remain demo features.

Configure `NEXT_PUBLIC_API_URL` to the backend `/api/v1` URL and
`NEXT_PUBLIC_BACKEND_URL` to its origin. Deploy the backend order migration and
customer-search endpoint before enabling these screens against a live database.

Checkout purchases only the selected saved cart lines. Review totals before placing
a COD order. Uncertain submissions retain their original payload and idempotency key
in session storage; retry that order before starting another. Browser session storage
must be available for safe submission/recovery.

Guest order IDs and private access codes are remembered in local storage, with a
forget action on the receipt. Access codes travel in Authorization headers, never
URLs or printed receipts. If persistent storage is blocked, save the code shown on
the receipt before closing the tab. Account orders are scoped to the signed-in owner.

Admin manual orders support normal variants and explicit combo sizes, optional
customer linking and price-adjustment reasons. Summaries are computed from cart/catalog data and
`GET /orders/delivery-policy`; placement alone validates stock and expected totals.
New orders snapshot product images; deploy the order-images migration first. Older
orders without image snapshots retain placeholders. Only supported
status transitions are offered. Failed-delivery receipt inspection restores sellable
pieces only. Courier assignment, exchanges, bulk actions, and manual paid toggles
are not part of this backend flow.

Verification:

```bash
bun test tests/order.test.ts tests/order-api.test.ts
bun run test:order:browser
bun run build
```

Browser tests use a local mock backend and a separate `.next-playwright` output.
Install Playwright Chromium before running them, or set `PLAYWRIGHT_CHANNEL=msedge`
to use an existing Edge installation. Tests never place orders in the application database.
Production builds require network access for the existing Google Fonts.

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
