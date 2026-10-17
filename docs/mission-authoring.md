# Mission authoring

Start with a [mission proposal](game-design.md), then use the inert [example module](../examples/missions/README.md). A colleague can contribute a design or content draft without changing the engine.

## Current integration boundary

The live handler imports **one fixed room** from `src/rooms/prompt-lab.js`. There is no mission registry or JSON plug-in loader. Dropping a file into `src/rooms/` or `examples/missions/` does not expose a new mission. Several UI labels, the progress list, and station behavior also assume the current three-step lab.

A safe first content contribution improves the existing module, or adds an unregistered example and proposal. A second independently selectable mission depends on [roadmap milestone M1](roadmap.md). Do not silently replace the live mission or change existing answers in a content-only PR.

## Module contract today

The active module exports `room`, `stageView()`, and `novaMessage()`. German content is canonical; the English module supplies matching text and option IDs. The example follows the same export shapes.

| Room field | Meaning |
| --- | --- |
| `id` | Stable identifier such as `prompt-lab`; never translate it |
| `title` | Canonical title; the current handler also explicitly selects the English title |
| `duration` | Author-facing display estimate; not an enforced timer |
| `stages` | Ordered stage definitions |

Every stage has:

| Field | Meaning |
| --- | --- |
| `title`, `label`, `task` | Title, short progress label and terminal instructions |
| `kind` | `slots`, `choice`, or `order` |
| `manual` | Array of `[heading, body]` handbook notes |
| `hints` | Ordered hint strings; the existing UI assumes up to two |
| `validate(answer)` | Synchronous server-only function returning a boolean |
| `success`, `failure` | NOVA's canonical responses |

### Supported puzzle shapes

```js
// slots
{
  kind: 'slots',
  slots: [{ id: 'audience', label: 'Who?', options: [['team', 'The team'], ['clients', 'Clients']] }],
  validate: answer => answer?.audience === 'team'
}

// choice — the third tuple item is a displayed source/reference
{
  kind: 'choice',
  choices: [['A', 'A supported statement', 'Source register'], ['B', 'An invented statement', 'No source']],
  validate: answer => answer === 'B'
}

// order — start in an unsolved order, but keep stable item IDs
{
  kind: 'order',
  choices: [['send', 'Send'], ['review', 'Review'], ['draft', 'Draft']],
  validate: answer => Array.isArray(answer) && answer.join(',') === 'draft,review,send'
}
```

These fragments demonstrate fields, not complete stages. The copyable example supplies full definitions, both languages, and role projection.

Validators must reject missing/wrong-shaped input without throwing. Use optional chaining/type checks before property access, array operations or string operations. Do not perform network calls, mutate session state, or award progress inside a validator. The handler owns SQL, concurrency and scoring.

## Preserve information separation

`stageView()` must explicitly select safe fields:

- Common: `title`, `label`, unlocked hints.
- Terminal: `task`, `kind`, `slots`, `choices`.
- Handbook: `manual`.

Never spread an entire stage into an API response. Even though functions disappear during JSON serialization, extra solution metadata could still leak. Do not import server mission modules into `public/` or `client/`; those paths are shipped to players.

Both roles can see the current stage's public heading. The handbook's facts should therefore add information rather than merely repeat the heading. A source-reference field is displayed content, not automatic source verification.

## Language and compatibility checklist

1. Keep `id`, slot IDs, option IDs, choice IDs, order IDs and validators identical across languages.
2. Match stage count, option sets, clue meaning and hint usefulness in German and English.
3. Supply English `success` and `failure` strings. The current `novaMessage()` maps canonical stored strings to English, including responses in existing sessions.
4. Update any UI dictionary labels that describe the changed task; the current progress list is separate from stage data.
5. If changing stage order, validator meaning or canonical messages, explain the effect on teams already playing. The prototype does not pin a content version per session.

See [localization](localization.md) for text locations and request language behavior.

## Integrating a future additional mission

This is an implementation checklist, not an already-supported extension point:

1. Add a server-side registry that validates allowed mission IDs and selects one at team creation.
2. Resolve all state views, answer checks, titles, message translations and completion counts using the session's selected mission.
3. Add mission/content versioning and a compatibility plan for existing sessions. The existing `room` column alone does not implement this.
4. Replace the hardcoded three-step progress list and `OF 03` / `VON 03` strings with data-driven equivalents.
5. Separate leaderboard rankings by comparable mission/version; retain explicit publication consent.
6. Map the selected mission to the appropriate scene/stations and equivalent 2D controls.
7. Test two different missions in parallel, mixed languages, invalid IDs, role restrictions, stale revisions and final-stage completion.

Keep this engine PR separate from the new mission's content PR where practical. It makes reviewing story and mechanics much easier.

## Before requesting review

Run the example's smoke command, `npm run build`, and `npm test` as relevant. Play the task with someone who has not seen the answer. Report the intended solution, any plausible alternative, hints used, and observed confusion. A small, delightful puzzle is a better first contribution than an untested large campaign.
