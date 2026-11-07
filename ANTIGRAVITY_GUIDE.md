# CIRGENIA in Antigravity on your Mac

You can edit both the company website and the interactive web application demo in this project. Antigravity is the editor on your Mac. Your public website is https://cirgenia.cirgjia.chatgpt.site and runs independently of your Mac. Your private owner area is https://cirgenia.cirgjia.chatgpt.site/studio. See LIVE_LINKS.md for all links.

## 1. Open the project, not just the preview file

1. Download and extract the ZIP from our conversation.
2. Move the extracted CIRGENIA_Website folder to Documents or another permanent folder.
3. In Antigravity, open that whole folder as your project. If your IDE offers Open Workspace from File, you can also select CIRGENIA.code-workspace.
4. Open START_HERE.md for the local setup guide. AGENTS.md supplies project instructions to the coding assistant.

## 2. Start the working version

Install Node.js 22.13 or newer if it is missing. Open a terminal in the project folder and run:

```sh
node scripts/macbook.mjs
```

The first launch installs the pinned dependencies, builds and prepares the local database. After the server says it is ready, open http://localhost:5173. The local owner studio is http://localhost:5173/studio. Leave the terminal running; Control+C stops it.

PREVIEW.html is only a visual preview. Opening it directly cannot run a database, receive messages or operate the editor.

## 3. Ask Antigravity for a change

Example prompt:

> Read AGENTS.md and START_HERE.md. Change the CIRGENIA homepage introduction in French, English and Arabic to the following text: [your text]. Keep the public contact form, private owner checks and demo labels. Show me the changed files and run the TypeScript check. Preview locally before publication.

Another example:

> Read the project instructions. Adjust the contact section so it is easier to use on a small phone. Preserve all three languages and show the local result.

You can also edit files yourself. components/website.tsx is the website; components/dashboard.tsx is the demonstration application; app/site.css controls their appearance.

## 4. Understand what visitors and you see

| Place | What it does |
| --- | --- |
| Public website | Company presentation, FR/EN/AR, brochures, contact form |
| /demo | Interactive sample electricity/water/gas dashboard, usable on a phone or computer |
| /studio | Your private inbox, page-view counts, text/settings editor |
| Antigravity | Local source editing and local testing on your Mac |

Visitors do not need the source folder or Antigravity. A QR code opens the public website directly in their browser. You sign in to /studio with the ChatGPT account that owns this site. Other visitors cannot read your messages.

## 5. Read messages and activity

In the ONLINE /studio, open Messages et activité. Press Actualiser to load new messages and current counts. You can mark a message read, archive it, restore it from the archive, or permanently delete it after confirmation. Répondre par e-mail opens your email application with the visitor as the recipient; compose and send the reply there.

There are no automatic email notifications. Check the inbox manually. Email notification delivery needs a separately connected email service; it is not supplied by Antigravity.

The activity cards show page views and openings of the prospectus link over the last 30 UTC calendar days. These are indicative counts: refreshes, bots, your own visits and shared QR links may count. They are not unique visitors or identities. Names and emails appear only when someone sends the contact form. No advertising trackers are included.

## 6. Put edits online

Text/settings edits in the ONLINE studio take effect after saving and refreshing the website. They do not require Antigravity.

Source edits in Antigravity affect only your local copy until you publish a new version. For this Sites-hosted project, send the changed source here and ask to update the existing CIRGENIA site. Do not send node_modules, dist, .wrangler, .env files or private messages. The Mac does not automatically receive this chat's deployment credentials.

Online content and messages live in a separate hosted database. Local test messages stay on your Mac. A content JSON export transfers website text/settings only, not messages or activity counts.

## Application scope

The included /demo is a responsive web application demonstration. It uses example data and simulated alerts. It is not an App Store/Google Play release, and it does not yet receive real sensor readings. A native mobile application and device connection can be developed as the next stage; they require their own accounts, device protocol and tests.

## Before printing many prospectuses

Use the QR codes in public/qr or the updated prospectuses in public/documents. They link to the confirmed public website. Print a sample, keeping the white margin around the code and a width of at least about 30 mm, then scan it with a phone on mobile data. Verify that the public page opens and send one real test message; check it in your owner inbox. Keep the destination URL unchanged after printing. A QR code cannot be rewritten on paper.

## Verification included

After a production build, `node scripts/verify-project.cjs` runs isolated checks of public content, owner access, form persistence, the inbox, message statuses, deletion, the page-view counter and abuse limits. It uses a temporary test database and does not contact or change the live website. These checks passed in the development environment. The project has not been tested on your physical Mac, and browser visual verification was unavailable.

## Official reference

Antigravity discovers AGENTS.md project rules: https://antigravity.google/docs/rules

## Privacy Policy and inbox care

The /privacy page is available in French, English and Arabic. Its copy is in lib/privacy.ts. Update it when actual data practices change; do not promise certifications or Algerian-only hosting. The contact form records the policy version and requires agreement before submission. In the inbox, review old messages regularly and use Supprimer when they are no longer needed. Archiver is organization, not deletion. Handle access/correction/deletion requests sent to the public contact address. The content backup excludes visitor messages.
