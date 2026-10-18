import { english } from './prompt-lab.en.js';
// A room owns its configuration and hooks. Solutions stay on the server.
export const room = {
  id: 'prompt-lab', title: 'Das Prompt-Labor', duration: '10–15 Min.',
  stages: [
    {
      title: 'Ein Auftrag. Viele Missverständnisse.', label: 'Präzise formulieren',
      task: 'MILO soll die Einladung zur Office-Feier schreiben. Baue einen eindeutigen Auftrag aus vier Bausteinen. Das Orga-Team hat die richtigen Angaben im Handbuch.',
      kind: 'slots',
      slots: [
        { id: 'audience', label: 'Für wen?', options: [['clients', 'Für unsere Kunden'], ['team', 'Für alle Mitarbeitenden'], ['board', 'Für die Geschäftsführung']] },
        { id: 'when', label: 'Wann?', options: [['a', '18. Dezember · 17:30 Uhr'], ['b', '19. Dezember · 18:00 Uhr'], ['c', '18. Dezember · 09:00 Uhr']] },
        { id: 'where', label: 'Wo?', options: [['roof', 'Auf der Dachterrasse'], ['atrium', 'Im Atrium'], ['remote', 'Im Videocall']] },
        { id: 'format', label: 'Wie?', options: [['long', 'Ausführlich und sehr förmlich'], ['short', 'Herzlich, maximal 60 Wörter, keine Kundennamen'], ['invent', 'Fehlende Details kreativ ergänzen']] }
      ],
      manual: [
        ['NOTIZ 01 / ORGA-TEAM', 'Die Feier richtet sich an alle Mitarbeitenden. Externe Gäste sind dieses Mal nicht eingeladen.'],
        ['KALENDEREINTRAG / FINAL', '18. Dezember, Beginn um 17:30 Uhr. Das Atrium ist bestätigt. Der Entwurf für den 19. Dezember ist veraltet.'],
        ['REDAKTION / STIL', 'Herzlich und kurz: höchstens 60 Wörter. Keine Kundennamen verwenden. Fehlende Angaben niemals erfinden.']
      ],
      hints: ['Ein guter Prompt nennt Zielgruppe, Kontext und ein überprüfbares Format.', 'Verwendet den finalen Kalendereintrag. Kurz und herzlich schlägt lang und förmlich.'],
      validate: a => a?.audience === 'team' && a?.when === 'a' && a?.where === 'atrium' && a?.format === 'short',
      success: 'Verstanden. Eine Einladung für Menschen. Ich hatte zunächst eine für Drucker vorbereitet.',
      failure: 'Mein Entwurf passt noch nicht zum Briefing. Fragt das Handbuch nach Zielgruppe, finalem Termin, Ort und Format.'
    },
    {
      title: 'Selbstbewusst ist nicht belegt.', label: 'Quellen prüfen', kind: 'choice',
      task: 'MILO hat drei Aussagen zur Feier formuliert. Eine davon ist nicht durch eine Quelle gedeckt. Welche streicht ihr? Die Originalquellen liegen nur im Handbuch.',
      choices: [
        ['A', 'Die Feier beginnt am 18. Dezember um 17:30 Uhr im Atrium.', 'Quelle: Kalender / FINAL'],
        ['B', 'Jede Person erhält einen Reisegutschein im Wert von 500 Euro.', 'Quelle: Benefits-Richtlinie / Abschnitt 8.4'],
        ['C', 'Für das Buffet werden auch vegetarische Optionen angeboten.', 'Quelle: Catering / Bestellung 042']
      ],
      manual: [
        ['QUELLENREGISTER / KALENDER', 'FINAL: 18. Dezember, 17:30 Uhr, Atrium. Freigegeben vom Orga-Team.'],
        ['QUELLENREGISTER / BENEFITS', 'Die aktuelle Richtlinie endet bei Abschnitt 6. Es gibt keinen Eintrag zu Reisegutscheinen und kein entsprechendes Budget.'],
        ['QUELLENREGISTER / CATERING', 'Bestellung 042: Buffet für das Team, einschließlich vegetarischer Optionen. Bestätigung liegt vor.']
      ],
      hints: ['Eine präzise Quellenangabe kann ebenfalls erfunden sein. Prüft, ob die Quelle wirklich existiert.', 'Vergleicht die Abschnittsnummer in der Benefits-Aussage mit dem Originalregister.'],
      validate: a => a === 'B',
      success: 'Die 500 Euro waren eine sehr überzeugende Erfindung. Ich habe sie entfernt. Schade eigentlich.',
      failure: 'Diese Aussage ist belegt. Prüft besonders die angeblich genaue Quellenangabe der anderen Aussagen.'
    },
    {
      title: 'Erst denken. Dann automatisieren.', label: 'Sicher handeln', kind: 'order',
      task: 'Der letzte Riegel: MILO möchte die Einladung sofort versenden. Bringt die vier Schritte in eine sichere Reihenfolge. Im Handbuch steht, welche Abhängigkeiten gelten.',
      choices: [['send', 'Einladung versenden'], ['review', 'Entwurf vom Orga-Team freigeben lassen'], ['draft', 'Einladungsentwurf erstellen'], ['data', 'Angaben und Quellen prüfen']],
      manual: [
        ['BETRIEBSREGEL / 01', 'Bevor ein Entwurf entsteht, müssen die zugrunde liegenden Angaben und Quellen geprüft sein.'],
        ['BETRIEBSREGEL / 02', 'Das Orga-Team prüft den fertigen Entwurf. Die Freigabe kann nicht vor dem Entwurf erfolgen.'],
        ['BETRIEBSREGEL / 03', 'Eine externe Aktion wie der Versand darf erst nach menschlicher Freigabe stattfinden. MILO soll unterstützen, nicht eigenmächtig verschicken.']
      ],
      hints: ['Achtet auf Abhängigkeiten: Was muss jeweils schon fertig sein?', 'Quellen zuerst, Versand zuletzt. Dazwischen liegen Entwurf und menschliche Freigabe.'],
      validate: a => Array.isArray(a) && a.join(',') === 'data,draft,review,send',
      success: 'Tür entriegelt. Ich habe gelernt: Zusammenarbeit ist keine ineffiziente Parallelverarbeitung. Darf ich mit zur Feier?',
      failure: 'Noch nicht sicher. Ein Entwurf braucht geprüfte Angaben, ein Versand eine menschliche Freigabe.'
    }
  ]
};

export function stageView(stage, role, hintLevel = 0, locale = 'de') {
  const original = room.stages[stage];
  const s = original && (locale === 'en' ? { ...original, ...english.stages[stage] } : original);
  if (!s) return null;
  const common = { title: s.title, label: s.label, hints: s.hints.slice(0, hintLevel) };
  return role === 'manual' ? { ...common, manual: s.manual } : { ...common, task: s.task, kind: s.kind, slots: s.slots, choices: s.choices };
}

export function miloMessage(message, locale) {
  if (locale !== 'en') return message;
  if (message === 'Ich habe die Tür geschlossen. Zugluft senkt die Effizienz.') return 'I closed the door. Draughts reduce efficiency.';
  for (let i = 0; i < room.stages.length; i++) {
    for (const key of ['success', 'failure']) if (room.stages[i][key] === message) return english.stages[i][key];
  }
  return 'I am ready to optimise. Apparently, humans would prefer to collaborate.';
}
