# AI Escape

A cooperative browser escape game about AI, good questions, and human teamwork. NOVA has optimised the office — with everyone still inside. Help it become a colleague and unlock the exit together.

**[Play in English](https://aiescape.myapps.fans/?lang=en) · [Auf Deutsch spielen](https://aiescape.myapps.fans/?lang=de) · [Deutscher Einstieg](docs/quickstart.de.md)**

## Start here

| I want to… | Read this |
| --- | --- |
| Join the project and make a first contribution | [Contributing](CONTRIBUTING.md) |
| Run the game locally | [Getting started](docs/getting-started.md) |
| Write a mission or a puzzle | [Mission authoring](docs/mission-authoring.md) and the [copyable example](examples/missions/README.md) |
| Build scenery or expand the voxel landscape | [World building](docs/world-building.md) |
| Understand the code and shared game state | [Architecture](docs/architecture.md) and [API reference](docs/api.md) |
| Maintain the forest/sage/lime visual style | [Visual design](docs/visual-design.md) |
| Improve English/German text | [Localization](docs/localization.md) |
| Plan the next missions and objectives | [Game design](docs/game-design.md) and [roadmap](docs/roadmap.md) |
| Test or deploy a change | [Testing](docs/testing.md) and [operations](docs/operations.md) |

The [documentation index](docs/README.md) links every guide. Technical documentation is in English so colleagues across locations can work together. Issues and pull requests may be in English or German; add a short English summary when possible.

## Play

1. Create a team and share its eight-character code or invitation link.
2. Join on a second device as **Handbook**. The **Terminal** sees the tasks; the handbook has the information needed to solve them. Talk rather than sharing screens.
3. Select **Enter the lab** to start the shared timer. Solve three tasks together.
4. Switch roles to try it solo. Each teammate can select **DE / EN** independently.

Recommended: **2–6 people, 10–15 minutes**. Hints add 60 seconds and mistakes add 15 seconds to the scored time. Publishing a result to the leaderboard is optional.

Select **Explore the 3D lab** on the home page, or use the mission's 3D view. **WASD / arrows** move, **dragging** looks around, **Q / E** turn, **F** interacts, and **Esc** pauses. Touch devices have direction and interaction buttons. The **2D view** supports the same puzzles.

## Current state and direction

Version **0.2.1** includes one complete mission, the Prompt Lab: precise instructions, source checking, and a safe approval workflow. It has English/German text, asymmetric cooperative views, a walkable voxel room, shared progress, hints, and an optional leaderboard.

The direction is a connected landscape with several missions, meaningful objectives, and areas colleagues can build together. **Mission selection, campaign progression, a data-driven world editor, and shared 3D avatars are planned work**, not existing features. See the [roadmap](docs/roadmap.md) for dependencies and acceptance criteria.

NOVA's responses are authored text. The current game does not call an AI model.

## Local quick start

Install **Node.js 24+**, npm, and Git. No Cloudflare account is needed for the local QA server.

```sh
git clone https://github.com/riesenberg-byte/aiescape.git
cd aiescape
npm ci
npm run build
npm test
node scripts/dev-server.mjs
```

Open **http://127.0.0.1:8787/?lang=en**. Use a second browser profile or private window to test the other role. Local QA data is in memory and resets when the server restarts. Rebuild and restart after source edits; this server has no hot reload. See [getting started](docs/getting-started.md) for Wrangler development and troubleshooting.

## Project map

```text
public/                  Browser UI, styles, translations, PWA shell
client/                  three.js room and collision rules
src/index.js             Cloudflare Worker, API and session lifecycle
src/rooms/               Mission content, views and server-side validators
migrations/              D1 database schema
scripts/                 Build and local QA server
tests/                   Backend, language and collision tests
examples/missions/       Inert authoring example; not loaded by the game
docs/                    Contributor and maintainer guides
.github/                 Issue and pull-request templates
```

The application runs on **Cloudflare Workers + D1** at [aiescape.myapps.fans](https://aiescape.myapps.fans). three.js is bundled locally; there are no runtime CDN or font dependencies. Publishing GitHub source does not automatically deploy the application. See [operations](docs/operations.md) for the release process, data lifecycle, and access requirements.

Ready to help? Pick a small idea from the [roadmap](docs/roadmap.md), open an issue using a template, and follow [CONTRIBUTING.md](CONTRIBUTING.md). Puzzle writing, translation, art, accessibility, and playtesting are as welcome as code.
