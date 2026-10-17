# Roadmap: from one lab to a cooperative world

This is a **proposed sequence**, not a delivery commitment or an implemented API. Agree priorities and ownership in GitHub issues. The goal is a connected, welcoming landscape with several interesting missions and visible shared objectives.

## Milestones

| Milestone | Outcome | Depends on |
| --- | --- | --- |
| M0 — playable slice | Prompt Lab, DE/EN, two roles, voxel walking, shared progress | Shipped in 0.2.0 |
| M1 — several selectable missions | Two independent missions use a stable content contract | Existing prototype |
| M2 — connected places | A small hub and two independently editable areas | Agreed world/area contract; can start alongside M1 |
| M3 — shared objectives | Several mission results contribute to one campaign goal | M1; M2 for spatial presentation |
| M4 — team presence | Optional player presence and shared avatars | A separate networking design and performance test |
| M5 — event-ready experience | A rehearsed office-party session with reliable recovery | M1–M3 and playtesting; M4 is optional |

## M1: mission catalogue and content contract

Tasks:

- Introduce a server registry with allowlisted mission IDs. A new team explicitly selects a mission.
- Route every view, validator, completion count and message translation through that selected mission.
- Pin a content version per session and define what happens when a mission is updated or removed.
- Make stage counts, progress labels, hints and completion UI data driven; remove assumptions about three tasks.
- Separate scores by mission and compatible version.
- Keep DE/EN and role projections equivalent; publish an authoring contract colleagues can follow without touching the engine.
- Add a maintainer-reviewed check workflow and choose repository review rules; neither is currently configured.

**Done when:** two teams can select different missions, finish them in different languages, reload, and see the correct content and ranking. Invalid mission IDs fail safely. Existing Prompt Lab sessions have an explicit compatibility strategy.

Candidate second mission: a small Hallucination Archive challenge with source comparison rather than a repeat of the lab's existing question. The [example](../examples/missions/README.md) demonstrates shapes, not the final creative design.

## M2: a hub and contributor-owned areas

Tasks:

- Extract static object builders and an area specification from the current renderer.
- Define shared coordinates, collision footprints, spawn points, boundaries, station IDs and exits in one place.
- Build a compact hub connected to the lab and one new area; use obvious landmarks and readable signs.
- Keep area modules independent so scenery authors do not all edit the same large function.
- Provide a matching 2D navigation path and accessible station controls.
- Decide the asset pipeline before adopting binary models, textures or large maps; measure on a modest phone.

**Done when:** a contributor can add a documented area module without rewriting movement, players can walk between two areas and return, paths/stations remain reachable, and collisions agree with the rendered geometry. Navigation changes do not complete objectives by themselves.

## M3: objectives and campaign progression

Start with a small dependency graph: complete one mission to restore power, another to obtain approval, then open the celebration hub.

Tasks:

- Define stable objective IDs, prerequisites, completion rules and visible effects.
- Persist a team's campaign progress separately from a single stage cursor.
- Make completion idempotent so concurrent teammates cannot award an objective twice.
- Add a shared mission board with clear current/available/completed goals.
- Design resume, reset, abandoned-session and content-update behavior.
- Reflect shared state in the world, e.g. lighting or doors, while keeping camera movement local.

**Done when:** two clients with different languages agree on completed goals after reload; locked goals cannot be skipped; retries cannot double-award progress; every objective has an equivalent 2D route.

The existing `sessions.stage` integer and unused-for-selection `room` field do not yet implement this model. Agree a migration plan before adding campaign data.

## M4: optional presence and shared avatars

Design this separately from mission progression. Decide whether seeing teammates adds enough fun to justify networking and recovery complexity. Evaluate real-time coordination and message limits before choosing a platform component; avoid writing every camera frame to D1.

**Done when:** joining/leaving and reconnecting behave predictably, movement updates are bounded, stale players disappear, and shared avatars cannot change authoritative puzzle progress. The game remains playable without this feature.

## M5: office-party readiness

- Rehearse with teams that did not author the content, including Romanian/English and German participants.
- Test a shared office network, touch devices, hint recovery and temporary disconnections.
- Agree a host flow: briefing, team setup, pacing, final reveal and optional leaderboard.
- Decide whether facilitator controls, controlled resets or room QR signs are needed; do not add them without a concrete event use case.
- Review accessibility, data visibility, content rights and performance of the actual event build.

**Done when:** a facilitator can run the planned session with documented recovery steps, teams can finish with hints, and the final collaborative payoff is clear.

## Small tasks colleagues can take now

| Task | Scope / files | Review evidence |
| --- | --- | --- |
| Improve one clue in both languages | Active room and English text module | Another team understands it without explanation |
| Add a small decorative prop | Renderer, collision file if solid | Coordinates, desktop/mobile screenshot, reachable paths |
| Draft a new mission | Proposal issue and `examples/missions/` | Objective, two-role clues, solutions and two hints per stage |
| Improve a touch instruction | UI dictionary and possibly styles | Small-screen check in DE/EN |
| Run a fresh-team playtest | Issue report | Confusion, time, hints used, concrete improvement |
| Propose an area contract | Design note before engine changes | Geometry/collision/station example and migration plan |

Choose one small task or one milestone slice per PR. A first collaborative iteration could pair the M1 registry work with a mission writer, while another contributor designs a hub on paper. This lets story, scenery and engine work progress without pretending the missing infrastructure already exists.
