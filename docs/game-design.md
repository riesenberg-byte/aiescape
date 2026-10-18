# Game design

## Direction

AI Escape should be an enjoyable team adventure that happens to teach useful AI habits. MILO is earnest, literal, and occasionally absurd. Its journey is from over-optimising colleague to helpful collaborator. Humor should come from office situations and ambiguous instructions, not from frightening players or mocking a colleague's technical knowledge.

The larger vision is an office campus or landscape that teams explore together: a hub, recognisable destinations, several missions, and a visible shared goal. The first playable slice is deliberately small: one lab, three tasks, two information roles.

## Vocabulary for proposals

| Term | Meaning | Current implementation |
| --- | --- | --- |
| World / landscape | The navigable setting and its connected areas | One local voxel room |
| Area / room | A physical place with scenery and stations | Prompt Lab |
| Mission | A bounded cooperative challenge with a beginning and end | One fixed module named `room` in code |
| Stage / puzzle | One actionable step in a mission | Sequential cursor, three stages |
| Objective | A player-understandable result, e.g. restore power | Represented by stage completion today; no generic objective system |
| Campaign | Several missions with unlock rules and an overall goal | Planned |
| Station | A point of interaction, e.g. terminal or handbook desk | Four fixed station IDs |

Keep physical areas and mission logic separate in new designs: several missions could eventually use one location, and one mission could span more than one area.

## Rules for a good cooperative puzzle

1. Give each role useful, different information. The handbook should explain facts or constraints, rather than simply saying “choose B”.
2. State a concrete player objective. Make success visible: a door opens, a machine restarts, or a new clue appears.
3. Require communication, not obscure trivia or programming knowledge. A newcomer should understand what to try.
4. Use deterministic validation with language-independent answer IDs. If a future mission uses a model, keep progression reproducible and handle provider failure explicitly.
5. Write two escalating hints and a recoverable failure response. Avoid permanent lockouts and shame-based feedback.
6. Make the 2D/accessible interaction equivalent to the 3D interaction. Movement should enrich the experience without forcing every player to master camera controls.
7. Playtest English and German, ideally with people who did not write the puzzle.

## Mission proposal worksheet

Use the GitHub **Mission proposal** form and include:

- Working title, stable candidate ID, area, player count and expected duration.
- Opening situation and MILO's amusing misunderstanding.
- One sentence describing the final player objective.
- Stage sequence: action, terminal information, handbook information, solution rationale, and observable result.
- Two hints per stage, wrong-answer behavior, and how a team recovers.
- English/German text plan, accessibility and mobile needs.
- Dependencies on code/assets and whether current puzzle kinds are enough.
- Playtest observations and a small first implementation that can be reviewed independently.

## Example of a future campaign — proposal only

**Shared goal: get the office celebration running again.**

| Area | Mission objective | Cooperative twist |
| --- | --- | --- |
| Prompt Lab | Recover a useful party invitation | One side has the task, the other has the confirmed brief |
| Hallucination Archive | Verify the event information | One side sees claims, the other sees source records |
| Engine Room | Restore a safe automation workflow | One side arranges blocks, the other has system constraints |
| Governance Vault | Obtain the right approval | Team combines scenario facts and permission rules |
| Data Basement | Repair the data feeding MILO | Team reconciles inconsistent records and definitions |
| Celebration hub | Combine completed objectives | MILO joins the party after the team's collective work |

These are design prompts, not scheduled releases. The lab already includes source-checking and approval tasks; new missions should add a distinct mechanic or scenario rather than repeat the same multiple-choice questions.

For an event, prototype with one or two small teams first. Observe where people communicate, where one player dominates, and where the wording needs help. A leaderboard is optional; success should still feel satisfying for a team that uses every hint.
