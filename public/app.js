const $ = selector => document.querySelector(selector);
const escape = value => String(value ?? '').replace(/[&<>"']/g, char => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[char]));
const dialog = $('#dialog');
let token = sessionStorage.getItem('aiescape-token');
let state = null, busy = false, pollBusy = false, pollTimer = null, toastTimer, serverOffset = 0;
let order = [], rendered = '', boardRequest = 0, actionEpoch = 0;
const time = seconds => `${String(Math.floor(Math.max(0, seconds) / 60)).padStart(2, '0')}:${String(Math.floor(Math.max(0, seconds) % 60)).padStart(2, '0')}`;
const arrow = '<span aria-hidden="true">↗</span>';

function toast(message) { $('#toast').textContent = message; $('#toast').classList.remove('hidden'); clearTimeout(toastTimer); toastTimer = setTimeout(() => $('#toast').classList.add('hidden'), 6000); }
async function request(path, data) {
  const response = await fetch(path, {
    method: data === undefined ? 'GET' : 'POST',
    headers: { ...(data === undefined ? {} : { 'Content-Type':'application/json' }), ...(token ? { Authorization:`Bearer ${token}` } : {}) },
    body: data === undefined ? undefined : JSON.stringify(data), signal: AbortSignal.timeout(12000)
  });
  const result = await response.json();
  if (!response.ok) { const error = new Error(result.error || 'Verbindung fehlgeschlagen.'); error.status = response.status; throw error; }
  return result;
}
function showDialog(html) { $('#dialog-content').innerHTML = html; if (!dialog.open) dialog.showModal(); }
function createDialog() {
  showDialog(`<div class="eyebrow">MISSION 001 / NEUES TEAM</div><h2>Bereit, NOVA<br>zu überlisten?</h2><p>Gründet euer Team. Danach bekommt ihr einen Code für die anderen Geräte.</p>
    <form id="create-form" class="form"><label>EUER TEAMNAME<input name="team" placeholder="Zum Beispiel: Die Prompt-Piraten" required minlength="2" maxlength="40" autocomplete="off"></label>
    <label>EUER STANDORT<select name="location"><option>Remote</option><option>Berlin</option><option>München</option><option>Frankfurt</option><option>Anderer Standort</option></select></label>
    <p class="form-note">2–6 Personen empfohlen. Zum Testen geht es auch allein mit Rollenwechsel. Nutzt einen Fantasienamen, keine echten Namen oder Kundendaten. Spielstände laufen nach 24 Stunden ab.</p>
    <div class="error" id="form-error" role="alert"></div><button class="button primary" type="submit">Team gründen ${arrow}</button></form>`);
}
function joinDialog(code = '') {
  showDialog(`<div class="eyebrow">MISSION 001 / TEAM BEITRETEN</div><h2>Gleiche Mission.<br>Andere Perspektive.</h2><p>Der Teamcode steht auf dem Terminal eures Teams.</p>
    <form id="join-form" class="form"><label>ACHTSTELLIGER TEAMCODE<input class="code" name="code" value="${escape(code)}" placeholder="XXXXXXXX" required minlength="8" maxlength="10" autocomplete="off" spellcheck="false"></label>
    <label>DEINE ROLLE<select name="role"><option value="manual">Handbuch · Hinweise lesen</option><option value="terminal">Terminal · NOVA steuern</option></select></label>
    <div class="error" id="form-error" role="alert"></div><button class="button primary" type="submit">Team beitreten ${arrow}</button></form>`);
}
function howDialog() {
  showDialog(`<div class="eyebrow">KURZES BRIEFING</div><h2>Ihr wisst mehr.<br>Zusammen.</h2><p>NOVA hat das Office abgeriegelt, um die Effizienz zu erhöhen. Befreit euch, indem ihr ihm gute Zusammenarbeit beibringt.</p>
  <ol class="lobby-step"><li>Eine Person gründet das Team und teilt den Code.</li><li>Mindestens eine andere Person tritt als <strong>Handbuch</strong> bei. Das <strong>Terminal</strong> sieht die Aufgaben, das Handbuch die entscheidenden Hinweise.</li><li>Erklärt einander, was ihr seht. Haltet eure Ansichten möglichst getrennt.</li><li>Die Zeit startet erst mit „Labor betreten“. Ihr habt kein hartes Zeitlimit.</li></ol>
  <p class="form-note">Drei Aufgaben · etwa 10–15 Minuten. Ein Hinweis zählt +60 Sekunden, ein Fehlversuch +15 Sekunden für die Bestenliste. Zum alleinigen Ausprobieren könnt ihr die Rolle wechseln. Eine Internetverbindung ist fürs gemeinsame Spiel nötig.</p>
  <button class="button primary" data-action="create">Los geht’s ${arrow}</button>`);
}
async function leaderboard() {
  const id = ++boardRequest;
  showDialog('<div class="eyebrow">SEASON 01 / PROMPT-LABOR</div><h2>Teamwork gewinnt.</h2><p id="board-content" role="status">Bestenliste wird geladen …</p>');
  try {
    const { entries } = await request('/api/leaderboard');
    if (id !== boardRequest || !$('#board-content')) return;
    $('#board-content').outerHTML = entries.length ? `<table class="leaderboard"><caption class="visually-hidden">Die schnellsten Teams im Prompt-Labor</caption><thead><tr><th>RANG</th><th>TEAM / STANDORT</th><th>WERTUNGSZEIT</th></tr></thead><tbody>${entries.map((e,i) => `<tr><td>${String(i+1).padStart(2,'0')}</td><td>${escape(e.team)}<small>${escape(e.location)}</small></td><td>${time(e.score)}</td></tr>`).join('')}</tbody></table><p class="form-note">Spielzeit + 60 Sekunden je Hinweis + 15 Sekunden je Fehlversuch. Freiwillig veröffentlichte Ergebnisse der letzten 30 Tage. Prototyp-Wertung ohne Wettbewerbsprüfung.</p>` : '<p>Noch ist hier Platz für Pioniere. Schließt die Mission ab und tragt euer Team auf Wunsch ein.</p>';
  } catch { if ($('#board-content')) $('#board-content').textContent = 'Bestenliste gerade nicht erreichbar. Bitte später erneut versuchen.'; }
}
function playerCounts() {
  return `<span>TERMINAL: ${state.players.find(p => p.role === 'terminal')?.count || 0}</span><span>HANDBUCH: ${state.players.find(p => p.role === 'manual')?.count || 0}</span>`;
}
function scene() {
  const labels = ['Präzise formulieren','Quellen prüfen','Sicher handeln'];
  return `<aside class="game-scene"><div class="eyebrow">SEKTOR 01 / ${state.finishedAt ? 'ENTRIEGELT' : 'GESPERRT'}</div><img src="/lab.svg" alt="NOVAs Prompt-Labor">
  <div class="nova-bubble" role="status"><span class="nova-mini" aria-hidden="true">• •</span><div><strong>NOVA <span>OFFICE OPTIMIZATION AGENT</span></strong><p>${escape(state.message)}</p></div></div>
  <div class="progress-list" aria-label="Missionsfortschritt">${labels.map((label,i) => `<div class="progress-item ${i < state.stage ? 'done' : i === state.stage ? 'current' : ''}"><span>${i < state.stage ? '✓' : '0'+(i+1)}</span>${label}</div>`).join('')}</div></aside>`;
}
function puzzle() {
  if (state.finishedAt) return `<div class="success-mark" aria-hidden="true">↗</div><div class="eyebrow">MISSION GESCHAFFT</div><h3>Office offen.<br>Neuer Kollege gewonnen.</h3><p class="task">Ihr habt NOVA gezeigt, wie gute Aufträge, belegte Antworten und menschliche Freigaben zusammengehören. Willkommen im Team, NOVA.</p>
    <div class="success-stats"><div><strong>${time((state.finishedAt-state.startedAt)/1000)}</strong><span>SPIELZEIT</span></div><div><strong>${state.hints}</strong><span>HINWEISE</span></div><div><strong>${state.mistakes}</strong><span>FEHLVERSUCHE</span></div></div>
    <p>Wertungszeit: <strong>${time(state.score)}</strong></p><p class="success-note">Spielzeit + 60 Sek. je Hinweis + 15 Sek. je Fehlversuch.</p>
    ${state.listed ? '<p class="manual-instruction">✓ Euer Ergebnis steht in der Bestenliste.</p>' : '<p class="success-note">Optional: Teamname, Standort und Ergebnis für 30 Tage öffentlich in der Bestenliste anzeigen.</p><button class="button primary" data-action="publish">Ergebnis veröffentlichen '+arrow+'</button>'}
    <div class="puzzle-actions"><button class="text-button" data-action="leaderboard">Bestenliste ansehen ↗</button><button class="text-button" data-action="leave">Zur Startseite ↗</button></div>`;
  if (!state.startedAt) return `<div class="eyebrow">BRIEFING / TEAM BEREIT MACHEN</div><h3>Erst das Team.<br>Dann der Ausbruch.</h3><p class="task">Teilt den Teamcode. Die anderen öffnen diese Seite auf ihrem Gerät und wählen „Team beitreten“ → „Handbuch“.</p>
    <div class="lobby-code">${escape(state.code)}</div><button class="button small outline" data-action="invite">Einladungslink kopieren ${arrow}</button>
    <div class="player-counts" id="player-counts">${playerCounts()}</div><p class="form-note">Anzahl der beigetretenen Geräte, einschließlich inaktiver Geräte. Alle bereit? Die Zeit startet mit dem Betreten des Labors.</p>
    ${state.role === 'terminal' ? '<button class="button primary" data-action="start">Labor betreten '+arrow+'</button>' : '<p class="manual-instruction">Wartet darauf, dass euer Terminal die Mission startet. Dann erscheint hier das Handbuch.</p>'}`;
  const p = state.puzzle;
  if (state.role === 'manual') return `<div class="eyebrow">HANDBUCH / SCHRITT 0${state.stage+1}</div><h3>${escape(p.title)}</h3><p class="task">Diese Informationen fehlen eurem Terminal. Lest genau und gebt eure Hinweise im Gespräch weiter.</p>
    ${p.manual.map(([title,text]) => `<article class="manual-note"><h4>${escape(title)}</h4><p>${escape(text)}</p></article>`).join('')}
    <p class="manual-instruction">↗ Ihr kennt die Details. Euer Gegenüber steuert NOVA.<br>Fürs alleinige Testen oben zu „Terminal“ wechseln.</p>${hints()}`;
  let fields = '';
  if (p.kind === 'slots') fields = p.slots.map(slot => `<label class="slot"><span>${escape(slot.label)}</span><select class="slot-select" name="${escape(slot.id)}" required><option value="">Baustein auswählen …</option>${slot.options.map(([value,label]) => `<option value="${escape(value)}">${escape(label)}</option>`).join('')}</select></label>`).join('');
  if (p.kind === 'choice') fields = p.choices.map(([id,text,source]) => `<label class="choice"><input type="radio" name="answer" value="${escape(id)}" required><span><b>${id}.</b> ${escape(text)}<small>${escape(source)}</small></span></label>`).join('');
  if (p.kind === 'order') { order = p.choices.map(([id]) => id); fields = '<p class="form-note">Mit den Pfeilen in die richtige Reihenfolge bringen:</p><ol class="order-list" id="order-list"></ol>'; }
  return `<div class="eyebrow">TERMINAL / SCHRITT 0${state.stage+1} VON 03</div><h3 tabindex="-1" id="puzzle-title">${escape(p.title)}</h3><p class="task">${escape(p.task)}</p>
    <form id="answer-form">${fields}<div class="puzzle-actions"><button class="button primary" type="submit">${p.kind === 'slots' ? 'Auftrag ausführen' : p.kind === 'choice' ? 'Aussage streichen' : 'Ablauf aktivieren'} ${arrow}</button><button class="hint-button" type="button" data-action="hint" ${p.hints.length >= 2 ? 'disabled' : ''}>Hinweis (+60 Sek.)</button></div></form>${hints()}`;
}
function hints() { return state.puzzle?.hints.map((hint,i) => `<div class="hint"><strong>Hinweis ${i+1}:</strong> ${escape(hint)}</div>`).join('') || ''; }
function renderOrder() {
  if (!$('#order-list')) return;
  $('#order-list').innerHTML = order.map((id,i) => `<li class="order-item"><span>${escape(state.puzzle.choices.find(c => c[0] === id)[1])}</span><button type="button" data-move="${i}" data-direction="-1" aria-label="Schritt ${i+1} nach oben" ${i===0?'disabled':''}>↑</button><button type="button" data-move="${i}" data-direction="1" aria-label="Schritt ${i+1} nach unten" ${i===order.length-1?'disabled':''}>↓</button></li>`).join('');
}
function renderGame(force = false) {
  if (!state) return;
  serverOffset = state.serverTime - Date.now();
  const key = `${state.code}:${state.revision}:${state.role}:${state.listed}`;
  if (key === rendered && !force) { if ($('#player-counts')) $('#player-counts').innerHTML = playerCounts(); updateTimer(); return; }
  rendered = key;
  $('#home').classList.add('hidden'); $('#game').classList.remove('hidden');
  $('#game').innerHTML = `<div class="game-top"><div><div class="eyebrow">SEASON 01 / MISSION 001</div><h2>Das Prompt-Labor</h2><div class="game-team">${escape(state.team)} · ${escape(state.location)}</div></div><div><div class="timer" id="timer">00:00</div><div class="timer-label">${state.finishedAt?'MISSION BEENDET':state.startedAt?'GEMEINSAME SPIELZEIT':'BEREIT WENN IHR ES SEID'}</div></div></div>
    <div class="game-tools"><div class="role-switch" aria-label="Deine Rolle"><button data-role="terminal" class="${state.role==='terminal'?'active':''}" aria-pressed="${state.role==='terminal'}">&gt;_ Terminal</button><button data-role="manual" class="${state.role==='manual'?'active':''}" aria-pressed="${state.role==='manual'}">▤ Handbuch</button></div><button class="code-button" data-action="invite" aria-label="Einladungslink kopieren">TEAMCODE <b>${escape(state.code)}</b> ↗</button></div>
    <div class="game-grid">${scene()}<section class="puzzle-panel" aria-label="${state.role==='manual'?'Handbuch':'Terminal'}">${puzzle()}</section></div><div class="status-line" id="connection-status" aria-live="polite">Verbunden · Spielstand wird alle 3 Sekunden synchronisiert.</div><button class="leave-button" data-action="leave">← Zur Startseite / Team verlassen</button>`;
  renderOrder(); updateTimer();
}
function updateTimer() {
  if (!state || !$('#timer')) return;
  const end = state.finishedAt || (Date.now()+serverOffset);
  $('#timer').textContent = state.startedAt ? time((end-state.startedAt)/1000) : '00:00';
}
async function poll() {
  if (!token || busy || pollBusy || document.hidden) return;
  pollBusy = true;
  const epoch = actionEpoch;
  try {
    const latest = await request('/api/state');
    if (epoch !== actionEpoch || busy || !token) return;
    state = latest; renderGame();
    if ($('#connection-status')) { $('#connection-status').textContent = 'Verbunden · Spielstand wird alle 3 Sekunden synchronisiert.'; $('#connection-status').classList.remove('offline'); }
  } catch (error) {
    if ([401,410].includes(error.status)) { leave(); toast(error.message); }
    else if ($('#connection-status')) { $('#connection-status').textContent = 'Verbindung unterbrochen. Wir versuchen es erneut. Die Teamzeit läuft weiter.'; $('#connection-status').classList.add('offline'); }
  } finally { pollBusy = false; }
}
function begin(result) {
  actionEpoch++;
  token = result.token; sessionStorage.setItem('aiescape-token',token); state = result.state; rendered=''; dialog.close(); renderGame();
  clearInterval(pollTimer); pollTimer = setInterval(poll,3000); $('#game').scrollIntoView({behavior:'instant'});
}
async function action(data) {
  if (busy) return;
  actionEpoch++;
  busy = true;
  document.querySelectorAll('#game button, #game input, #game select').forEach(b => { b.disabled = true; });
  try { const oldStage = state.stage; state = await request('/api/action', { ...data, revision:state.revision }); renderGame(true); if (state.stage !== oldStage) { $('#puzzle-title')?.focus(); toast(state.finishedAt ? 'Geschafft! NOVA öffnet die Tür.' : 'Riegel gelöst. Nächster Schritt!'); } }
  catch (error) { toast(error.message || 'Verbindung fehlgeschlagen. Bitte erneut versuchen.'); try { state = await request('/api/state'); } catch {} renderGame(true); }
  finally { busy = false; }
}
function leave() {
  actionEpoch++;
  clearInterval(pollTimer); sessionStorage.removeItem('aiescape-token'); token=null; state=null; rendered='';
  $('#game').classList.add('hidden'); $('#home').classList.remove('hidden'); dialog.close(); window.scrollTo({top:0,behavior:'instant'});
}
async function copyInvite() {
  const url = `${location.origin}/?join=${encodeURIComponent(state.code)}`;
  try { await navigator.clipboard.writeText(url); toast('Einladungslink kopiert. Die anderen treten als Handbuch bei.'); }
  catch { showDialog(`<div class="eyebrow">EINLADUNG</div><h2>Teilt euren Teamcode.</h2><div class="lobby-code">${escape(state.code)}</div><p>Öffnet ${escape(location.origin)} auf dem anderen Gerät und wählt „Team beitreten“.</p><label class="field-label">LINK ZUM KOPIEREN<input class="slot-select" value="${escape(url)}" readonly></label>`); }
}
document.addEventListener('click', async event => {
  const role = event.target.closest('[data-role]');
  if (role && state) { if (role.dataset.role !== state.role) await action({type:'role',role:role.dataset.role}); return; }
  const move = event.target.closest('[data-move]');
  if (move) { const i=Number(move.dataset.move),j=i+Number(move.dataset.direction); if (j>=0 && j<order.length) { [order[i],order[j]]=[order[j],order[i]];renderOrder(); const next=$(`[data-move="${j}"][data-direction="${move.dataset.direction}"]`); if (next && !next.disabled) next.focus(); } return; }
  const el = event.target.closest('[data-action]'); if (!el) return;
  switch(el.dataset.action) {
    case 'create': if (state) { dialog.close(); $('#game').scrollIntoView(); } else createDialog(); break;
    case 'join': joinDialog(); break;
    case 'close': dialog.close(); break;
    case 'how': howDialog(); break;
    case 'leaderboard': await leaderboard(); break;
    case 'start': await action({type:'start'}); break;
    case 'hint': await action({type:'hint'}); break;
    case 'publish': await action({type:'publish'}); break;
    case 'invite': await copyInvite(); break;
    case 'leave': if (state && !state.finishedAt) showDialog('<div class="eyebrow">MISSION VERLASSEN</div><h2>Zurück ins Foyer?</h2><p>Euer Team kann weiterspielen. Über den Teamcode könnt ihr später wieder beitreten.</p><button class="button outline" data-action="leave-confirm">Team verlassen ↗</button>'); else leave(); break;
    case 'leave-confirm': leave(); break;
  }
});
document.addEventListener('submit', async event => {
  const form = event.target;
  if (!['create-form','join-form','answer-form'].includes(form.id)) return;
  event.preventDefault(); if (busy) return;
  const values = Object.fromEntries(new FormData(form));
  if (form.id==='answer-form') {
    let answer = values;
    if (state.puzzle.kind==='choice') answer=values.answer;
    if (state.puzzle.kind==='order') answer=[...order];
    await action({type:'answer',answer}); return;
  }
  busy=true; const button=form.querySelector('button[type="submit"]');button.disabled=true;
  try { begin(await request(form.id==='create-form'?'/api/sessions':'/api/join',values)); }
  catch(error) { $('#form-error').textContent=error.message || 'Keine Verbindung. Bitte erneut versuchen.'; button.disabled=false; }
  finally {busy=false;}
});
document.addEventListener('visibilitychange',()=>{if(!document.hidden) void poll();});
window.addEventListener('online',()=>void poll());
setInterval(updateTimer,1000);
const joinCode = new URLSearchParams(location.search).get('join');
if (joinCode) { history.replaceState(null,'',location.pathname); if (token) { token=null;sessionStorage.removeItem('aiescape-token'); } joinDialog(joinCode); }
else if(token) { void (async()=>{ try { const current=await request('/api/state');begin({token,state:current}); } catch(error) { if ([401,410].includes(error.status)) {leave();toast(error.message);} else {toast('Dein Team wird bei der nächsten Verbindung wiederhergestellt.');pollTimer=setInterval(poll,3000);} } })(); }
if ('serviceWorker' in navigator) void navigator.serviceWorker.register('/sw.js').catch(()=>{});
