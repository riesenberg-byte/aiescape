# AI Escape

Ein kooperatives Browser-Escape-Game über KI und Zusammenarbeit. NOVA hat das Office abgeriegelt. Das Team bringt ihm bei, klare Aufträge, verlässliche Quellen und menschliche Freigaben zu beachten.

**Live:** https://aiescape.myapps.fans

## Spielen

1. Ein Team gründen und den achtstelligen Teamcode oder Einladungslink teilen.
2. Auf einem weiteren Gerät als **Handbuch** beitreten. Das **Terminal** sieht die Aufgaben, das Handbuch die Hinweise. Empfohlen: 2–6 Personen, etwa 10–15 Minuten.
3. „Labor betreten“ startet die gemeinsame Zeit. Drei Aufgaben lösen, dabei miteinander sprechen.
4. Für einen Solotest zwischen Terminal und Handbuch wechseln.

Die erste Mission ist vollständig spielbar. Weitere Räume sind als geplant gekennzeichnet. Das Labor ist zusätzlich als einfache begehbare 3D-Voxelwelt verfügbar. Die 2D-Ansicht bleibt jederzeit auswählbar. NOVAs Reaktionen sind geschrieben, es werden keine Prompts an einen KI-Anbieter gesendet.

## English / language selection

The complete game is available in **English and German**, including all puzzles, handbook entries, hints, NOVA dialogue, error messages, and leaderboard controls. Select **EN / DE** in the header or inside a dialog. Romanian and other non-German browser locales default to English. A saved preference wins over browser detection; an explicit `?lang=en` or `?lang=de` link wins over both.

Each teammate chooses their own language. Both languages share stable answer IDs and the same server-side session, so switching languages never restarts the timer or changes the solution. Existing sessions continue to work; no database migration is needed.

English entry point: https://aiescape.myapps.fans/?lang=en

## Walkable 3D lab

Choose **Explore the 3D lab** on the home page or use the 3D view during a mission. Click **Explore** to enable controls:

- **WASD / arrow keys:** move; **Q / E:** turn.
- **Drag on the scene:** look around. **F:** interact with a nearby station.
- **Esc / Pause:** stop movement. **Back to the entrance:** reset your position.
- **Touch screens:** hold the direction buttons to walk, drag on the scene to look, and tap the interaction button.

Terminal, Handbook, NOVA, and the exit can be approached. Stations open the relevant puzzle panel for your current role. The exit unlocks after all three puzzles. Your camera position stays local to your device; there are no shared avatars or networked player positions. Puzzle state remains shared.

Walls and large furniture have collision detection. Instanced block geometry keeps the room small. 3D is optional, and the **2D view** supports the full game on devices without WebGL. `client/voxel-room.js` owns rendering and input; `client/world.js` contains the separately tested collision rules. All three.js code is bundled at build time with esbuild and served from the same origin.

Translations live in `public/i18n.js`, `src/rooms/prompt-lab.en.js`, and `src/errors.en.js`. Add translations while preserving room IDs, option IDs, and validators.

## Architektur

- Cloudflare Worker `aiescape`, eigene Domain `aiescape.myapps.fans`, HTTPS über Workers Custom Domains.
- D1 `aiescape`: gemeinsame Spielstände, Spielerrollen, freiwillige Bestenliste.
- Vanilla HTML/CSS/JS, lokal gebündeltes three.js für den 3D-Raum, selbst gezeichnete SVG-Laborillustration, PWA-Manifest und Service Worker. Keine externen Fonts oder Laufzeit-CDNs.
- Die kleine Website wird beim Build als JS-Modul eingebettet; somit ein einziges Worker-Deployment ohne separaten Asset-Upload. Für größere Medien auf Workers Static Assets wechseln.
- Server prüft Antworten und Rollen. Versionierte SQL-Updates verhindern doppelte Fortschritte bei gleichzeitigen Aktionen. Polling alle drei Sekunden.
- Teamcodes erlauben Beitritt, individuelle zufällige Spielertokens werden serverseitig nur gehasht gespeichert. Die Tokens bleiben im Session Storage des jeweiligen Browser-Tabs.
- Sicherheitsheader, Same-Origin-Prüfung, begrenzte Request-Größe, Rate Limits. Keine Accounts, kein Tracking.
- Spielstände sind für 24 Stunden zugänglich. Nicht veröffentlichte Spiele werden beim nächsten Erstellen nach 24 Stunden gelöscht, veröffentlichte Ergebnisse nach 30 Tagen. Das ist eine auf Anfrage ausgeführte Bereinigung, kein zeitgenauer Löschjob. Nur Fantasienamen verwenden.
- Ergebnisse erscheinen erst nach ausdrücklichem Klick auf „Ergebnis veröffentlichen“. Wertung: Spielzeit + 60 Sekunden pro Hinweis + 15 Sekunden pro Fehlversuch. Keine wettbewerbssichere Rangliste; Rollenwechsel und mehrere Terminals sind erlaubt.
- Offline ist die Oberfläche verfügbar; gemeinsame Spiele und Bestenliste benötigen eine Verbindung. Keine Offline-Mutationswarteschlange.

## Lokal entwickeln

Node.js 24 oder neuer. Zuerst die festgeschriebenen Abhängigkeiten installieren:

```sh
npm ci
npm run build
npm test
node scripts/dev-server.mjs
```

Der lokale QA-Server verwendet SQLite im Arbeitsspeicher. Für Cloudflares tatsächliche Laufzeit Wrangler verwenden:

```sh
npm install
npm run db:local
npm run dev
```

## Cloudflare bereitstellen

`wrangler.jsonc` enthält Account, Domain und die bestehende D1-ID. Keine Secrets sind im Repository gespeichert. Mit passenden Cloudflare-Rechten:

```sh
npm install
npm run db:remote
npm run deploy
```

Für CI einen auf dieses Konto beschränkten `CLOUDFLARE_API_TOKEN` als geschütztes Secret konfigurieren. Die erste Veröffentlichung erfolgte über den verbundenen Cloudflare-API-Zugang. Eine automatische GitHub-Deployment-Verbindung ist noch nicht eingerichtet.

## Einen Raum beitragen

`src/rooms/prompt-lab.js` ist das erste Modul. Ein Raum exportiert `id`, `title` und eine Liste von `stages`. Jede Stage kombiniert Daten (Titel, Rätseltyp, Optionen, Handbuchnotizen, Hinweise) mit dem serverseitigen `validate(answer)`-Hook und NOVAs Erfolgs-/Fehlermeldung. Die Daten können bei größeren Räumen in eine separate JSON-Datei ausgelagert werden.

Die Engine unterstützt `slots`, `choice` und `order`. `stageView()` gibt ausschließlich die zur Rolle passenden Daten aus und überträgt keine Validatoren an den Browser. Neue Module müssen explizit in die serverseitige Raumauswahl aufgenommen werden; eine beliebige Anzahl parallel auswählbarer Räume ist noch nicht implementiert.

`npm test` prüft den vollständigen Teamablauf gegen SQLite, Rollentrennung, Versionskonflikte, Hinweise, Freigabe der Bestenliste, Sitzungslaufzeit, Eingabegrenzen, Sicherheitsheader, gemischtsprachige Teams und die Kollisionsregeln der 3D-Welt.
