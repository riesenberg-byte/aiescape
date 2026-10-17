# World building

The current world is a hand-built three.js voxel lab. The intended next step is a shared design language and independently editable areas; a world editor, chunk loader and area configuration system are not implemented yet.

## Where to work

| File | Change here |
| --- | --- |
| `client/voxel-room.js` | Blocks, colors, labels, furniture, lights, stations and rendering |
| `client/world.js` | Spawn, collidable footprints, bounds and movement rules |
| `public/app.js` | What a station interaction does and how views are retained |
| `public/i18n.js` | UI/station translations and instructions |
| `public/lab.svg` | Separate 2D overview illustration |
| `public/style.css` | Canvas layout, touch buttons, HUD and responsive layout |

Keep a world contribution focused on a named object or area. Annotate coordinates in the PR so two authors do not place geometry in the same space.

## Coordinates and block helpers

Coordinates use **X** for left/right, **Y** for height, and **Z** for depth. The floor top is near `y = 0`. The player starts at `(x=0, z=4.7)`, eye height `1.65`, facing negative Z at yaw zero. The main room spans approximately `-6…6` on X/Z; an unlocked exit extends a short corridor toward negative Z.

Inside `createVoxelRoom()`, before the batching loop, the existing helper is:

```js
box(x, y, z, width, height, depth, color, glow = false);
```

Positions are box **centers**, dimensions are full extents in world units, and `color` is a CSS color string. For example, this decorative crate rests on the floor:

```js
box(2.4, 0.25, 2.4, 0.5, 0.5, 0.5, '#b69572');
```

The helper accumulates cubes by material, and the subsequent loop creates `InstancedMesh` batches. Calling `box()` after that loop will not add visible geometry. It is a closure-local helper, not an exported scene-builder API. Moving these helpers into reusable area modules is a proposed refactor.

NOVA and the animated door use separately created meshes/groups. Do not add every prop as a new animated object; static block batches are cheaper and easier to manage.

## Make solid objects solid

Visual geometry and collisions are separate today. To make the crate above collidable, add its footprint to `OBSTACLES` in `client/world.js`:

```js
{ x: 2.4, z: 2.4, w: 0.5, d: 0.5 }
```

`canStand()` expands these axis-aligned footprints by the player's radius (`0.28`). `movePlayer()` applies short substeps and separate-axis movement so players can slide along walls. Obstacles currently block movement regardless of Y: do not add an overhead beam as a ground obstacle.

Walkable room bounds and the unlocked exit corridor are hardcoded separately in `canStand()`. Enlarging only the rendered floor does not enlarge the walkable area. Change geometry, bounds, spawn and collision tests together when adding space.

Leave clear paths to both desks, NOVA, the reset/spawn area and the exit. Test a diagonal approach as well as straight movement; a decorative object can make a station unreachable even if its own footprint is correct.

## Stations and goals

The current station list inside the renderer uses:

```js
{ id: 'terminal', x: -3.7, z: -1.5, key: 'terminalStation' }
```

Detection chooses a nearby station within roughly 2.25 units that is in front of the player. F or the HUD button reports its ID to `onInteract`. Existing IDs are `terminal`, `manual`, `nova`, and `exit`.

`interactStation()` in `public/app.js` opens the current role's panel, displays a role reminder, or shows a NOVA/exit message. A new ID needs a corresponding app behavior and translations. The scene does not validate answers or set shared progress. The server's completed state controls `unlocked`; walking through the door cannot bypass a puzzle.

For future objectives such as “restore power”, propose both the server-side completion rule and the visible world change. A glowing mesh alone is scenery, not a persisted objective.

## Visual and performance conventions

- Keep the block-based palette coherent: forest/sage office colors, green interaction accents, lime highlights and readable dark panels.
- Use simple silhouettes, generous paths, and landmarks visible at human eye height. Avoid relying only on color to explain a goal.
- Reuse materials and static batches. Check desktop and touch performance before adding shadows, transparency, large textures or many animated elements.
- Keep text in translation keys or generated labels. Update the 2D overview when a material navigation change makes it misleading.
- Preserve `pause()`, `snapshot()`, `update()` and `dispose()` behavior. Clean up new listeners, observers, geometries, materials and textures; avoid accumulating animation loops when switching languages or roles.
- Keep the 2D path usable and test failure to create a WebGL context.

The [asset build](architecture.md) currently accepts only flat text assets and an internally bundled three.js module. Models, binary textures and nested asset folders need an explicit build/deployment change. Include sources and licenses for any new assets; preserve [third-party notices](../THIRD_PARTY_NOTICES.md).

## Toward a bigger landscape

Propose a small hub with two connected areas before an expansive map. First extract a shared world specification containing area IDs, geometry builders, collisions, spawn/exit points and station IDs. Then test that geometry and collisions derive from the same area definitions. The [roadmap](roadmap.md) describes this dependency before colleagues start editing independent area modules.

Shared avatars and networked positions are a separate networking feature. Current positions are local to a device; puzzle progress is shared. Larger scenery can be developed without coupling every camera movement to D1 writes.
