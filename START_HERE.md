# CIRGENIA — Your website and source code

This package contains the complete website source, the product concept illustration, French and English brochures, the demo dashboard, and the owner studio. It also includes a public contact form, a private messages inbox and page-view counts. The native mobile application and real sensor integrations are not included in this website version. Read ANTIGRAVITY_GUIDE.md to work on the source in your IDE.

## View the design immediately

Double-click **PREVIEW.html** inside the extracted folder. This is an offline visual preview in French; it opens without installing software. The demo controls are intentionally disabled in this preview. Follow the instructions below to launch the full working website.

**The website is public:** https://cirgenia.cirgjia.chatgpt.site. Your private owner studio is at https://cirgenia.cirgjia.chatgpt.site/studio. See LIVE_LINKS.md for the policy and QR links. The source, production build, contact inbox and owner-access checks passed. The local copy is separate from the online website. Browser visual verification was unavailable in the development environment.

## First start on your MacBook 2019

1. Extract the ZIP and move the **CIRGENIA_Website** folder to a location you want to keep, such as Documents.
2. Install **Node.js 22.13 or newer** from the official [Node.js download page](https://nodejs.org/en/download/). For your Intel MacBook, select the macOS x64 installer. Use a macOS version supported by Node.js and Cloudflare's development tools. These tools may require a macOS update if your system is old.
3. Open Terminal. Type `cd ` (with a space), drag the extracted CIRGENIA_Website folder into the Terminal window, then press Return.
4. Run:

   ```sh
   node scripts/macbook.mjs
   ```

The first run downloads the dependencies with the project's pinned pnpm version, builds the website and prepares a local database. Keep your internet connection available for this first setup. It can take several minutes. It does not publish your local files.

5. Open **http://localhost:5173** in your browser. Keep Terminal open while using the local site. Stop it with **Control+C**. Run the same command to start it again. The included `START-CIRGENIA.command` is an optional launcher; the Terminal command is the direct route.

The source has been type-checked and built in the development environment. It has not been run on your physical MacBook, and browser visual testing was unavailable during this delivery. Tell me the exact error message if a Mac-specific dependency or system version needs adjustment.

## Edit without changing code

- **Online site:** open the owner link in the site's footer. Sign in with the ChatGPT account that owns the site. Other signed-in visitors cannot use the editing API.
- **Local site:** open **http://localhost:5173/studio**. The local development sign-in is a simulation confined to localhost. It does not require a real account or password. Do not expose the development server to the internet.
- **Messages et activité:** read contact form messages, mark read/archive/delete, open your email app to reply, and view indicative page counts. No automatic email notifications are enabled.
- **Contenus:** edit the text separately in French, English and Arabic.
- **Paramètres:** change your email, Instagram username, founder name, location, accent colour, default language, and whether the demo appears.
- Press **Enregistrer** to save, then refresh the website to see your changes.
- Use **Exporter une sauvegarde** to download all website text and settings in JSON format. Import prepares a draft; it does not replace saved content until you press Enregistrer.

## What is stored on your laptop?

The extracted folder is your local source. Local studio edits are stored in `.wrangler/state` inside that folder. Keep the whole project folder when moving it. Export a content backup before reinstalling, moving between computers, or deleting development folders.

The online website has a separate hosted database and remains available when your laptop is off. Editing one does not automatically edit the other. You can export a JSON backup from one studio and import it into the other. A source ZIP does not include live database edits, authentication cookies, or private credentials.

## Full source access

| What you want to change | File or folder |
| --- | --- |
| Page composition and sections | `components/website.tsx` |
| Colours, spacing, mobile layout | `app/site.css`, `app/globals.css` |
| Initial text in all languages | `lib/content.ts` |
| Dashboard interactions and example data | `components/dashboard.tsx` |
| Owner editor | `components/studio.tsx` |
| Product concept image | `public/images/cirgenia-concept.png` |
| Brochures | `public/documents/` |
| Tab icon | `public/favicon.svg` |
| Metadata for search engines | `app/layout.tsx` |
| Content storage and owner checks | `lib/server-content.ts`, `app/api/` |
| Database schema and migrations | `db/schema.ts`, `drizzle/` |

Images can be replaced using the same filename, or by changing the referenced path in the source. Brochures are separate PDF files; editing website text does not rewrite them. Saved database content overrides the initial text in `lib/content.ts`; use the studio to edit an already saved site.

The code is editable, and you can give a copy to a developer. Third-party dependencies retain their own licences. Do not publish your owner-only download package as a customer feature unless you intend to distribute the source.

## Publish changes made on your MacBook

Local edits are not automatically uploaded. For this first hosted version, send the changed source or a content backup in our conversation and ask to update the same CIRGENIA site. Website content changes made directly in the online studio are saved immediately without rebuilding.

The project is designed for a Cloudflare Worker-compatible host with a D1 database. It is not a single HTML file you can open by double-clicking. Moving to another host requires adapting deployment and authentication, and migrating data. The included `.openai/hosting.json` identifies the existing CIRGENIA site; it is not a credential.

## Demonstration and current stage

The dashboard uses clearly labelled sample data. You can switch resources and periods, simulate an anomaly, mark it as seen, and export CSV data. No real sensors, utility accounts, payments, emergency calls, or automatic equipment controls are connected. The contact form saves messages to the private owner inbox. Email links open your mail application; they do not silently send a message.

The next application phase can reuse the visual language, copy, and dashboard components. Real sensor integration needs its own device protocol, data ingestion, permissions, validation and testing.

## Technical commands

```sh
node scripts/macbook.mjs --setup --setup-only  # rebuild and apply local migrations
npx pnpm@11.25.0 exec tsc --noEmit            # TypeScript check
npx pnpm@11.25.0 run db:generate             # after a database schema change
```

Do not edit an already deployed database migration. Add a new migration for later schema changes.

## References

- [Node.js official downloads](https://nodejs.org/en/download/)
- [Node.js 22 releases and macOS installers](https://nodejs.org/en/download/archive/v22)
- [Cloudflare local development](https://developers.cloudflare.com/workers/development-testing/)
- [Cloudflare D1 local development](https://developers.cloudflare.com/d1/best-practices/local-development/)
- CIRGENIA content and illustration: your project brief and **CIRGENIA_Prospectus_FR.pdf** / **CIRGENIA_Prospectus_EN.pdf**, revised September 29, 2026.
