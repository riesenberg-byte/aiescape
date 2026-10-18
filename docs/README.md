# Documentation

These guides describe **AI Escape 0.2.2**. The main technical guides are in English for cross-location collaboration. [Deutscher Schnelleinstieg](quickstart.de.md).

| Guide | Purpose |
| --- | --- |
| [Getting started](getting-started.md) | Requirements, local run modes, commands, troubleshooting |
| [Contributing](../CONTRIBUTING.md) | Joining the project, choosing work, branches and pull requests |
| [Game design](game-design.md) | Story, cooperative puzzle rules, mission/objective vocabulary |
| [Architecture](architecture.md) | Code map, build, session state, rendering and boundaries |
| [API reference](api.md) | Requests, responses, actions and failure handling |
| [Mission authoring](mission-authoring.md) | Current module contract, puzzle kinds, examples and integration limits |
| [World building](world-building.md) | Geometry, coordinates, collisions, stations and landscape growth |
| [Visual design](visual-design.md) | Colors, components, contrast and theme maintenance |
| [Localization](localization.md) | Language selection, UI/content/error translations and stable IDs |
| [Testing](testing.md) | Automated coverage, manual browser scenarios and playtest reports |
| [Operations](operations.md) | Cloudflare deployment, verification, rollback and data lifecycle |
| [Roadmap](roadmap.md) | Proposed milestones toward several missions and a connected world |
| [Example mission](../examples/missions/README.md) | Copyable module using the existing puzzle shapes |

## Maintain the documentation

Update the relevant guide in the same PR as a behavior or contract change. Keep examples runnable, use repository-relative links, and mark design proposals clearly. Do not document a planned feature as an existing API. Avoid repeating detailed setup instructions in several files; link to the owning guide instead.

For a first visit: read the [project README](../README.md), follow [getting started](getting-started.md), then choose a contribution track in [CONTRIBUTING.md](../CONTRIBUTING.md).
