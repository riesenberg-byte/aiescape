import { t, language, setLanguage, translatePage, locationLabel } from './i18n.js';
const $ = selector => document.querySelector(selector);
const escape = value => String(value ?? '').replace(/[&<>"']/g, char => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[char]));
const dialog = $('#dialog');
let token = sessionStorage.getItem('aiescape-token');
let state = null, busy = false, pollBusy = false, pollTimer, toastTimer, serverOffset = 0;
let order = [], rendered = '', boardRequest = 0, actionEpoch = 0, modal = null;
let gameView = null, demoView = null, voxelLoading = false, voxelSnapshot = null;
let use3d = localStorage.getItem('aiescape-view') !== '2d';
const time = seconds => `${String(Math.floor(Math.max(0, seconds) / 60)).padStart(2, '0')}:${String(Math.floor(Math.max(0, seconds) % 60)).padStart(2, '0')}`;
const arrow = '<span aria-hidden="true">↗</span>';
translatePage();

function toast(message) { $('#toast').textContent = message; $('#toast').classList.remove('hidden'); clearTimeout(toastTimer); toastTimer = setTimeout(() => $('#toast').classList.add('hidden'), 6000); }
async function request(path, data) {
  const response = await fetch(path, {
    method: data === undefined ? 'GET' : 'POST',
    headers: { 'X-Game-Language': language, ...(data === undefined ? {} : { 'Content-Type':'application/json' }), ...(token ? { Authorization:`Bearer ${token}` } : {}) },
    body: data === undefined ? undefined : JSON.stringify(data), signal: AbortSignal.timeout(12000)
  });
  const result = await response.json();
  if (!response.ok) { const error = new Error(result.error || t('connectionFailed')); error.status = response.status; throw error; }
  return result;
}
function languageButtons() { return `<div class="language-switch dialog-languages" role="group" aria-label="Language / Sprache"><button type="button" data-language="de" lang="de" aria-pressed="${language==='de'}" class="${language==='de'?'active':''}">DE</button><button type="button" data-language="en" lang="en" aria-pressed="${language==='en'}" class="${language==='en'?'active':''}">EN</button></div>`; }
function showDialog(html, type) {
  demoView?.dispose(); demoView=null;
  gameView?.pause();
  modal=type; dialog.classList.toggle('explore-dialog',type==='explore');
  $('#dialog-content').innerHTML=languageButtons()+html;
  if(!dialog.open)dialog.showModal();
}
function createDialog() {
  showDialog(`<div class="eyebrow">${t('newTeam')}</div><h2>${t('createTitle')}</h2><p>${t('createDescription')}</p>
    <form id="create-form" class="form"><label>${t('teamName')}<input name="team" placeholder="${escape(t('teamPlaceholder'))}" required minlength="2" maxlength="40" autocomplete="off"></label>
    <label>${t('location')}<select name="location"><option value="Remote">Remote</option><option value="Berlin">Berlin</option><option value="München">${t('munich')}</option><option value="Frankfurt">Frankfurt</option><option value="Anderer Standort">${t('otherLocation')}</option></select></label>
    <p class="form-note">${t('teamNote')}</p><div class="error" id="form-error" role="alert"></div><button class="button primary" type="submit">${t('createTeam')} ${arrow}</button></form>`, 'create');
}
function joinDialog(code='') {
  showDialog(`<div class="eyebrow">${t('joinEyebrow')}</div><h2>${t('joinTitle')}</h2><p>${t('joinDescription')}</p>
    <form id="join-form" class="form"><label>${t('codeLabel')}<input class="code" name="code" value="${escape(code)}" placeholder="XXXXXXXX" required minlength="8" maxlength="10" autocomplete="off" spellcheck="false"></label>
    <label>${t('yourRole')}<select name="role"><option value="manual">${t('roleManual')}</option><option value="terminal">${t('roleTerminal')}</option></select></label>
    <div class="error" id="form-error" role="alert"></div><button class="button primary" type="submit">${t('join')} ${arrow}</button></form>`, 'join');
}
function howDialog() {
  showDialog(`<div class="eyebrow">${t('briefing')}</div><h2>${t('briefingTitle')}</h2><p>${t('briefingDescription')}</p>
    <ol class="lobby-step">${['briefOne','briefTwo','briefThree','briefFour'].map(key=>`<li>${t(key)}</li>`).join('')}</ol>
    <p class="form-note">${t('scoringLong')}</p><button class="button primary" data-action="create">${t('letsGo')} ${arrow}</button>`, 'how');
}
async function leaderboard() {
  const id=++boardRequest;
  showDialog(`<div class="eyebrow">${t('boardEyebrow')}</div><h2>${t('boardTitle')}</h2><p id="board-content" role="status">${t('boardLoading')}</p>`, 'board');
  try {
    const {entries}=await request('/api/leaderboard');
    if(id!==boardRequest||!$('#board-content'))return;
    $('#board-content').outerHTML=entries.length?`<table class="leaderboard"><caption class="visually-hidden">${t('boardCaption')}</caption><thead><tr><th>${t('rank')}</th><th>${t('teamLocation')}</th><th>${t('adjustedTime')}</th></tr></thead><tbody>${entries.map((e,i)=>`<tr><td>${String(i+1).padStart(2,'0')}</td><td>${escape(e.team)}<small>${escape(locationLabel(e.location))}</small></td><td>${time(e.score)}</td></tr>`).join('')}</tbody></table><p class="form-note">${t('boardNote')}</p>`:`<p>${t('boardEmpty')}</p>`;
  }catch{if($('#board-content'))$('#board-content').textContent=t('boardUnavailable');}
}
function playerCounts() {return `<span>${t('terminal').toUpperCase()}: ${state.players.find(p=>p.role==='terminal')?.count||0}</span><span>${t('manual').toUpperCase()}: ${state.players.find(p=>p.role==='manual')?.count||0}</span>`;}
function scene() {
  return `<aside class="game-scene"><div class="scene-heading"><div class="eyebrow">${t(state.finishedAt?'unlockedSector':'lockedSector')}</div><button type="button" class="view-toggle" data-action="view">${t(use3d?'view2d':'view3d')}</button></div>
    ${use3d?`<div class="voxel-host" id="game-voxel"><p class="voxel-loading">${t('voxelLoading')}</p></div><p class="voxel-note">${t('voxelLocal')}</p>`:`<img src="/lab.svg?v=0.2.1" alt="${escape(t('voxelTitle'))}">`}
    <div class="nova-bubble" role="status"><span class="nova-mini" aria-hidden="true">• •</span><div><strong>NOVA <span>OFFICE OPTIMIZATION AGENT</span></strong><p>${escape(state.message)}</p></div></div>
    <div class="progress-list" aria-label="${t('progress')}">${['precise','sources','responsible'].map((key,i)=>`<div class="progress-item ${i<state.stage?'done':i===state.stage?'current':''}"><span>${i<state.stage?'✓':'0'+(i+1)}</span>${t(key)}</div>`).join('')}</div></aside>`;
}
function puzzle() {
  if(state.finishedAt)return `<div class="success-mark" aria-hidden="true">↗</div><div class="eyebrow">${t('missionDone')}</div><h3>${t('successTitle')}</h3><p class="task">${t('successDescription')}</p>
    <div class="success-stats"><div><strong>${time((state.finishedAt-state.startedAt)/1000)}</strong><span>${t('playTime')}</span></div><div><strong>${state.hints}</strong><span>${t('hints')}</span></div><div><strong>${state.mistakes}</strong><span>${t('mistakes')}</span></div></div>
    <p>${t('scoreLabel')} <strong>${time(state.score)}</strong></p><p class="success-note">${t('scoringShort')}</p>
    ${state.listed?`<p class="manual-instruction">${t('listed')}</p>`:`<p class="success-note">${t('publishNote')}</p><button class="button primary" data-action="publish">${t('publish')} ${arrow}</button>`}
    <div class="puzzle-actions"><button class="text-button" data-action="leaderboard">${t('viewBoard')} ↗</button><button class="text-button" data-action="leave">${t('backHome')} ↗</button></div>`;
  if(!state.startedAt)return `<div class="eyebrow">${t('lobbyEyebrow')}</div><h3>${t('lobbyTitle')}</h3><p class="task">${t('lobbyDescription')}</p>
    <div class="lobby-code">${escape(state.code)}</div><button class="button small outline" data-action="invite">${t('copyLink')} ${arrow}</button><div class="player-counts" id="player-counts">${playerCounts()}</div><p class="form-note">${t('lobbyNote')}</p>
    ${state.role==='terminal'?`<button class="button primary" data-action="start">${t('enterLab')} ${arrow}</button>`:`<p class="manual-instruction">${t('waiting')}</p>`}`;
  const p=state.puzzle;
  if(state.role==='manual')return `<div class="eyebrow">${t('manualStep',{step:state.stage+1})}</div><h3 tabindex="-1" id="puzzle-title">${escape(p.title)}</h3><p class="task">${t('manualIntro')}</p>${p.manual.map(([title,text])=>`<article class="manual-note"><h4>${escape(title)}</h4><p>${escape(text)}</p></article>`).join('')}<p class="manual-instruction">${t('manualNote')}</p>${hints()}`;
  let fields='';
  if(p.kind==='slots')fields=p.slots.map(slot=>`<label class="slot"><span id="slot-label-${escape(slot.id)}">${escape(slot.label)}</span><select class="slot-select" name="${escape(slot.id)}" aria-labelledby="slot-label-${escape(slot.id)}" required><option value="">${t('selectBlock')}</option>${slot.options.map(([value,label])=>`<option value="${escape(value)}">${escape(label)}</option>`).join('')}</select></label>`).join('');
  if(p.kind==='choice')fields=p.choices.map(([id,text,source])=>`<label class="choice"><input type="radio" name="answer" value="${escape(id)}" required><span><b>${id}.</b> ${escape(text)}<small>${escape(source)}</small></span></label>`).join('');
  if(p.kind==='order'){order=p.choices.map(([id])=>id);fields=`<p class="form-note">${t('orderHelp')}</p><ol class="order-list" id="order-list"></ol>`;}
  return `<div class="eyebrow">${t('terminalStep',{step:state.stage+1})}</div><h3 tabindex="-1" id="puzzle-title">${escape(p.title)}</h3><p class="task">${escape(p.task)}</p><form id="answer-form">${fields}<div class="puzzle-actions"><button class="button primary" type="submit">${t(p.kind==='slots'?'runPrompt':p.kind==='choice'?'removeStatement':'activateFlow')} ${arrow}</button><button class="hint-button" type="button" data-action="hint" ${p.hints.length>=2?'disabled':''}>${t('hintButton')}</button></div></form>${hints()}`;
}
function hints(){return state.puzzle?.hints.map((hint,i)=>`<div class="hint"><strong>${t('hintNumber',{number:i+1})}</strong> ${escape(hint)}</div>`).join('')||'';}
function renderOrder(){
  if(!$('#order-list'))return;
  $('#order-list').innerHTML=order.map((id,i)=>`<li class="order-item"><span>${escape(state.puzzle.choices.find(c=>c[0]===id)[1])}</span><button type="button" data-move="${i}" data-direction="-1" aria-label="${t('moveUp',{number:i+1})}" ${i===0?'disabled':''}>↑</button><button type="button" data-move="${i}" data-direction="1" aria-label="${t('moveDown',{number:i+1})}" ${i===order.length-1?'disabled':''}>↓</button></li>`).join('');
}
function captureDraft(){const form=$('#answer-form');return form?{stage:state.stage,role:state.role,values:Object.fromEntries(new FormData(form)),order:[...order]}:null;}
function restoreDraft(draft){
  if(!draft||draft.stage!==state.stage||draft.role!==state.role)return;
  for(const el of document.querySelectorAll('#answer-form select, #answer-form input')){if(el.type==='radio')el.checked=draft.values[el.name]===el.value;else if(draft.values[el.name]!==undefined)el.value=draft.values[el.name];}
  if($('#order-list')&&draft.order.length){order=draft.order;renderOrder();}
}
function renderGame(force=false,draft=null){
  if(!state)return;
  serverOffset=state.serverTime-Date.now();
  const key=`${state.code}:${state.revision}:${state.role}:${state.listed}:${language}:${use3d}`;
  if(key===rendered&&!force){if($('#player-counts'))$('#player-counts').innerHTML=playerCounts();updateTimer();return;}
  rendered=key;
  const retained=use3d&&gameView?$('#game-voxel'):null;
  if(retained)retained.remove();
  $('#home').classList.add('hidden');$('#game').classList.remove('hidden');
  $('#game').innerHTML=`<div class="game-top"><div><div class="eyebrow">SEASON 01 / MISSION 001</div><h2>${t('labFull')}</h2><div class="game-team">${escape(state.team)} · ${escape(locationLabel(state.location))}</div></div><div><div class="timer" id="timer">00:00</div><div class="timer-label">${t(state.finishedAt?'ended':state.startedAt?'sharedTimer':'readyTimer')}</div></div></div>
    <div class="game-tools"><div class="role-switch" aria-label="${t('yourRole')}"><button data-role="terminal" class="${state.role==='terminal'?'active':''}" aria-pressed="${state.role==='terminal'}">&gt;_ ${t('terminal')}</button><button data-role="manual" class="${state.role==='manual'?'active':''}" aria-pressed="${state.role==='manual'}">▤ ${t('manual')}</button></div><button class="code-button" data-action="invite" aria-label="${t('copyLink')}">${t('teamCode')} <b>${escape(state.code)}</b> ↗</button></div>
    <div class="game-grid">${scene()}<section class="puzzle-panel" aria-label="${t(state.role==='manual'?'manual':'terminal')}">${puzzle()}</section></div><div class="status-line" id="connection-status" aria-live="polite">${t('connected')}</div><button class="leave-button" data-action="leave">${t('leaveLink')}</button>`;
  if(retained){$('#game-voxel').replaceWith(retained);gameView.update({t,unlocked:Boolean(state.finishedAt)});}
  else if(use3d)void mountGameView();
  renderOrder();restoreDraft(draft);updateTimer();
}
async function mountGameView(){
  if(voxelLoading||gameView||!use3d)return;voxelLoading=true;
  try{const {createVoxelRoom}=await import('./voxel-room.js?v=0.2.1');if(!state||!use3d||!$('#game-voxel'))return;gameView=createVoxelRoom($('#game-voxel'),{t,unlocked:Boolean(state.finishedAt),snapshot:voxelSnapshot,onInteract:interactStation});}
  catch{if($('#game-voxel'))$('#game-voxel').innerHTML=`<p class="voxel-fallback">${t('voxelFallback')}</p>`;}
  finally{voxelLoading=false;}
}
function interactStation(target){
  if(target==='terminal'||target==='manual'){
    if(!state){toast(t('demoNote'));return;}
    if(state.role!==target){toast(t('wrongStation',{role:t(state.role==='manual'?'manual':'terminal')}));return;}
    $('.puzzle-panel')?.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth',block:'center'});
    $('#puzzle-title')?.focus({preventScroll:true});return;
  }
  if(target==='nova')toast(state?.message||t('novaExplore'));
  if(target==='exit')toast(t(state?.finishedAt?'doorOpen':'doorLocked'));
}
async function exploreDialog(){
  showDialog(`<div class="eyebrow">${t('view3d')}</div><h2>${t('voxelTitle')}</h2><p class="form-note">${t('demoNote')}</p><div class="voxel-host" id="demo-voxel"><p class="voxel-loading">${t('voxelLoading')}</p></div>`, 'explore');
  const target=$('#demo-voxel');
  try{const {createVoxelRoom}=await import('./voxel-room.js?v=0.2.1');if(!target.isConnected||!dialog.open)return;demoView=createVoxelRoom(target,{t,onInteract:interactStation});}
  catch{if(target.isConnected)target.innerHTML=`<p class="voxel-fallback">${t('voxelFallback')}</p>`;}
}
function updateTimer(){if(!state||!$('#timer'))return;$('#timer').textContent=state.startedAt?time(((state.finishedAt||Date.now()+serverOffset)-state.startedAt)/1000):'00:00';}
async function poll(){
  if(!token||busy||pollBusy||document.hidden)return;pollBusy=true;const epoch=actionEpoch;
  try{const latest=await request('/api/state');if(epoch!==actionEpoch||busy||!token)return;const draft=captureDraft();state=latest;renderGame(false,draft);if($('#connection-status')){$('#connection-status').textContent=t('connected');$('#connection-status').classList.remove('offline');}}
  catch(error){if(epoch!==actionEpoch)return;if([401,410].includes(error.status)){leave();toast(error.message);}else if($('#connection-status')){$('#connection-status').textContent=t('disconnected');$('#connection-status').classList.add('offline');}}
  finally{pollBusy=false;}
}
function begin(result){actionEpoch++;token=result.token;sessionStorage.setItem('aiescape-token',token);state=result.state;rendered='';dialog.close();renderGame();clearInterval(pollTimer);pollTimer=setInterval(poll,3000);$('#game').scrollIntoView({behavior:'instant'});}
async function action(data){
  if(busy)return;actionEpoch++;busy=true;gameView?.pause();
  const draft=captureDraft();
  document.querySelectorAll('.puzzle-panel button, .puzzle-panel input, .puzzle-panel select, .role-switch button').forEach(b=>{b.disabled=true;});
  try{const oldStage=state.stage;state=await request('/api/action',{...data,revision:state.revision});renderGame(true,draft);if(state.stage!==oldStage){$('#puzzle-title')?.focus();toast(t(state.finishedAt?'completedToast':'nextToast'));}}
  catch(error){toast(error.message||t('connectionFailed'));try{state=await request('/api/state');}catch{}renderGame(true,draft);}
  finally{busy=false;}
}
function leave(){
  actionEpoch++;clearInterval(pollTimer);sessionStorage.removeItem('aiescape-token');token=null;state=null;rendered='';
  gameView?.dispose();gameView=null;voxelSnapshot=null;
  $('#game').classList.add('hidden');$('#home').classList.remove('hidden');dialog.close();window.scrollTo({top:0,behavior:'instant'});
}
async function copyInvite(){
  const url=`${location.origin}/?join=${encodeURIComponent(state.code)}&lang=${language}`;
  try{await navigator.clipboard.writeText(url);toast(t('copied'));}
  catch{showDialog(`<div class="eyebrow">${t('invitation')}</div><h2>${t('shareCode')}</h2><div class="lobby-code">${escape(state.code)}</div><p>${t('openOther',{url:escape(location.origin)})}</p><label class="field-label">${t('copyableLink')}<input class="slot-select" value="${escape(url)}" readonly></label>`,'invite');}
}
async function changeLanguage(next){
  if(busy||next===language)return;
  const previous=language,draft=state?captureDraft():null;
  const form=$('#dialog-content form'),fields=form?Object.fromEntries(new FormData(form)):null;
  busy=true;actionEpoch++;
  try{
    setLanguage(next);
    if(state)state=await request('/api/state');
    translatePage();
    if(state)renderGame(true,draft);
    if(dialog.open){const mode=modal;if(mode==='create')createDialog();else if(mode==='join')joinDialog(fields?.code||'');else if(mode==='how')howDialog();else if(mode==='board')await leaderboard();else if(mode==='explore')await exploreDialog();else dialog.close();if(fields)for(const el of document.querySelectorAll('#dialog-content input,#dialog-content select'))if(fields[el.name]!==undefined)el.value=fields[el.name];}
    const url=new URL(location.href);url.searchParams.set('lang',language);history.replaceState(null,'',url);
  }catch{setLanguage(previous);translatePage();toast(t('connectionFailed'));}
  finally{busy=false;}
}
dialog.addEventListener('close',()=>{demoView?.dispose();demoView=null;modal=null;});
document.addEventListener('voxel-failed',()=>{gameView?.dispose();gameView=null;use3d=false;if(state)renderGame(true);toast(t('voxelFallback'));});
document.addEventListener('click',async event=>{
  const lang=event.target.closest('[data-language]');if(lang){await changeLanguage(lang.dataset.language);return;}
  const role=event.target.closest('[data-role]');if(role&&state){if(role.dataset.role!==state.role)await action({type:'role',role:role.dataset.role});return;}
  const move=event.target.closest('[data-move]');if(move){const i=Number(move.dataset.move),j=i+Number(move.dataset.direction);if(j>=0&&j<order.length){[order[i],order[j]]=[order[j],order[i]];renderOrder();const next=$(`[data-move="${j}"][data-direction="${move.dataset.direction}"]`);if(next&&!next.disabled)next.focus();}return;}
  const anchor=event.target.closest('nav a');if(anchor&&state){event.preventDefault();if(anchor.hash==='#mission')$('#game').scrollIntoView();else howDialog();return;}
  const el=event.target.closest('[data-action]');if(!el)return;
  switch(el.dataset.action){
    case 'create':if(state){dialog.close();$('#game').scrollIntoView();}else createDialog();break;
    case 'join':joinDialog();break;case 'close':dialog.close();break;case 'how':howDialog();break;case 'leaderboard':await leaderboard();break;
    case 'start':await action({type:'start'});break;case 'hint':await action({type:'hint'});break;case 'publish':await action({type:'publish'});break;case 'invite':await copyInvite();break;
    case 'explore':await exploreDialog();break;
    case 'view':{const draft=captureDraft();voxelSnapshot=gameView?.snapshot()||voxelSnapshot;gameView?.dispose();gameView=null;use3d=!use3d;localStorage.setItem('aiescape-view',use3d?'3d':'2d');renderGame(true,draft);break;}
    case 'leave':if(state&&!state.finishedAt)showDialog(`<div class="eyebrow">${t('leaving')}</div><h2>${t('leavingTitle')}</h2><p>${t('leavingNote')}</p><button class="button outline" data-action="leave-confirm">${t('leaveTeam')} ↗</button>`,'leave');else leave();break;
    case 'leave-confirm':leave();break;
  }
});
document.addEventListener('submit',async event=>{
  const form=event.target;if(!['create-form','join-form','answer-form'].includes(form.id))return;
  event.preventDefault();if(busy)return;
  const values=Object.fromEntries(new FormData(form));
  if(form.id==='answer-form'){let answer=values;if(state.puzzle.kind==='choice')answer=values.answer;if(state.puzzle.kind==='order')answer=[...order];await action({type:'answer',answer});return;}
  busy=true;const button=form.querySelector('button[type="submit"]');button.disabled=true;
  try{begin(await request(form.id==='create-form'?'/api/sessions':'/api/join',values));}
  catch(error){if($('#form-error'))$('#form-error').textContent=error.message||t('connectionFailed');button.disabled=false;}
  finally{busy=false;}
});
document.addEventListener('visibilitychange',()=>{if(!document.hidden)void poll();});
window.addEventListener('online',()=>void poll());
setInterval(updateTimer,1000);
const params=new URLSearchParams(location.search),joinCode=params.get('join');
if(joinCode){history.replaceState(null,'',`${location.pathname}?lang=${language}`);if(token){token=null;sessionStorage.removeItem('aiescape-token');}joinDialog(joinCode);}
else if(token){void(async()=>{try{const current=await request('/api/state');begin({token,state:current});}catch(error){if([401,410].includes(error.status)){leave();toast(error.message);}else{toast(t('restore'));pollTimer=setInterval(poll,3000);}}})();}
if('serviceWorker'in navigator)void navigator.serviceWorker.register('/sw.js').catch(()=>{});
