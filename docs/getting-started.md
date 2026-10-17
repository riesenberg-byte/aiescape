# Getting started

## Requirements

- Git and access to the private GitHub repository.
- Node.js **24 or newer**, including `node:sqlite`, and npm.
- A recent browser. WebGL is needed for 3D; the puzzles also work in 2D.

Use `node --version` to check your runtime. Run commands from the repository root. Install with `npm ci` to use the committed lockfile. No AI-provider API key is needed.

## Fast local QA server

```sh
git clone https://github.com/riesenberg-byte/aiescape.git
cd aiescape
npm ci
npm run build
npm test
node scripts/dev-server.mjs
```

Open **http://127.0.0.1:8787/?lang=en** or **http://127.0.0.1:8787/?lang=de**. Use that exact host for this server: its request adapter constructs URLs with `127.0.0.1`, so using `localhost` can fail the same-origin check on form submissions.

This server uses in-memory SQLite with the actual migration and Worker handler. It does not simulate every Workers API, enforce Cloudflare rate-limit bindings, persist sessions, or provide hot reload. Restarting erases its teams. It listens on `0.0.0.0:8787`; it is a development tool, not a production server. LAN play from another device is not currently supported by this adapter's fixed origin.

After changing source files:

1. Stop the server with Ctrl+C.
2. Run `npm run build`.
3. Restart `node scripts/dev-server.mjs`.
4. Reload the browser. The server imports the generated asset module at startup.

Use two browser profiles or a private window for separate roles. Creating a second team is different from joining the first team's code.

## Cloudflare's local runtime

Use Wrangler when changing platform behavior or checking the D1 binding in its actual runtime:

```sh
npm ci
npm run db:local
npm run dev
```

`npm run dev` rebuilds and starts Wrangler. Use its printed local URL; local D1 state is stored under `.wrangler/`. Do not add `--remote` or enable remote bindings for routine development. Rebuild after changes to `public/` or `client/`; the existing scripts do not watch and regenerate embedded assets automatically.

## Commands

| Command | What it does |
| --- | --- |
| `npm ci` | Install exact locked dependencies |
| `npm run build` | Bundle three.js and embed browser assets into `src/generated/assets.js` |
| `npm test` | Run the eight current backend, language, and collision tests |
| `node scripts/dev-server.mjs` | Serve the built game with in-memory SQLite |
| `npm run db:local` | Apply migrations to local Wrangler D1 |
| `npm run dev` | Rebuild and run Wrangler locally |
| `npm run types` | Generate ignored `worker-configuration.d.ts` from Wrangler configuration |
| `npx wrangler deploy --dry-run --outdir dist` | Compile/inspect the Worker without publishing, after building assets |
| `npm run db:remote` / `npm run deploy` | Modify production resources; maintainer release commands, described in [operations](operations.md) |

## Troubleshooting

| Symptom | Check |
| --- | --- |
| `node:sqlite` cannot be imported | Switch to Node.js 24+ |
| `src/generated/assets.js` is missing | Run `npm ci` and `npm run build` |
| Edits do not appear | Rebuild, restart the QA server, then reload; static assets can be cached for five minutes |
| Browser still shows an old shell | Use a hard reload or clear site storage/service-worker cache in developer tools; clearing storage loses that browser's saved team token |
| Form submission returns 403 locally | Use `127.0.0.1`, not `localhost`, with the QA server |
| Port 8787 is occupied | Stop the previous QA/Wrangler server before starting another |
| 3D is unavailable | Select **2D VIEW**, enable WebGL if available, or try a supported browser |
| Team disappeared after restart | Expected for in-memory QA; create a new local team |
| Team code no longer works in production | Sessions expire after 24 hours from creation |

Next: [Contributing](../CONTRIBUTING.md), [testing](testing.md), or the [architecture](architecture.md).
