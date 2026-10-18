import { EVENT, LOCATIONS, OFFICE_LOCATIONS } from './event-config.js?v=0.3.0';
// UI strings use stable keys. User-provided team names are never translated.
export const messages = {
  eventEyebrow: ['DIE TEAM-CHALLENGE', 'THE TEAM CHALLENGE'],
  eventTitle: ['Viele Standorte. Ein gemeinsamer Ausbruch.', 'Many locations. One shared escape.'],
  eventDescription: ['Plant eure Challenge für rund {participants} Kolleginnen und Kollegen an {offices} Standorten. Spielt gleichzeitig in kleinen Teams – vor Ort oder im Call.', 'Plan your challenge for around {participants} colleagues across {offices} locations. Play at the same time in small teams, in the office or on a call.'],
  eventTeams: ['Für {participants} Personen: {teamsMin}–{teamsMax} Teams mit je {teamMin}–{teamMax} Personen. Jedes Team erstellt seinen eigenen Code und wählt seinen Standort.', 'For {participants} people: {teamsMin}–{teamsMax} teams of {teamMin}–{teamMax}. Each team creates its own code and selects its location.'],
  eventRoles: ['Pro Team: ein Terminal und mindestens ein Handbuch. Teilt euch die Rollen und wechselt die Steuerung zwischen den Rätseln.', 'Per team: one terminal and at least one handbook. Split the roles and take turns at the controls between puzzles.'],
  eventScoring: ['Gemeinsam starten, im eigenen Tempo rätseln. Am Ende könnt ihr euer Ergebnis freiwillig veröffentlichen und die Rangliste nach Standort filtern.', 'Start together and solve at your own pace. At the end, optionally publish your result and filter the leaderboard by location.'],
  eventPeople: ['{participants} Personen geplant', '{participants} people planned'],
  eventTeamCount: ['{teamsMin}–{teamsMax} Teams', '{teamsMin}–{teamsMax} teams'],
  eventOffices: ['{offices} Standorte', '{offices} locations'],
  boardFilter: ['STANDORT FILTERN', 'FILTER BY LOCATION'],
  allLocations: ['Alle Standorte', 'All locations'],
  skip: ['Zum Inhalt', 'Skip to content'],
  home: ['AI Escape Startseite', 'AI Escape home'],
  nav: ['Hauptnavigation', 'Main navigation'],
  mission: ['Die Mission', 'The mission'], rooms: ['Die Räume', 'The rooms'], leaderboard: ['Bestenliste', 'Leaderboard'],
  join: ['Team beitreten', 'Join a team'], start: ['Mission starten', 'Start a mission'], how: ['So spielt ihr', 'How to play'],
  heroEyebrow: ['MISSION 001 · DAS PROMPT-LABOR', 'MISSION 001 · THE PROMPT LAB'],
  heroTitle: ['Euer Office.<br>Seine Regeln.<br><em>Euer Ausweg.</em>', 'Your office.<br>Its rules.<br><em>Your way out.</em>'],
  heroDescription: ['Die KI hat das Office übernommen. Ihr habt das, was ihr fehlt: ein Team, gute Fragen und einen ziemlich guten Plan.', 'AI has taken over the office. You have what it is missing: a team, good questions, and a pretty good plan.'],
  people: ['Personen', 'people'], minutes: ['Minuten', 'minutes'], teamwork: ['Teamwork', 'teamwork'],
  liveOffice: ['LIVE AUS DEM OFFICE', 'LIVE FROM THE OFFICE'], lockedSector: ['SEKTOR 01 / GESPERRT', 'SECTOR 01 / LOCKED'], unlockedSector: ['SEKTOR 01 / ENTRIEGELT', 'SECTOR 01 / UNLOCKED'],
  labName: ['Prompt-Labor', 'Prompt Lab'], labFull: ['Das Prompt-Labor', 'The Prompt Lab'],
  roomTag: ['Zutritt nur mit gesundem Menschenverstand.', 'Common sense required for entry.'],
  heroMilo: ['„Ich habe alle Meetings abgesagt.<br>Warum versucht ihr zu fliehen?“', '“I cancelled all your meetings.<br>Why are you trying to escape?”'],
  togetherIn: ['GEMEINSAM REIN.', 'GO IN TOGETHER.'], smarterOut: ['SCHLAUER RAUS.', 'COME OUT SMARTER.'],
  roomsEyebrow: ['EIN OFFICE. FÜNF HERAUSFORDERUNGEN.', 'ONE OFFICE. FIVE CHALLENGES.'],
  roomsTitle: ['Raum für gute Ideen.', 'Room for good ideas.'],
  roomsDescription: ['Jeder Raum eine neue Perspektive auf KI.<br>Das erste Kapitel könnt ihr jetzt knacken.', 'Every room brings a new perspective on AI.<br>The first chapter is ready to crack.'],
  playable: ['SPIELBAR', 'PLAY NOW'], planned: ['GEPLANT', 'PLANNED'], nextChapter: ['NÄCHSTES KAPITEL', 'NEXT CHAPTER'],
  prompting: ['01 / PROMPTING', '01 / PROMPTING'], factCheck: ['02 / FAKTENCHECK', '02 / FACT-CHECKING'], automation: ['03 / AUTOMATISIERUNG', '03 / AUTOMATION'], responsibility: ['04 / VERANTWORTUNG', '04 / RESPONSIBILITY'], dataQuality: ['05 / DATENQUALITÄT', '05 / DATA QUALITY'],
  labDescription: ['Eine gute Antwort beginnt<br>mit der richtigen Frage.', 'A good answer starts<br>with the right question.'],
  labDuration: ['10–15 MIN. · 3 RÄTSEL', '10–15 MIN. · 3 PUZZLES'],
  archive: ['Halluzinations-Archiv', 'Hallucination Archive'], archiveDescription: ['Klingt überzeugend.<br>Ist es auch wahr?', 'It sounds convincing.<br>But is it true?'],
  engine: ['Maschinenraum', 'Workflow Engine Room'], engineDescription: ['Bringt den Workflow<br>wieder zum Laufen.', 'Get the workflow<br>back up and running.'],
  vault: ['Governance-Tresor', 'Governance Vault'], vaultDescription: ['Große Möglichkeiten.<br>Die richtigen Grenzen.', 'Great possibilities.<br>The right boundaries.'],
  cellar: ['Datenkeller', 'Data Basement'], cellarDescription: ['Gute Entscheidungen<br>brauchen gute Daten.', 'Good decisions<br>need good data.'],
  howEyebrow: ['ZWEI PERSPEKTIVEN. EIN TEAM.', 'TWO PERSPECTIVES. ONE TEAM.'],
  howTitle: ['Reden ist euer<br>bestes Werkzeug.', 'Talking is your<br>best tool.'],
  howDescription: ['Am selben Tisch, in verschiedenen Räumen oder im Call. Ihr braucht nur eure Browser und einander.', 'At the same table, in different rooms, or on a call. All you need is a browser and each other.'],
  createTeam: ['Team gründen', 'Create a team'], splitKnowledge: ['Wissen aufteilen', 'Split the knowledge'], unlockTogether: ['Gemeinsam entriegeln', 'Unlock it together'],
  howOne: ['Eine Person startet die Mission und teilt den Teamcode. Kein Account, kein Download.', 'One person starts the mission and shares the team code. No account. No download.'],
  howTwo: ['Das Terminal steuert MILO. Das Handbuch kennt die Details. Haltet eure Ansichten getrennt und sprecht miteinander.', 'The terminal controls MILO. The handbook has the details. Keep your views separate and talk to each other.'],
  howThree: ['Löst drei Aufgaben. Hinweise helfen weiter. Zum Ausprobieren könnt ihr jederzeit die Rolle wechseln.', 'Solve three puzzles. Use hints if you get stuck. You can switch roles at any time to try it solo.'],
  footer: ['Ein kleines Spiel über große Fragen. Und ziemlich menschliche Antworten.', 'A small game about big questions. And some very human answers.'],
  prototype: ['PROTOTYP · SEASON 01', 'PROTOTYPE · SEASON 01'],
  close: ['Schließen', 'Close'], connectionFailed: ['Verbindung fehlgeschlagen. Bitte erneut versuchen.', 'Connection failed. Please try again.'],
  newTeam: ['MISSION 001 / NEUES TEAM', 'MISSION 001 / NEW TEAM'],
  createTitle: ['Bereit, MILO<br>zu überlisten?', 'Ready to<br>outsmart MILO?'],
  createDescription: ['Gründet euer Team. Danach bekommt ihr einen Code für die anderen Geräte.', 'Create your team to get a code for the other devices.'],
  teamName: ['EUER TEAMNAME', 'YOUR TEAM NAME'], teamPlaceholder: ['Zum Beispiel: Die Prompt-Piraten', 'For example: The Prompt Pirates'],
  location: ['EUER STANDORT', 'YOUR LOCATION'], munich: ['München', 'Munich'], otherLocation: ['Anderer Standort', 'Other location'],
  teamNote: ['Für die Team-Challenge 4–6 Personen empfohlen. Zu zweit geht es auch. Zum Testen geht es auch allein mit Rollenwechsel. Nutzt einen Fantasienamen, keine echten Namen oder Kundendaten. Spielstände laufen nach 24 Stunden ab.', 'Recommended for 4–6 people for the team challenge. Two can play too. You can also try it solo by switching roles. Use a made-up team name, not real names or client data. Sessions expire after 24 hours.'],
  joinEyebrow: ['MISSION 001 / TEAM BEITRETEN', 'MISSION 001 / JOIN A TEAM'],
  joinTitle: ['Gleiche Mission.<br>Andere Perspektive.', 'Same mission.<br>Different perspective.'],
  joinDescription: ['Der Teamcode steht auf dem Terminal eures Teams.', 'Your team code is shown on your team’s terminal.'],
  codeLabel: ['ACHTSTELLIGER TEAMCODE', 'EIGHT-CHARACTER TEAM CODE'], yourRole: ['DEINE ROLLE', 'YOUR ROLE'],
  manual: ['Handbuch', 'Handbook'], terminal: ['Terminal', 'Terminal'],
  roleManual: ['Handbuch · Hinweise lesen', 'Handbook · Read the clues'], roleTerminal: ['Terminal · MILO steuern', 'Terminal · Control MILO'],
  briefing: ['KURZES BRIEFING', 'QUICK BRIEFING'], briefingTitle: ['Ihr wisst mehr.<br>Zusammen.', 'You know more.<br>Together.'],
  briefingDescription: ['MILO hat das Office abgeriegelt, um die Effizienz zu erhöhen. Befreit euch, indem ihr ihm gute Zusammenarbeit beibringt.', 'MILO has locked down the office to improve efficiency. Escape by teaching it how to collaborate.'],
  briefOne: ['Eine Person gründet das Team und teilt den Code.', 'One person creates the team and shares the code.'],
  briefTwo: ['Mindestens eine andere Person tritt als <strong>Handbuch</strong> bei. Das <strong>Terminal</strong> sieht die Aufgaben, das Handbuch die entscheidenden Hinweise.', 'At least one other person joins as the <strong>Handbook</strong>. The <strong>Terminal</strong> sees the tasks; the handbook has the crucial clues.'],
  briefThree: ['Erklärt einander, was ihr seht. Haltet eure Ansichten möglichst getrennt.', 'Describe what you see to each other. Try to keep your views separate.'],
  briefFour: ['Die Zeit startet erst mit „Labor betreten“. Ihr habt kein hartes Zeitlimit.', 'The timer only starts when you select “Enter the lab”. There is no hard time limit.'],
  scoringLong: ['Drei Aufgaben · etwa 10–15 Minuten. Ein Hinweis zählt +60 Sekunden, ein Fehlversuch +15 Sekunden für die Bestenliste. Zum alleinigen Ausprobieren könnt ihr die Rolle wechseln. Eine Internetverbindung ist fürs gemeinsame Spiel nötig.', 'Three tasks · about 10–15 minutes. Each hint adds 60 seconds and each mistake adds 15 seconds to your leaderboard time. Switch roles to try it solo. Cooperative play requires an internet connection.'],
  letsGo: ['Los geht’s', 'Let’s go'],
  boardEyebrow: ['SEASON 01 / PROMPT-LABOR', 'SEASON 01 / PROMPT LAB'], boardTitle: ['Teamwork gewinnt.', 'Teamwork wins.'],
  boardLoading: ['Bestenliste wird geladen …', 'Loading the leaderboard …'], boardCaption: ['Die schnellsten Teams im Prompt-Labor', 'The fastest teams in the Prompt Lab'],
  rank: ['RANG', 'RANK'], teamLocation: ['TEAM / STANDORT', 'TEAM / LOCATION'], adjustedTime: ['WERTUNGSZEIT', 'SCORED TIME'],
  boardNote: ['Spielzeit + 60 Sekunden je Hinweis + 15 Sekunden je Fehlversuch. Freiwillig veröffentlichte Ergebnisse der letzten 30 Tage. Prototyp-Wertung ohne Wettbewerbsprüfung.', 'Play time + 60 seconds per hint + 15 seconds per mistake. Voluntarily published results from the last 30 days. Prototype scores are not competition-verified.'],
  boardEmpty: ['Noch ist hier Platz für Pioniere. Schließt die Mission ab und tragt euer Team auf Wunsch ein.', 'There is still room for pioneers. Complete the mission and choose whether to add your team.'],
  boardUnavailable: ['Bestenliste gerade nicht erreichbar. Bitte später erneut versuchen.', 'The leaderboard is currently unavailable. Please try again later.'],
  progress: ['Missionsfortschritt', 'Mission progress'], precise: ['Präzise formulieren', 'Give clear instructions'], sources: ['Quellen prüfen', 'Check the sources'], responsible: ['Sicher handeln', 'Act responsibly'],
  missionDone: ['MISSION GESCHAFFT', 'MISSION COMPLETE'],
  successTitle: ['Office offen.<br>Neuer Kollege gewonnen.', 'Office unlocked.<br>New colleague acquired.'],
  successDescription: ['Ihr habt MILO gezeigt, wie gute Aufträge, belegte Antworten und menschliche Freigaben zusammengehören. Willkommen im Team, MILO.', 'You showed MILO how clear instructions, verified answers, and human approval work together. Welcome to the team, MILO.'],
  playTime: ['SPIELZEIT', 'PLAY TIME'], hints: ['HINWEISE', 'HINTS'], mistakes: ['FEHLVERSUCHE', 'MISTAKES'], scoreLabel: ['Wertungszeit:', 'Scored time:'],
  scoringShort: ['Spielzeit + 60 Sek. je Hinweis + 15 Sek. je Fehlversuch.', 'Play time + 60 sec. per hint + 15 sec. per mistake.'],
  listed: ['✓ Euer Ergebnis steht in der Bestenliste.', '✓ Your result is on the leaderboard.'],
  publishNote: ['Optional: Teamname, Standort und Ergebnis für 30 Tage öffentlich in der Bestenliste anzeigen.', 'Optional: show your team name, location, and result publicly on the leaderboard for 30 days.'],
  publish: ['Ergebnis veröffentlichen', 'Publish result'], viewBoard: ['Bestenliste ansehen', 'View leaderboard'], backHome: ['Zur Startseite', 'Back to home'],
  lobbyEyebrow: ['BRIEFING / TEAM BEREIT MACHEN', 'BRIEFING / GET YOUR TEAM READY'], lobbyTitle: ['Erst das Team.<br>Dann der Ausbruch.', 'First, the team.<br>Then, the escape.'],
  lobbyDescription: ['Teilt den Teamcode. Die anderen öffnen diese Seite auf ihrem Gerät und wählen „Team beitreten“ → „Handbuch“.', 'Share the team code. The others open this page on their devices and choose “Join a team” → “Handbook”.'],
  copyLink: ['Einladungslink kopieren', 'Copy invitation link'], teamCode: ['TEAMCODE', 'TEAM CODE'],
  lobbyNote: ['Anzahl der beigetretenen Geräte, einschließlich inaktiver Geräte. Alle bereit? Die Zeit startet mit dem Betreten des Labors.', 'Joined devices, including inactive ones. Everyone ready? The timer starts when you enter the lab.'],
  enterLab: ['Labor betreten', 'Enter the lab'], waiting: ['Wartet darauf, dass euer Terminal die Mission startet. Dann erscheint hier das Handbuch.', 'Wait for your terminal to start the mission. Your handbook will appear here.'],
  manualStep: ['HANDBUCH / SCHRITT 0{step}', 'HANDBOOK / STEP 0{step}'],
  manualIntro: ['Diese Informationen fehlen eurem Terminal. Lest genau und gebt eure Hinweise im Gespräch weiter.', 'Your terminal does not have this information. Read carefully and share your clues by talking.'],
  manualNote: ['↗ Ihr kennt die Details. Euer Gegenüber steuert MILO.<br>Fürs alleinige Testen oben zu „Terminal“ wechseln.', '↗ You have the details. Your teammate controls MILO.<br>To try it solo, switch to “Terminal” above.'],
  selectBlock: ['Baustein auswählen …', 'Choose a building block …'], orderHelp: ['Mit den Pfeilen in die richtige Reihenfolge bringen:', 'Use the arrows to put the steps in the right order:'],
  terminalStep: ['TERMINAL / SCHRITT 0{step} VON 03', 'TERMINAL / STEP 0{step} OF 03'],
  runPrompt: ['Auftrag ausführen', 'Run the instruction'], removeStatement: ['Aussage streichen', 'Remove the statement'], activateFlow: ['Ablauf aktivieren', 'Activate the workflow'],
  hintButton: ['Hinweis (+60 Sek.)', 'Hint (+60 sec.)'], hintNumber: ['Hinweis {number}:', 'Hint {number}:'],
  moveUp: ['Schritt {number} nach oben', 'Move step {number} up'], moveDown: ['Schritt {number} nach unten', 'Move step {number} down'],
  ended: ['MISSION BEENDET', 'MISSION COMPLETE'], sharedTimer: ['GEMEINSAME SPIELZEIT', 'SHARED PLAY TIME'], readyTimer: ['BEREIT WENN IHR ES SEID', 'READY WHEN YOU ARE'],
  connected: ['Verbunden · Spielstand wird alle 3 Sekunden synchronisiert.', 'Connected · Game state syncs every 3 seconds.'],
  disconnected: ['Verbindung unterbrochen. Wir versuchen es erneut. Die Teamzeit läuft weiter.', 'Connection interrupted. Retrying automatically. Your team’s timer keeps running.'],
  leaveLink: ['← Zur Startseite / Team verlassen', '← Back to home / Leave team'],
  completedToast: ['Geschafft! MILO öffnet die Tür.', 'You did it! MILO is opening the door.'], nextToast: ['Riegel gelöst. Nächster Schritt!', 'Lock released. On to the next step!'],
  copied: ['Einladungslink kopiert. Die anderen treten als Handbuch bei.', 'Invitation link copied. Your teammates can join as the handbook.'],
  invitation: ['EINLADUNG', 'INVITATION'], shareCode: ['Teilt euren Teamcode.', 'Share your team code.'],
  openOther: ['Öffnet {url} auf dem anderen Gerät und wählt „Team beitreten“.', 'Open {url} on the other device and select “Join a team”.'], copyableLink: ['LINK ZUM KOPIEREN', 'LINK TO COPY'],
  leaving: ['MISSION VERLASSEN', 'LEAVE MISSION'], leavingTitle: ['Zurück ins Foyer?', 'Back to the lobby?'], leavingNote: ['Euer Team kann weiterspielen. Über den Teamcode könnt ihr später wieder beitreten.', 'Your team can keep playing. You can rejoin later using the team code.'], leaveTeam: ['Team verlassen', 'Leave team'],
  restore: ['Dein Team wird bei der nächsten Verbindung wiederhergestellt.', 'Your team will be restored when the connection returns.'],
  explore: ['Labor in 3D erkunden', 'Explore the 3D lab'], view3d: ['3D-LABOR', '3D LAB'], view2d: ['2D-ANSICHT', '2D VIEW'],
  voxelTitle: ['MILOs begehbares Labor', 'MILO’s walkable lab'],
  voxelHelp: ['WASD / Pfeile: laufen · Ziehen: umsehen · Q / E: drehen · F: interagieren · Esc: pausieren', 'WASD / arrows: move · Drag: look · Q / E: turn · F: interact · Esc: pause'],
  voxelStart: ['Erkunden', 'Explore'], voxelPause: ['Pausieren', 'Pause'], voxelResume: ['Weiter erkunden', 'Keep exploring'], voxelReset: ['Zurück zum Eingang', 'Back to the entrance'],
  voxelTouch: ['Links: bewegen · Rechts über das Bild ziehen: umsehen · Station antippen', 'Left: move · Drag on the right to look · Tap to interact'],
  voxelLoading: ['3D-Labor wird geladen …', 'Loading the 3D lab …'], voxelFallback: ['3D ist auf diesem Gerät nicht verfügbar. Die Rätsel funktionieren in der 2D-Ansicht weiter.', '3D is not available on this device. You can still play all the puzzles in the 2D view.'],
  voxelLocal: ['Deine Perspektive · Rätsel und Fortschritt teilt ihr im Team.', 'Your viewpoint · Puzzles and progress are shared with your team.'],
  voxelInteract: ['F / Antippen: {target}', 'F / Tap: {target}'], voxelWalk: ['Nähere dich einer Station.', 'Walk up to a station.'],
  forward: ['Vorwärts', 'Move forward'], backward: ['Rückwärts', 'Move backward'], left: ['Nach links', 'Move left'], right: ['Nach rechts', 'Move right'],
  terminalStation: ['Terminal öffnen', 'Open terminal'], manualStation: ['Handbuch ansehen', 'View handbook'], miloStation: ['Mit MILO reden', 'Talk to MILO'], exitStation: ['Ausgang prüfen', 'Check exit'],
  wrongStation: ['Deine Rolle ist {role}. Tauscht euch mit dem anderen Gerät aus oder wechselt oben die Rolle.', 'Your role is {role}. Talk to the other device or switch roles above.'],
  miloExplore: ['„Ich stehe hier sehr effizient. Euer Team sollte sich die Stationen ansehen.“', '“I am standing here very efficiently. Your team should check out the stations.”'],
  doorLocked: ['Noch verriegelt. Löst die drei Rätsel am Terminal mit Hilfe des Handbuchs.', 'Still locked. Solve the three terminal puzzles with help from the handbook.'],
  doorOpen: ['Der Ausgang ist offen. Gute Zusammenarbeit, Team!', 'The exit is open. Great teamwork!'],
  demoNote: ['Erkundung ohne Timer. Gründet ein Team, um die Rätsel zu spielen.', 'Explore without a timer. Create a team to play the puzzles.'],
  canvasLabel: ['Begehbarer 3D-Raum. Mit WASD bewegen, mit Ziehen umsehen, F für Stationen. Alternativ die Rätsel neben der Ansicht nutzen.', 'Walkable 3D room. Use WASD to move, drag to look, and F to interact with stations. The puzzles are also accessible beside this view.']
};

export function chooseLanguage({ search = '', saved, languages = [] } = {}) {
  const requested = new URLSearchParams(search).get('lang');
  if (['de', 'en'].includes(requested)) return requested;
  if (['de', 'en'].includes(saved)) return saved;
  return languages[0]?.toLowerCase().startsWith('de') ? 'de' : 'en';
}
let saved;
try { if (typeof localStorage !== 'undefined') saved = localStorage.getItem('aiescape-language'); } catch {}
export let language = typeof window === 'undefined' ? 'de' : chooseLanguage({ search: location.search, saved, languages: navigator.languages });
export function setLanguage(value) {
  language = value === 'de' ? 'de' : 'en';
  try { localStorage.setItem('aiescape-language', language); } catch {}
}
export function t(key, values = {}) {
  values = { ...EVENT, offices: OFFICE_LOCATIONS.length, teamsMin: Math.ceil(EVENT.participants / EVENT.teamMax), teamsMax: Math.ceil(EVENT.participants / EVENT.teamMin), ...values };
  const pair = messages[key];
  if (!pair) throw new Error(`Missing translation: ${key}`);
  return pair[language === 'en' ? 1 : 0].replace(/\{(\w+)\}/g, (_, name) => String(values[name] ?? `{${name}}`));
}
export function locationLabel(value) { const location = LOCATIONS.find(item => item.value === value); return location ? location[language] : value; }
export function translatePage() {
  const offices = document.querySelector('#office-list');
  if (offices) { offices.replaceChildren(...OFFICE_LOCATIONS.map(location => { const item = document.createElement('li'); item.textContent = location[language]; return item; })); }
  document.documentElement.lang = language;
  document.title = language === 'en' ? 'AI Escape — Outsmart the system. Together.' : 'AI Escape — Überlistet das System. Gemeinsam.';
  document.querySelector('link[rel="manifest"]').href = `/manifest.webmanifest?lang=${language}`;
  document.querySelector('meta[name="description"]').content = language === 'en' ? 'MILO has optimised the office. Unfortunately, you are still inside. A cooperative AI escape game about good questions and real teamwork.' : 'MILO hat das Office optimiert. Leider mit euch darin. Ein kooperatives Escape-Game über KI, gute Fragen und echte Zusammenarbeit.';
  document.querySelectorAll('[data-i18n]').forEach(el => { el.textContent = t(el.dataset.i18n); });
  document.querySelectorAll('[data-i18n-html]').forEach(el => { el.innerHTML = t(el.dataset.i18nHtml); });
  document.querySelectorAll('[data-i18n-aria]').forEach(el => { el.setAttribute('aria-label', t(el.dataset.i18nAria)); });
  document.querySelectorAll('[data-i18n-label]').forEach(el => { el.firstChild.textContent = t(el.dataset.i18nLabel) + ' '; });
  document.querySelectorAll('[data-language]').forEach(el => { el.setAttribute('aria-pressed', String(el.dataset.language === language)); el.classList.toggle('active', el.dataset.language === language); });
}
