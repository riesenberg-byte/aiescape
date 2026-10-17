# Testing and playtesting

## Automated checks

From the repository root:

```sh
npm ci
npm run build
npm test
```

`npm test` runs `tests/game.test.mjs` with Node's built-in test runner and SQLite. The eight current tests cover:

1. A full team flow, shared completion and explicit leaderboard opt-in.
2. Roles, validation, foreign origins and session expiry.
3. Bounded hints and concurrent submissions using the same revision.
4. Public assets, security headers and role projections.
5. Rate-limit rejection before database access.
6. English/German teammates sharing progress and translated NOVA messages.
7. Language selection, dictionary entries and stable option IDs.
8. Walking boundaries, furniture, sliding and locked/unlocked exits.

The SQLite adapter exercises production SQL and the Worker handler, but does not reproduce the complete Cloudflare runtime or a browser renderer. Passing tests does not prove touch input, WebGL, caches or visual layout are correct.

For Worker/config changes, after building assets also run:

```sh
npx wrangler deploy --dry-run --outdir dist
```

This compiles without publishing. For platform-specific behavior, use Wrangler local development from [getting started](getting-started.md).

## Checks by change

| Change | Relevant evidence |
| --- | --- |
| Documentation | Relative links resolve; examples/imports work; commands match `package.json` |
| Mission content / validator | Build and tests; correct/wrong/malformed answers; fresh two-role playtest |
| Translation | DE/EN equivalence, mixed-language team, mid-stage switch and long-text layout |
| Shared state / API | Concurrency, stale revisions, roles, lifecycle, expiry and retry behavior |
| 3D object / movement | Collision tests; walk around it, reach stations, test reset and touch |
| UI / controls | Desktop and small screen, keyboard and touch, WebGL fallback |
| Storage / deployment | Migration compatibility, dry-run, maintainer release checks |

## Manual browser scenarios

The following are a repeatable checklist. An automated browser runner is not currently committed to this repository.

1. Start the [local QA server](getting-started.md). Open two independent browser profiles/private windows.
2. Create an English terminal team; join its code from a German handbook. Confirm different information appears in each role.
3. Start the mission, make one incorrect attempt, and request a hint. Verify the stage does not advance incorrectly and the hint penalty appears in the final score.
4. Partly fill a form, switch DE/EN, and verify values, role, timer and stage are retained. Repeat on the ordering puzzle.
5. Complete all stages. Confirm both clients receive completion and NOVA's message in their own language.
6. Verify the team is absent from the leaderboard until publication is explicitly selected. Use invented names only.
7. Reload during play and after completion; the same browser should restore its session while the token is retained.
8. Temporarily interrupt the connection. State should recover when it returns. After an uncertain action, refresh state instead of assuming it failed.

For 3D, also check:

- Enter the demo and mission scenes; click **Explore**, walk with WASD/arrows, drag to look, turn with Q/E, pause with Esc, and reset to the entrance.
- Walk diagonally against walls, desks, chairs and NOVA. No tunnelling or trapped spawn.
- Approach each station and use F/the interaction button. A handbook must not gain answer privileges by walking to the terminal.
- Finish the mission and walk through the opened exit. The door remains locked before server completion.
- Switch language/view and request a hint without losing camera position or creating duplicate controls.
- Use actual touch events on a phone/emulated touch device: hold movement, release it, drag to look, tap a station, and check page scrolling remains usable outside the scene.
- Disable WebGL or test an unsupported device, select the 2D view, and solve the same tasks.
- Check developer tools for uncaught errors and obvious rendering regressions. Do not record tokens in reports.

## A useful playtest report

Use the **Feature proposal** or **Bug report** form and record:

- Commit/version, language per role, browser/device, player count, and whether players knew the puzzle already.
- Time to first meaningful discussion, stages that caused confusion, hints used, and whether one player dominated.
- What players actually did, expected behavior, and a small proposed improvement.
- A screenshot/short recording when relevant, without credentials, client data or active team codes.

For documentation-only changes, game deployment is unnecessary: documentation lives in GitHub and is not included by the asset builder.
