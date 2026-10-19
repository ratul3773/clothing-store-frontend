
Next.js (App Router) + React 19 + Tailwind CSS v4 project running inside Figma Make. Statically exported (`output: 'export'`) to `out/`.

## Development Server

A Next.js dev server runs on `$PORT` (default 8443) via `.figma/make/dev` (`pnpm run dev`). Changes hot reload.

## Project Structure

Feature-colocated App Router layout. Route groups: `(store)` (customer pages) and `(admin)`.

- `src/app/layout.tsx` - Root layout: `next/font/google` (CSS vars `--f-display`, `--f-sans`, `--f-mono`), metadata, wraps everything in `AppShell`
- `src/app/globals.css` - Tailwind v4 import, design tokens (`:root` + `@theme inline`), keyframes
- `src/app/(store)/` - `/` (page.tsx), `shop/`, `p/[slug]/`, `checkout/`, `order/` (`?id=`), `account/`; `src/app/(admin)/admin/` - owner panel
- Each route folder keeps a thin `page.tsx` plus private folders, created only when they have real content: `_components/`, `_hooks/`, `_utils/*.utils.ts`, `_types/*.types.ts`, `_constants/*.constants.ts`, `_schemas/*.schema.ts` (plain TS validators), `_services/*.api.ts` (data access over `@/data`)
- `src/components/ui/` - Radix/shadcn-style primitives (button, sheet, tabs, accordion, controls, badge)
- `src/components/common/` - Globally reusable pieces (ProductCard, CartSheet, AuthSheet, FormField, Reveal)
- `src/components/layout/` - AppShell, Header, NavMenu, Footer, Background, PageTransition (frozen-router curtain wipe)
- `src/components/providers/StoreProvider.tsx` - Client context store (cart, wishlist, orders, auth, addresses, toasts), in-memory demo data; exports `useStore`
- `src/lib/` - `utils.ts` (cn, bdt), `nav.ts` (`useNavigate` / `useSearchParams` over `next/navigation`)
- `src/data/` - Catalog, taxonomy and seed orders
- `next.config.ts`, `postcss.config.mjs` - Static export config and Tailwind PostCSS plugin

Anything used by two or more routes goes into `src/components/common`; do not create a `src/pages` folder (Next would treat it as the Pages Router).

## Notes

- Components using hooks need `'use client'`. Pages reading `useSearchParams` must be wrapped in `<Suspense>`.
- Dynamic runtime data (orders) uses query strings because static export cannot prerender unknown params.
- The build script sets `NODE_ENV=production` explicitly; the sandbox defaults to development, which breaks `next build`.
- Deploy: `.figma/make/deploy` builds and uploads `out/`.

## Code quality

- Use double quotes for strings containing apostrophes, or escape them.
- Export components as default exports.


<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
