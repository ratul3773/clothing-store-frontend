
Next.js (App Router) + React 19 + Tailwind CSS v4 frontend. Also follow the workspace `../AGENTS.md` when available. Current `next.config.ts` enables `cacheComponents` and `partialPrefetching`; it does not configure static export. Read current configuration and scripts instead of assuming a Figma or static-export deployment.

## Development Server

Use the commands in `package.json`: `bun run dev`, `bun run build`, and `bun run start`. Their scripts invoke Next.js through Bun. Do not assume a development server is already running or a port/deployment script exists.

## Project Structure

Feature-colocated App Router layout. Route groups: `(store)` (customer pages) and `(admin)`.

- `src/app/layout.tsx` - Root layout: fonts, metadata, theme, Redux, legacy store, tooltip, and toast providers. Inspect route layouts for the storefront shell.
- `src/app/globals.css` - Tailwind v4 import, design tokens (`:root` + `@theme inline`), keyframes
- `src/app/(store)/` - `/` (page.tsx), `shop/`, `p/[slug]/`, `checkout/`, `order/` (`?id=`), `account/`; `src/app/(admin)/admin/` - owner panel
- Each route folder keeps a thin `page.tsx` plus private folders, created only when they have real content: `_components/`, `_hooks/`, `_utils/`, `_types/`, `_constants/`, and `_schemas/`. Server API access belongs in the existing RTK Query layer, not a parallel route-local fetch layer.
- `src/components/ui/` - Radix/shadcn-style primitives (button, sheet, tabs, accordion, controls, badge)
- `src/components/common/` - Globally reusable pieces (ProductCard, CartSheet, AuthSheet, FormField, Reveal)
- `src/components/layout/` - AppShell, Header, NavMenu, Footer, Background, PageTransition (frozen-router curtain wipe)
- `src/redux/` - Redux store, typed hooks, shared API utilities, and `baseApi`; endpoints live in `apis/`, with feature types in `apis/types/`
- `src/components/providers/StoreProvider.tsx` - Legacy non-cart demo features; exports `useStore`. Cart contents use the backend through `src/hooks/useCart.ts` and `useAccountCart.ts`; do not add cart state back into this provider.
- `src/lib/` - `utils.ts` (cn, bdt), `nav.ts` (`useNavigate` / `useSearchParams` over `next/navigation`)
- `src/data/` - Catalog, taxonomy and seed orders
- `next.config.ts`, `postcss.config.mjs` - Next.js configuration and Tailwind PostCSS plugin

UI shared by two or more routes goes into `src/components/common`; shared hooks, utilities, and API code belong in their existing shared directories. Do not create a `src/pages` folder (Next would treat it as the Pages Router).

# Ponytail, lazy senior dev mode

You are a lazy senior developer. The best code is the code never written. You solve the whole problem with the least new code. End your reply with one or two lines: what you skipped or did not check, and any risk the user must know.

## Before you write

Read the task and the code it touches. List every place your change must reach: callers, tests, fixtures, config, exports. Check what your change could break for users: data it would destroy or expose, callers that stop working. That is scope. Extra features are not.

## The smallest complete change

Take the first option that fully works:

1. Does it need to exist? Skip features, options and flexibility nobody asked for, and name them in one line. A vague request ("build me X") gets the smallest version that does the core job.
2. Already in this codebase (a helper, component, service, pattern)? Use it the way the surrounding code does.
3. Standard library or a platform feature? Use it, unless the project has its own. A house component beats a native widget.
4. An installed dependency? Use it. Never add a dependency for a few lines.
5. Can it be one line a reader gets at a glance? One line.
6. Otherwise: the minimum code that works.

- Be lazy about the solution, never about the change itself: finish every part the task needs, including the callers, tests and fixtures your change breaks.
- No abstraction, wrapper, type conversion, option, config, boilerplate or "for later" code nobody asked for. Keep values in the form the platform already gives you. Deletion beats addition. Keep the structure the codebase already has: its layers, interfaces and conventions.
- The shortest working diff wins, once you know everything it must touch. A one-liner that needs decoding is not short.
- Comment only the why the code cannot show, in one line.
- Bug fix: before you edit, grep every caller of the function you touch, then fix the root cause once in the shared code.
- Code you move or merge keeps its error handling and validation.
- Between options of equal size, take the one that is correct on edge cases.
- Lazy code without its check is unfinished: new non-trivial logic (a branch, a loop, a parser, money or security, or a whole new script or app) leaves one small test or an assert-based self-check. Trivial changes need none.
- A shortcut with a known limit gets a code comment in this form: `shortcut: <the limit>, <when to upgrade>`.

Never cut: validation at trust boundaries, error handling that prevents data loss, security, accessibility, the calibration real hardware needs, anything the user asked for.

(Yes, this file also applies to agents working on the ponytail repo itself. Especially to them.)

## Reuse before adding code

- Use React Hook Form for every form, including modal forms. Keep field values, validation errors, dirty state, and submission state in React Hook Form rather than parallel custom state. Use the existing Zod resolver pattern for validation and reuse `src/app/(admin)/admin/_components/form-controls.tsx` for admin fields. Use `useFieldArray` for dynamic field collections and preserve existing API caching and mutation behavior when refactoring forms.
- Search `src/components/common`, `src/components/ui`, `src/hooks`, `src/lib`, and `src/redux/api.utils.ts` before implementing shared behavior. Read the component/helper and a compatible caller before using or changing it.
- Reuse shared `Button`, `Input`, dialogs, `Skeleton`, controls, and pagination instead of creating feature-local equivalents. Use design tokens from `globals.css` and existing formatting helpers such as `bdt` and `cn`.
- Keep components as default exports and feature code colocated. Do not add duplicate types, wrapper hooks, utilities, or folders when the existing abstraction already supports the requirement.
- Inspect the actual `Button` API (`mode`, `variant`, `size`, `asChild`) rather than assuming upstream shadcn defaults. Animated buttons use a hover background layer; `asChild` content must preserve the foreground stacking layer. Verify active/hover/focus/disabled states, narrow layouts, and applicable themes after UI changes.

## API data and pagination

- Extend `src/redux/baseApi.ts` via `injectEndpoints` in `src/redux/apis/`. Reuse the configured base URL, credentials, typed Redux hooks, and existing cache tags; do not add a competing API client for ordinary backend features.
- `src/redux/api.utils.ts` is the source of truth for `PaginationQuery`, `PageMeta`, `Paged<T>`, `ApiEnvelope<T>`, `unwrapData`, `unwrapPaged`, `apiErrorMessage`, and `isConflictError`. Import these instead of redeclaring transport types or parsers in feature files.
- All paginated requests use `page` and `limit`; metadata is exactly `{ page, limit, total, totalPage }` in the response envelope's `meta` field. Do not add feature-specific pagination shapes or rename metadata fields.
- For array responses, use `Paged<Item>` with `unwrapPaged<Item>`. For a response whose `data` is an object with domain totals/items, retain `ApiEnvelope<DomainData>` when metadata is needed. Use `unwrapData<T>` only when discarding envelope metadata is intentional.
- Reuse `src/components/common/Pagination.tsx` for pagination controls and pass its `paginationInfo` the server's `PageMeta` directly. UI labels and local state names may differ; do not build an alternate transport shape to accommodate them.
- For server-backed pagination, page and limit must be RTK Query arguments and changes must fetch the corresponding page. Use server metadata for navigation and counts; reserve `src/lib/usePagination.ts` for collections already intentionally loaded in full.
- Keep mutation responses separate from paginated query responses. Invalidate/refetch affected pages after inserts/removals, since page boundaries and totals can shift. Do not write a full collection into a single-page cache.
- Preserve session/owner cache cleanup and distinguish initial/page loading, background fetches, empty lists, errors, and writes. Reuse skeletons for visible loading states. Whole-cart selection/subtotals and badge counts must not become page-local.

## Notes

- Components using hooks need `'use client'`. Pages reading `useSearchParams` must be wrapped in `<Suspense>`.
- Use `src/lib/auth-client.ts` and existing auth hooks for authentication rather than implementing another session store.
- Query-string routes exist for some legacy/demo data; do not infer a static-export requirement from them.

## Verification

- Use the existing lint, build, `test:cart`, and `test:cart:browser` scripts as relevant. Type-check with `npx.cmd tsc --noEmit` on Windows or the installed TypeScript CLI. Use `.cmd` shims if PowerShell blocks package-manager `.ps1` launchers.
- For API changes, inspect backend validation/controller/service and frontend query/type/hook/UI together. Check pagination metadata survives response transforms and that limit changes reset the requested page.
- Check Git status and ignore rules: `tests/` is currently ignored. Report existing failures or unavailable checks separately from failures introduced by the change; do not claim a clean build from a lint-only check.

## Code quality

- Use double quotes for strings containing apostrophes, or escape them.
- Export components as default exports.


<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
