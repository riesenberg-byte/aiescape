# Visual design

The 0.2.1 theme uses a ServiceNow-inspired forest, sage and lime palette with AI Escape's own name, arrow icon and NOVA character.

## Palette

| Token | Value | Role |
| --- | --- | --- |
| `--forest-deep` | `#0e2d2b` | Hero, header, high-contrast dark surfaces |
| `--forest` | `#153f3b` | Mission cards, status panels and NOVA bubbles |
| `--sage` | `#81b5a1` | Supporting details, robot body and subtle boundaries |
| `--lime` / `--acid` | `#d1f55e` | Primary actions, hero emphasis and completion accents |
| `--paper` | `#f5f8f2` | Main page background |
| `--ink` | `#193b35` | Text on light surfaces |
| `--accent` | `#24624c` | Links, focus indicators and selected states on light surfaces |

Use dark text on lime buttons, light text on forest cards, and muted green text only on light backgrounds. Primary controls and focus outlines must remain easy to distinguish in both themes. Planned mission cards keep their explicit status labels; color alone must not imply a playable mission.

## Components and source

`public/style.css` owns the palette and the final theme rules, after the shared layout and 3D-control rules. Keep responsive behavior in place when editing it. The main visual pattern is a dark welcome area, a lime transition strip, light mission cards, and a dark game-status header above light puzzle panels.

`public/lab.svg` is the isometric illustration. `client/voxel-room.js` contains independent material colors for the walkable scene; update those deliberately when changing the palette. The movement/collision model does not need to change for a color-only edit. `public/icon.svg`, the HTML theme color and the PWA manifest also use the forest/lime palette.

In 0.2.1, changed browser assets have explicit `?v=0.2.1` URLs and the service worker uses `aiescape-shell-v3`. Keep HTML, dynamic module imports and the service-worker shell list consistent when changing asset versions. The worker matches assets by pathname. Shell membership also matches by pathname, while cache entries retain their full versioned request URL.

## Review

Check the home page, team dialogs, active terminal, handbook, hints, completion and 3D controls. Verify English/German text, keyboard focus and touch controls at desktop and small-screen sizes. Use the existing [testing guide](testing.md); no game rules should change as a side effect of styling.
