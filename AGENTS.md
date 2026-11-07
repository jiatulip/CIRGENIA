# CIRGENIA project instructions

Read START_HERE.md and ANTIGRAVITY_GUIDE.md before changing this project.

## Product
CIRGENIA is developing retrofit resource-monitoring sensors for electricity, water and gas. The site is a public company presentation, with a web application demo at /demo and an owner studio at /studio. All dashboard data is simulated. Do not represent the product as commercially deployed or connected to real sensors. Keep the French, English and Arabic experiences, including RTL.

## Architecture
React / TypeScript with Vinext, Cloudflare Workers, D1 and Drizzle migrations. Keep the lockfile and existing framework. components/website.tsx is the public page; dashboard.tsx is the demo; studio.tsx and inbox.tsx are the owner tools. lib/content.ts holds initial copy; saved D1 content overrides it. Contact form copy is in components/contact-form.tsx.

The public site is authorized for public access. Private messages and administration must remain owner-only. Keep server-side authorization on every inbox/studio read and mutation. Do not replace the authenticated owner check with a public password or client-side gate. Local mock authentication is confined to localhost; never expose the dev server.

## Work on a Mac
Use Node >=22.13 and the pinned pnpm version. Start with `node scripts/macbook.mjs`. Run `node scripts/macbook.mjs --setup --setup-only` after changing the database schema or when a rebuild is needed. Use `npx pnpm@11.25.0 exec tsc --noEmit` to check TypeScript. Generate new migrations with `npx pnpm@11.25.0 run db:generate`; never rewrite previously deployed migrations.

## Data and publication
Local source edits do not deploy automatically. Local and hosted databases are separate. Never overwrite live messages, content or site-owner records with local test data. A content JSON backup does not contain the inbox. Do not place credentials or live customer data in source, the download package or public assets.

Preserve the existing project ID in .openai/hosting.json. Use the authorized Sites workflow when publishing here. Antigravity on the Mac does not automatically have this conversation's Sites credentials; the owner can return changed source here for publication. Do not claim to have published unless deployment succeeded. Do not invent a public URL or QR destination.

## Validation
Check meaningful changed behavior and the production build. Contact submissions must persist; invalid submissions and unauthorized inbox requests must fail. Preserve all demo labels, accessibility labels, RTL and mobile layout. Keep statistics labelled as page views, not unique people. Reply buttons open email; do not claim automatic email notifications unless an email service is actually configured and tested.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
