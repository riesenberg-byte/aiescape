# Copyable mission example

`coffee-break.js` and `coffee-break.en.js` demonstrate the current module shapes: a three-stage mission using `slots`, `choice`, and `order`, role-specific clues, two hints per stage, safe validators and matching English text.

**This is an inert authoring example. It is not registered or playable in the live application.** It deliberately uses small, obvious puzzles to explain the structure; a finished mission should be playtested for interest and difficulty.

## Inspect and try the module

From the repository root, with Node.js 24+:

```sh
node --input-type=module <<'JS'
import assert from 'node:assert/strict';
import { room, stageView, miloMessage } from './examples/missions/coffee-break.js';

const answers = [{ audience: 'team', duration: 'ten' }, 'B', ['check', 'draft', 'approve']];
room.stages.forEach((stage, index) => {
  assert.equal(stage.validate(answers[index]), true);
  assert.equal(stage.validate(null), false);
  const terminal = stageView(index, 'terminal', 0, 'en');
  const handbook = stageView(index, 'manual', 0, 'de');
  assert.equal(terminal.manual, undefined);
  assert.equal(handbook.choices, undefined);
  assert.ok(handbook.manual.length > 0);
  assert.equal(terminal.validate, undefined);
  assert.notEqual(miloMessage(stage.success, 'en'), stage.success);
  console.log(`${index + 1}. ${terminal.title}`);
});
JS
```

This checks the example in isolation; it does not test UI integration. In shells that do not support a quoted heredoc, save the JavaScript block to a temporary `.mjs` file in the repository root and run it with Node, then remove that temporary file.

## Use it for your own proposal

1. Copy both files to a new, consistently named pair inside `examples/missions/`.
2. Update the English import path, mission ID, titles, story, notes, choices, hints and validators.
3. Keep option IDs and solutions equivalent in DE/EN; keep validators server-only.
4. Include a proposal explaining the objective, two-role information split and required scenery/engine work.
5. Run the smoke block with your new import path and answers. Ask another team to review the puzzle without seeing the validators.

The active handler, titles, progress UI and station behavior still refer to the Prompt Lab. Do not swap imports and assume a new selectable mission exists. Follow [mission authoring](../../docs/mission-authoring.md) and [M1 in the roadmap](../../docs/roadmap.md) for the integration work.
