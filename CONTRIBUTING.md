# Contributing to AI Escape

Welcome! The aim is a fun cooperative world that colleagues can build together, one useful contribution at a time. You can contribute a puzzle, a story, a room, scenery, translations, code, or a playtest report.

## Join and choose a task

The repository is currently private. The repository owner can invite colleagues as GitHub collaborators. An invitation gives repository access; local development itself needs no Cloudflare production access.

1. Read the [README](README.md), [game design](docs/game-design.md), and [current roadmap](docs/roadmap.md).
2. Search existing issues and pull requests for related work. The roadmap is a list of proposals, not a promise that somebody has already taken them.
3. Open a **Feature proposal**, **Mission proposal**, **World / scenery contribution**, or **Bug report** using GitHub's issue templates. For a typo or a tiny correction, a direct pull request is fine.
4. Explain the player benefit, a bounded first version, and which files you expect to touch. If another person is working on it, agree on the boundary in the issue before editing shared files.
5. Ask a maintainer to assign the issue, or comment that you are taking it. Templates do not automatically create labels, assign people, or change repository permissions.

Good first contributions include a clearer clue in both languages, a playtest report, a decorative block object with no new mechanics, a touch-control improvement, or a draft mission in `examples/missions/`. Adding another playable mission currently also needs engine work; see [mission authoring](docs/mission-authoring.md).

## Work in a branch

```sh
git switch main
git pull --ff-only origin main
git switch -c feat/your-short-description
```

Use descriptive branch names such as `docs/local-setup`, `feat/archive-puzzle`, `art/reception-desk`, or `fix/touch-controls`. Keep unrelated changes in separate pull requests. Avoid drive-by formatting of the compact existing source: it makes concurrent work harder to review.

Commit the source, relevant documentation, and `package-lock.json` when dependencies change. Generated assets, `dist/`, `.wrangler/`, screenshots, local data, and credentials are excluded by `.gitignore`.

## Contribution tracks

| Track | Starting point | A useful first deliverable |
| --- | --- | --- |
| Puzzle / story | [Mission authoring](docs/mission-authoring.md) | Brief, two-role clues, solution, two hints, DE/EN copy |
| 3D / scenery | [World building](docs/world-building.md) | One area/object with coordinates, collisions and screenshots |
| Engine / backend | [Architecture](docs/architecture.md) | Small change with state, compatibility and test impact explained |
| Translation | [Localization](docs/localization.md) | Matching DE/EN text with stable option IDs |
| Playtesting | [Testing](docs/testing.md) | Team size, observed confusion, hints used and suggested improvement |

## Open a pull request

1. Follow [local setup](docs/getting-started.md).
2. Run the checks appropriate to your change from [testing](docs/testing.md). A documentation-only change needs link and example checks; game changes need build and tests.
3. For visible changes, include desktop/mobile screenshots or a short recording and describe the control behavior. Use invented team names in examples.
4. Push your branch and open a pull request into `main`. The PR template asks for the problem, final behavior, verification, and limitations. Link the issue if there is one.
5. Request maintainer review. A maintainer decides when to merge and release. There is currently no automated deployment or required-check enforcement configured by this project.

For large shared-file changes, open a draft PR early. If `main` moves, update your branch and resolve conflicts in your own changes. Never force-push `main`. If rewriting your own branch is necessary, coordinate with anyone sharing it and use `--force-with-lease`.

## Definition of done

- The player-facing outcome is clear and stays within the agreed scope.
- English and German content remain equivalent; answer IDs and solutions are stable across languages.
- Role-specific clues and server-side validation remain intact.
- Relevant checks pass; report checks you could not run and why.
- 3D changes preserve a usable spawn, paths, station access, and the 2D alternative.
- New dependencies or artwork have a stated source and license. Preserve [third-party notices](THIRD_PARTY_NOTICES.md).
- Documentation describes the implemented state; proposals are marked as proposals.
- Any database or session compatibility impact is explained before merging.

Do not commit real client material, credentials, production player tokens, or confidential office documents. AI-assisted contributions are welcome: review generated code and assets, verify source/license information, and run the same checks as for any other contribution. Prefer respectful, specific review feedback and ask when an intention is unclear.
