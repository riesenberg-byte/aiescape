// Inert documentation example; see README.md before attempting integration.
import { english } from './coffee-break.en.js';

export const room = {
  id: 'coffee-break', title: 'Eine sehr effiziente Kaffeepause', duration: '5–8 Min.',
  stages: [
    {
      title: 'Auch eine Pause braucht einen Auftrag', label: 'Auftrag klären', kind: 'slots',
      task: 'NOVA möchte eine Kaffeepause planen. Fragt das Handbuch, für wen sie gedacht ist und wie lange sie dauern soll.',
      slots: [
        { id: 'audience', label: 'Für wen?', options: [['clients', 'Kunden'], ['team', 'Das Team']] },
        { id: 'duration', label: 'Wie lange?', options: [['ten', '10 Minuten'], ['sixty', '60 Minuten']] }
      ],
      manual: [['TEAMNOTIZ', 'Die Pause ist intern für das Team, ohne Kunden.'], ['ZEITPLAN', 'Das vereinbarte Zeitfenster dauert 10 Minuten.']],
      hints: ['Bestätigt Zielgruppe und Dauer.', 'Nutzt das interne Team-Zeitfenster statt eines Kundentermins.'],
      validate: answer => answer?.audience === 'team' && answer?.duration === 'ten',
      success: 'Zehn Minuten für das Team. Ich hatte ein ganzes Quartal reserviert.',
      failure: 'Das passt noch nicht zu Teamnotiz und Zeitplan. Vergleicht beide.'
    },
    {
      title: 'Steht das wirklich in der Richtlinie?', label: 'Aussage prüfen', kind: 'choice',
      task: 'Welche Aussage ist nicht belegt? Die ursprüngliche Richtliniennotiz liegt im Handbuch.',
      choices: [['A', 'Diese Pause dauert 10 Minuten.', 'Team-Zeitplan'], ['B', 'Jede Pause muss mindestens eine Stunde dauern.', 'Angebliche Richtlinie']],
      manual: [['RICHTLINIENNOTIZ', 'Die vereinbarte Pause dauert 10 Minuten. Eine Mindestdauer von einer Stunde ist nicht festgelegt.']],
      hints: ['Vergleicht die Behauptung mit der echten Richtliniennotiz.', 'Auch eine genau klingende Regel braucht eine Quelle.'],
      validate: answer => answer === 'B',
      success: 'Die Mindestdauer von einer Stunde war erfunden. Ziemlich ambitioniert.',
      failure: 'Diese Aussage ist durch die Notiz belegt. Prüft die andere Behauptung.'
    },
    {
      title: 'Ein sicherer Plan', label: 'Abhängigkeiten beachten', kind: 'order',
      task: 'Ordnet die Planungsschritte. Im Handbuch stehen ihre Abhängigkeiten.',
      choices: [['approve', 'Den Plan vom Team freigeben lassen'], ['draft', 'Den Pausenplan entwerfen'], ['check', 'Die vereinbarten Angaben prüfen']],
      manual: [['ABHÄNGIGKEITEN', 'Vor dem Entwurf werden die Angaben geprüft. Das Team gibt den fertigen Entwurf frei.']],
      hints: ['Welcher Schritt benötigt das Ergebnis eines anderen?', 'Prüfen zuerst, Freigabe zuletzt.'],
      validate: answer => Array.isArray(answer) && answer.join(',') === 'check,draft,approve',
      success: 'Plan freigegeben. Ich übe jetzt produktives Nichtstun.',
      failure: 'Die Freigabe braucht einen Entwurf, der Entwurf geprüfte Angaben.'
    }
  ]
};

export function stageView(index, role, hintLevel = 0, locale = 'de') {
  const original = room.stages[index];
  if (!original) return null;
  const stage = locale === 'en' ? { ...original, ...english.stages[index] } : original;
  const common = { title: stage.title, label: stage.label, hints: stage.hints.slice(0, hintLevel) };
  return role === 'manual'
    ? { ...common, manual: stage.manual }
    : { ...common, task: stage.task, kind: stage.kind, slots: stage.slots, choices: stage.choices };
}

export function novaMessage(message, locale) {
  if (locale !== 'en') return message;
  for (let i = 0; i < room.stages.length; i++) {
    for (const key of ['success', 'failure']) {
      if (room.stages[i][key] === message) return english.stages[i][key];
    }
  }
  return 'Let us plan a very efficient coffee break.';
}
