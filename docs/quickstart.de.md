# Gemeinsam an AI Escape arbeiten

Die Idee: Wir entwickeln zusammen eine spannende, begehbare Landschaft mit mehreren Missionen und Zielen. Kollegen können Rätsel, Dialoge, Übersetzungen, Gebäude, kleine Requisiten oder Code beitragen. Die technischen Anleitungen sind überwiegend auf Englisch, damit auch unsere rumänischen Kollegen direkt mitarbeiten können.

**Aktuell spielbar:** eine Mission, das Prompt-Labor, mit drei Rätseln, deutschem/englischem Handbuch, NOVA und einem begehbaren 3D-Raum. Eine Missionsauswahl, eine größere Landschaft und gemeinsame 3D-Avatare sind noch nicht umgesetzt. Der [Entwicklungsfahrplan](roadmap.md) beschreibt die vorgeschlagenen Schritte dorthin.

## Lokal starten

Voraussetzungen: Git, Node.js ab Version 24 und npm. Externe Mitwirkende können das Repository auf GitHub forken und Änderungen als Pull Request einreichen. Cloudflare-Zugriff ist für den lokalen QA-Server nicht nötig.

```sh
git clone https://github.com/riesenberg-byte/aiescape.git
cd aiescape
npm ci
npm run build
npm test
node scripts/dev-server.mjs
```

Öffnet **http://127.0.0.1:8787/?lang=de**. Mit einem zweiten Browserprofil oder privaten Fenster könnt ihr als Handbuch beitreten. Die lokalen Daten liegen nur im Arbeitsspeicher. Nach Änderungen neu bauen und den Server neu starten; Einzelheiten stehen in [Getting started](getting-started.md).

## So könnt ihr mitmachen

1. Im [Beitragsleitfaden](../CONTRIBUTING.md) und den vorhandenen GitHub-Issues nachsehen, ob jemand schon an der Idee arbeitet.
2. Über eine Issue-Vorlage eine Mission, ein Landschaftselement oder eine Verbesserung vorschlagen. Dazu braucht es noch keinen fertigen Code.
3. Einen eigenen Branch anlegen, eine kleine, klar abgegrenzte Änderung machen und einen Pull Request öffnen.
4. Die passenden Prüfungen aus [Testing](testing.md) durchführen. Neue Spieltexte in Deutsch und Englisch ergänzen; IDs und Lösungen bleiben sprachunabhängig.

| Eure Idee | Passende Anleitung |
| --- | --- |
| Ein neues Rätsel oder eine Mission schreiben | [Mission authoring](mission-authoring.md), [Beispiel](../examples/missions/README.md) |
| Möbel, Gebäude oder Landschaft gestalten | [World building](world-building.md) |
| Handlung und Ziele entwickeln | [Game design](game-design.md), [Roadmap](roadmap.md) |
| Texte übersetzen oder verbessern | [Localization](localization.md) |
| Engine oder Backend erweitern | [Architecture](architecture.md), [API](api.md) |

Am einfachsten ist zunächst ein kleines Objekt, eine verständlichere Rätselhilfe oder ein Missionsentwurf. Weitere spielbare Missionen brauchen derzeit noch Änderungen an der Engine. Das Beispielmodul wird deshalb bewusst als Vorlage geführt und nicht automatisch ins Live-Spiel aufgenommen.

**Live spielen:** [Deutsch](https://aiescape.myapps.fans/?lang=de) · [English](https://aiescape.myapps.fans/?lang=en).

Der eigene Projektcode, die Dokumentation, Beispiele und eigenen Assets stehen unter der [MIT-Lizenz](../LICENSE). Hinweise zu Drittanbieter-Komponenten bleiben in [THIRD_PARTY_NOTICES.md](../THIRD_PARTY_NOTICES.md) erhalten. Ihr könnt euren Fork mit Codex verbinden oder den lokal geklonten Ordner mit Claude Code bearbeiten; der [Beitragsleitfaden](../CONTRIBUTING.md) erklärt den Ablauf.
