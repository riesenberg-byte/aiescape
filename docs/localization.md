# Localization

English and German are supported throughout the current game. Each player chooses a language independently, including in the same team.

## Language selection

The browser chooses, in this order:

1. An explicit `?lang=en` or `?lang=de` URL parameter.
2. A saved `aiescape-language` preference in local storage.
3. The first browser language: German if it begins with `de`, otherwise English. Romanian browsers therefore default to English.

The DE/EN buttons update the UI and, for an active team, fetch the current state in the new language. No shared language column is stored in D1. Browser API calls send `X-Game-Language`; API calls without that header default to German even when the browser would choose English.

Invitation links include the current player's language parameter. An invitee can switch after joining. UI language does not change the team name, answer IDs, timer, or shared stage. Form drafts and the 3D position should survive a switch.

## Text locations

| Content | Source |
| --- | --- |
| UI labels, dialogs, instructions, success panel, station hints | `public/i18n.js` |
| Static page markers | `public/index.html`: `data-i18n`, `data-i18n-html`, `data-i18n-label`, `data-i18n-aria` |
| Canonical German mission content and validators | `src/rooms/prompt-lab.js` |
| English mission copy | `src/rooms/prompt-lab.en.js` |
| English server errors | `src/errors.en.js` |
| MILO's stored-message translation | `miloMessage()` in the active room module |
| English installation manifest | `src/index.js` response for `/manifest.webmanifest?lang=en` |

UI dictionary entries are `[German, English]` pairs with stable keys:

```js
yourKey: ['Dein Text', 'Your text']
// t('yourKey') selects the current language
```

`t()` also replaces named placeholders such as `{step}` or `{number}`. Keep placeholders equivalent in both languages. Missing keys throw an error; do not use a new key in the UI before adding it to the dictionary.

`data-i18n-html` and a few template strings intentionally render trusted authored HTML. Never put user-provided names or unescaped data into those translation fragments. Team names are data and must remain escaped, not translated.

## Mission translations

Match stage counts and option sets exactly. Labels may change, but a choice ID such as `team`, `B`, or `review` must mean the same thing in both languages. Validators run against these IDs, not visible text. Both versions need the same information and equally useful hints; literal translation is less important than equivalent puzzle difficulty.

MILO messages are currently stored as German strings and translated by matching those strings. If you edit canonical success/failure copy, consider sessions that already hold the old text. Stable message IDs and mission versions are planned improvements, not current infrastructure.

## Review checklist

- Change or add both languages in the same PR whenever possible.
- Verify instructions, dates, number formats and source references still support the same answer.
- Check long English/German text on a small screen and the 3D labels.
- Play with one English terminal and one German handbook, then swap languages mid-stage.
- Confirm input drafts, role, stage, timer and camera position remain intact.
- Check error messages, hints and completion text as well as the home page.

For new languages, propose the full fallback, dictionary and mission-content approach first. Adding another header button alone does not make the engine support that locale.
