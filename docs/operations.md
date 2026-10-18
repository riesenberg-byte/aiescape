# Operations and releases

## Current hosting

| Resource | Current configuration |
| --- | --- |
| Public domain | `aiescape.myapps.fans` |
| Worker | `aiescape` |
| D1 database / binding | `aiescape` / `DB` |
| Configuration | `wrangler.jsonc` |
| API limiter | `API_LIMITER`, 600 requests per 60 seconds per configured key/location |
| Team-creation limiter | `CREATE_LIMITER`, 10 per 60 seconds per configured key/location |

Account/database IDs and domain settings are in the checked-in configuration; these identifiers are not authentication secrets. `workers_dev` is disabled. The custom domain and HTTPS certificate are managed by Cloudflare. The existing release path has used the connected Cloudflare API; Wrangler offers the reproducible CLI path below.

Source is on `main`. **There is no automatic deployment on push and no committed CI workflow.** GitHub permission and Cloudflare production permission are separate. Most contributors need only repository/local access.

## Maintainer release checklist

1. Review and merge the intended change. Identify the exact source commit and any migration/session compatibility impact.
2. Use an authorised Cloudflare account/CLI session or a scoped CI secret such as `CLOUDFLARE_API_TOKEN`. Never put credentials in source, command arguments, screenshots or ordinary logs.
3. Install, build and verify the selected source:

   ```sh
   npm ci
   npm run build
   npm test
   npx wrangler deploy --dry-run --outdir dist
   ```

4. If there are schema changes, review the migration and recovery plan before applying them. Confirm the target is the production database from `wrangler.jsonc`; retain an appropriate database export/backup before a risky migration. Existing deployments must remain compatible during rollout.

   ```sh
   npm run db:remote
   ```

5. Publish the selected code with the existing configuration:

   ```sh
   npm run deploy
   ```

6. Record source commit, Worker deployment/version ID, migration state and check results in the PR/release notes. Verify the actual domain, not just the build output.

`npm run deploy` rebuilds before upload. Keep source unchanged between review, checks and publishing. Generated `src/generated/assets.js` and `dist/` are artifacts, not files to commit. Existing Cloudflare bindings and the domain must be preserved when deploying through a different tool.

## Post-release verification

- Open [English](https://aiescape.myapps.fans/?lang=en) and [German](https://aiescape.myapps.fans/?lang=de).
- Fetch `/api/health`; it should return `{ "ok": true, "room": "prompt-lab" }` for the current mission.
- Use a clearly named temporary team to verify create/join, one mixed-language flow, reload and completion against real D1.
- Verify `/voxel-room.js` loads, the scene renders and movement/stations work.
- Check an existing browser as well as a fresh profile. Ordinary static assets use five-minute caching; the service worker has its own selected shell cache. Do not assume an already-open tab updates immediately.
- Keep test teams unpublished. If cleanup is needed, remove only the known test session using bound parameters after verifying its code/name; player rows cascade. Never delete broad groups of live teams just to tidy a test.

## Rollback and recovery

Use Cloudflare's deployment history or Wrangler rollback to restore a known Worker version. Confirm the resulting version and re-run the health/flow checks. **Code rollback does not undo a D1 migration or restore deleted rows.** A database recovery needs its own reviewed plan.

For a failure, capture route, status, deployment/version ID and a reproducible description. The handler logs a structured `request_failed` event with path and error name rather than request bodies. Inspect Workers logs and binding/migration state before guessing that the client is broken. If an action timed out, read its session state before retrying; the original write may have succeeded.

## Session data and retention

- Stored data: invented team name, selected location, timestamps, stage, hints, mistakes, canonical MILO text, opt-in flag and hashed player tokens. Positions/avatars are not stored.
- Session access expires **24 hours after creation**, not 24 hours after starting play.
- Creating a new team triggers deletion of unlisted sessions older than 24 hours and all sessions older than 30 days. This is request-triggered cleanup, not a scheduled deletion guarantee.
- The current leaderboard query does not itself filter by age; old published entries may remain visible until that cleanup runs. A periodic cleanup job/age filter is future work if precise retention is required.
- Published results expose team name, location, hints, mistakes and score. Publishing is explicit; there is currently no self-service unpublish API. A maintainer can handle a removal request using a narrowly identified record.
- Joined-player counts include inactive devices and are not live presence.
- Rate limits use the connecting IP as the key, so many colleagues behind one office network share a limit. Test the intended event load before a large session.

Use fictional names and documents. Keep team codes private while a game is active: anyone with the code can join a role. The leaderboard is a friendly prototype, not a tamper-proof ranking service.

## Documentation-only releases

README, `docs/`, GitHub templates and `examples/` are not read by the website asset builder. Publish these through GitHub without redeploying the Worker or changing production data. Keep the project version tied to application changes rather than every documentation edit.
