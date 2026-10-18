# A team challenge for around 120 people

The shipped setup is intended for **20–30 independent teams of 4–6 colleagues**. Each team plays the same 10–15-minute Prompt Lab mission with its own code, state and timer. Two-person play remains supported. The 120-person figure is a planning default; there is no registration count, capacity reservation, automatic grouping, or shared 120-avatar world.

## Locations and languages

Available offices are **Stuttgart, Berlin, München, Frankfurt, Köln, Düsseldorf, Hamburg, Hannover and Bukarest**. Berlin appears once. Remote and Other location support mixed/remote groups. Every browser can independently use English or German. English labels include Munich, Cologne, Hanover and Bucharest; the API stores the canonical German values. For a mixed-office team, agree on one location or choose Remote.

## Organise the session

1. Assign teams of 4–6 and agree on a common start time in your event invitation. The app has no host-controlled countdown or mass-start button.
2. Allow about five minutes for briefing and joining. One person per team creates a made-up team name, chooses its location, and shares the code only with that team.
3. Use one terminal operator and at least one handbook reader. Other colleagues discuss clues, check sources and suggest the next action. They can use their own browsers or share the two role devices; do not project both answers/views to the whole team. Rotate the operator between puzzles.
4. Start each team's timer with **Enter the lab** at the agreed time. Allow 10–15 minutes for the mission, plus a buffer. Hints add 60 seconds and mistakes 15 seconds to scored time; there is no hard timeout.
5. Invite teams to publish their result voluntarily. Open the leaderboard and select **All locations** or an office. It shows up to 100 results per selection, ranked by team score. It does not calculate office totals or adjust for team size.
6. Finish with five minutes to discuss good prompts, source checks and human approvals. Scores are a friendly comparison, not a verified competition.

Two role devices per team mean roughly 40–60 active clients; one device per person means up to 120. One team's code must not be used by the entire event. Opening an invitation link replaces that browser tab's current team, so distribute links within teams.

## Networking and load assumptions

Visible browsers poll every 5–6 seconds; actions and joining also make requests. Polling stops while a page is hidden and resumes when visible. Per-browser offsets spread polling bursts. At 120 visible clients, the 5-second upper-bound estimate is **1,440 state requests/minute**, or **21,600 over 15 minutes**, plus assets, joins and actions. This is a request model, not measured Cloudflare throughput or a guarantee about available plan quotas. Other traffic on the account and an extended event also consume resources.

`wrangler.jsonc` sets a coarse API budget of 3,600 requests/minute and a creation budget of 60 teams/minute for one shared office IP in one Cloudflare location. They leave headroom for 30 teams launching together. Cloudflare's limiter is approximate and scoped per location. The local regression test simulates the configured budgets; it does not measure the production limiter, D1 contention, regional latency or Wi-Fi performance.

Before the Christmas event, rehearse on the actual office networks with representative devices and several teams. Check create/join, mixed languages, role separation, a full solve, publication and location filters; watch request errors/429s and D1/Workers usage in Cloudflare. Expand to the expected client count during an agreed rehearsal window. If necessary, use two devices per team or stagger starts. The 2D view provides the same puzzles on devices that struggle with WebGL.

## Shared results and privacy

The leaderboard is public and rolling across sessions created within 30 days. It has no private event partition or reset button; older playtests can appear if explicitly published. Use a short event prefix in team names if useful and keep rehearsal teams unpublished. Location filtering happens before the result limit. Team name, location and score are shown only after publication; session access itself expires after 24 hours. See [operations](operations.md) for retention and narrowly scoped removal.

## Change the setup

`public/event-config.js` is the shared source for participant/team planning defaults, office labels, canonical location values, leaderboard size and polling base interval. Both Worker and browser import it. It is public: never put credentials there. Add a location once, supplying DE/EN labels, and preserve existing values so historical results still match. `public/i18n.js` contains event instructions; `public/app.js` builds selectors from the same list.

Application rate limits live in `wrangler.jsonc`, separately from the event copy. When changing polling/participant assumptions, recalculate the request budget, update docs and run the integration suite. Rebuild, test and deploy using [operations](operations.md). No database migration is required for adding locations; the existing field stores text. Event IDs, reservations, shared avatars and additional missions are future work.
