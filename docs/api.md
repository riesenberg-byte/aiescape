# API reference

The current API serves the single Prompt Lab mission. This is an implementation reference, not a proposed campaign API. Browser requests are same-origin.

## Request conventions

- Send `Content-Type: application/json` on POST; bodies are limited to 8 KiB.
- Send `X-Game-Language: en` or `de`. It affects response text, not session progress or answer IDs. Without it, API text defaults to German.
- Protected endpoints require `Authorization: Bearer <player-token>`.
- The browser receives a token only when creating or joining a team. Treat it as a credential and keep it out of issues and logs.
- Errors use `{ "error": "localized explanation" }` and an appropriate HTTP status. There is no stable machine-readable error-code field yet.
- Only GET and POST are supported by the API router. Cross-origin browser requests are rejected.

| Endpoint | Method | Auth | Result |
| --- | --- | --- | --- |
| `/api/health` | GET | No | D1 health check and room ID |
| `/api/leaderboard` | GET | No | Up to 20 voluntarily published results ordered by score |
| `/api/sessions` | POST | No | Create a lobby and terminal player; 201 with `{ token, state }` |
| `/api/join` | POST | No | Join by code; 201 with `{ token, state }` |
| `/api/state` | GET | Player | Current role-specific state |
| `/api/action` | POST | Player | Apply an action and return current state |

### Create / join

```json
{ "team": "Prompt Pirates", "location": "Remote" }
```

Team names are trimmed, stripped of control characters and angle brackets, and capped at 40 characters; at least two characters must remain. Accepted stored locations are `Berlin`, `München`, `Frankfurt`, `Remote`, and `Anderer Standort`; unsupported values use `Remote`. These are canonical data values; the UI translates their labels.

```json
{ "code": "ABCDEFGH", "role": "manual" }
```

The code above is illustrative, not a working team. Codes are eight characters; joining accepts lowercase and removes spaces/hyphens. `terminal` explicitly chooses that role; other input currently defaults to `manual`. Role updates after joining reject unknown roles.

### State response

State includes `code`, `team`, `location`, `role`, `stage`, `revision`, `startedAt`, `finishedAt`, `hints`, `mistakes`, `message`, `locale`, `listed`, `serverTime`, `score`, `players`, `room`, and `puzzle`.

`room` contains `{ id, title, total }`. `players` contains `{ role, count }` rows counting joined devices, including inactive ones — it is not online presence. `score` is null until completion. `puzzle` is null after completion; otherwise it is the current role projection. A handbook response contains `manual`; a terminal response contains `task`, `kind`, and the corresponding `slots` or `choices`. The lobby currently also returns a projection, although the UI displays briefing content until the timer starts.

## Actions

| `type` | Other fields | Who / conditions |
| --- | --- | --- |
| `start` | `revision` | Terminal, not already started/completed |
| `answer` | `revision`, `answer` | Terminal, started; validator decides progress |
| `hint` | `revision` | Terminal, started; bounded by the current stage's hint count |
| `role` | `role: "terminal"` or `"manual"` | Any player; changes that player's role |
| `publish` | None | Any player after completion; opts the team into the public leaderboard |

Always use the latest revision for `start`, `answer`, and `hint`. A role switch or publication has separate semantics and should not be used to infer gameplay progress.

Answer shapes:

```js
// slots: keys match slot IDs; values match option IDs
{ type: 'answer', revision: 1, answer: { audience: 'team', when: 'a', where: 'atrium', format: 'short' } }
// choice: one choice ID
{ type: 'answer', revision: 2, answer: 'B' }
// order: an ordered array of choice IDs
{ type: 'answer', revision: 3, answer: ['data', 'draft', 'review', 'send'] }
```

These are reference shapes, including current solutions. The revision numbers are illustrative, not a sequence to replay blindly. Runtime clients receive choices and clues, never the validator function. Server source is available to contributors, so the game is not intended to hide answers from repository readers.

## Failures and recovery

| Status | Typical cause | Client response |
| --- | --- | --- |
| 400 | Invalid team, code, action or role | Correct the input |
| 401 | Missing/unknown player token | Join/create a team |
| 403 | Wrong browser origin or handbook trying to control MILO | Check origin or use the terminal role |
| 404 | Unknown endpoint or missing/expired code when joining | Check route/code |
| 405 | Unsupported method | Use the documented method |
| 409 | Stale revision, wrong lifecycle state, or no more hints | Refresh state before another intentional action |
| 410 | Existing player's session is more than 24 hours old | Start a new session |
| 413 / 415 | Oversized body / unsupported content type | Use bounded JSON |
| 429 | Rate limit | Wait briefly and avoid aggressive retries |
| 500 | Unexpected server/platform error | Show a recoverable message; inspect maintainer logs |

After a timeout, first fetch state: the mutation may already have succeeded. Replaying an old revision must not advance a second stage. Do not add automatic publication or answer submission while retrying a state read.
