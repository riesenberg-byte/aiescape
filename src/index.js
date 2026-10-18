import { assets } from './generated/assets.js';
import { room, stageView, miloMessage } from './rooms/prompt-lab.js';
import { errorsEnglish } from './errors.en.js';
import { EVENT, isLocation } from '../public/event-config.js';

const SECURITY = {
  'X-Content-Type-Options': 'nosniff', 'Referrer-Policy': 'no-referrer',
  'X-Frame-Options': 'DENY',
  'Content-Security-Policy': "default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self' data:; connect-src 'self'; base-uri 'none'; frame-ancestors 'none'; form-action 'self'",
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()'
};
class HttpError extends Error { constructor(status, message) { super(message); this.status = status; } }
const fail = (status, message) => { throw new HttpError(status, message); };
const json = (value, status = 200) => Response.json(value, { status, headers: { ...SECURITY, 'Cache-Control': 'no-store' } });
export async function hash(token) {
  return Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(token))), x => x.toString(16).padStart(2, '0')).join('');
}
function clean(value, max = 40) {
  return typeof value === 'string' ? value.replace(/[\u0000-\u001f<>]/g, '').trim().slice(0, max) : '';
}
async function body(request) {
  if (!(request.headers.get('content-type') || '').startsWith('application/json')) fail(415, 'Bitte JSON senden.');
  const reader = request.body?.getReader();
  if (!reader) fail(400, 'Die Eingabe fehlt.');
  const chunks = []; let size = 0;
  while (true) {
    const { done, value } = await reader.read(); if (done) break;
    size += value.byteLength;
    if (size > 8192) { await reader.cancel(); fail(413, 'Die Eingabe ist zu groß.'); }
    chunks.push(value);
  }
  const bytes = new Uint8Array(size); let offset = 0;
  for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.byteLength; }
  try { const value = JSON.parse(new TextDecoder().decode(bytes)); if (!value || typeof value !== 'object' || Array.isArray(value)) throw Error(); return value; }
  catch { fail(400, 'Die Eingabe ist ungültig.'); }
}
export function score(session) {
  return Math.max(0, Math.floor((session.finished_at - session.started_at) / 1000)) + session.hints * 60 + session.mistakes * 15;
}
async function player(request, env) {
  const token = request.headers.get('Authorization')?.replace(/^Bearer /, '') || '';
  if (!/^[a-f0-9-]{36}$/.test(token)) fail(401, 'Bitte tritt einem Team bei.');
  const p = await env.DB.prepare('SELECT * FROM players WHERE token_hash = ?').bind(await hash(token)).first();
  if (!p) fail(401, 'Diese Sitzung ist nicht mehr verfügbar.');
  const s = await env.DB.prepare('SELECT * FROM sessions WHERE code = ?').bind(p.session_code).first();
  if (!s || Date.now() - s.created_at > 86400000) fail(410, 'Diese Sitzung ist abgelaufen. Starte ein neues Team.');
  return { p, s };
}
async function view(env, p, s, locale = 'de') {
  const counts = await env.DB.prepare('SELECT role, COUNT(*) AS count FROM players WHERE session_code = ? GROUP BY role').bind(s.code).all();
  return { code: s.code, team: s.team, location: s.location, role: p.role, stage: s.stage, revision: s.revision,
    startedAt: s.started_at, finishedAt: s.finished_at, hints: s.hints, mistakes: s.mistakes,
    message: miloMessage(s.last_message, locale), locale, listed: Boolean(s.listed), serverTime: Date.now(),
    score: s.finished_at ? score(s) : null, players: counts.results,
    room: { id: room.id, title: locale === 'en' ? 'The Prompt Lab' : room.title, total: room.stages.length },
    puzzle: stageView(s.stage, p.role, s.hint_level, locale) };
}
async function api(request, env, pathname) {
  const locale = request.headers.get('X-Game-Language') === 'en' ? 'en' : 'de';
  if (request.method !== 'GET' && request.method !== 'POST') fail(405, 'Methode nicht unterstützt.');
  const origin = request.headers.get('Origin');
  if (origin && origin !== new URL(request.url).origin) fail(403, 'Fremder Ursprung.');
  const ip = request.headers.get('CF-Connecting-IP') || 'local';
  if (env.API_LIMITER && !(await env.API_LIMITER.limit({ key: `aiescape:${ip}` })).success) fail(429, 'Kurz durchatmen. Bitte gleich erneut versuchen.');
  if (pathname === '/api/health' && request.method === 'GET') {
    await env.DB.prepare('SELECT 1 FROM sessions LIMIT 1').first(); return json({ ok: true, room: room.id });
  }
  if (pathname === '/api/leaderboard' && request.method === 'GET') {
    const location = new URL(request.url).searchParams.get('location') || '';
    if (location && !isLocation(location)) fail(400, 'Unbekannter Standort.');
    const rows = await env.DB.prepare(`SELECT team, location, hints, mistakes,
      MAX(0, CAST((finished_at - started_at) / 1000 AS INTEGER)) + hints * 60 + mistakes * 15 AS score
      FROM sessions WHERE finished_at IS NOT NULL AND listed = 1 AND created_at >= ?
      AND (? = '' OR location = ?) ORDER BY score ASC, finished_at ASC, code ASC LIMIT ?`)
      .bind(Date.now() - 30 * 86400000, location, location, EVENT.leaderboardLimit).all();
    return json({ entries: rows.results });
  }
  if (pathname === '/api/sessions' && request.method === 'POST') {
    if (env.CREATE_LIMITER && !(await env.CREATE_LIMITER.limit({ key: `create:${ip}` })).success) fail(429, 'Zu viele neue Teams. Bitte in einer Minute erneut versuchen.');
    const data = await body(request);
    const team = clean(data.team); if (team.length < 2) fail(400, 'Euer Teamname braucht mindestens zwei Zeichen.');
    const location = isLocation(data.location) ? data.location : 'Remote';
    const bytes = crypto.getRandomValues(new Uint8Array(8));
    const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    const code = Array.from(bytes, n => alphabet[n % alphabet.length]).join('');
    const token = crypto.randomUUID(); const tokenHash = await hash(token); const now = Date.now();
    await env.DB.batch([
      env.DB.prepare('DELETE FROM sessions WHERE created_at < ? AND listed = 0').bind(now - 86400000),
      env.DB.prepare('DELETE FROM sessions WHERE created_at < ?').bind(now - 30 * 86400000),
      env.DB.prepare('INSERT INTO sessions (code, team, location, created_at) VALUES (?, ?, ?, ?)').bind(code, team, location, now),
      env.DB.prepare('INSERT INTO players (token_hash, session_code, role, created_at) VALUES (?, ?, ?, ?)').bind(tokenHash, code, 'terminal', now)
    ]);
    const s = await env.DB.prepare('SELECT * FROM sessions WHERE code = ?').bind(code).first();
    return json({ token, state: await view(env, { role: 'terminal' }, s, locale) }, 201);
  }
  if (pathname === '/api/join' && request.method === 'POST') {
    const data = await body(request); const code = clean(data.code, 12).toUpperCase().replace(/[ -]/g, '');
    if (!/^[A-Z2-9]{8}$/.test(code)) fail(400, 'Bitte den achtstelligen Teamcode eingeben.');
    const s = await env.DB.prepare('SELECT * FROM sessions WHERE code = ?').bind(code).first();
    if (!s || Date.now() - s.created_at > 86400000) fail(404, 'Team nicht gefunden oder Sitzung abgelaufen. Prüft den Code.');
    const role = data.role === 'terminal' ? 'terminal' : 'manual';
    const token = crypto.randomUUID();
    await env.DB.prepare('INSERT INTO players (token_hash, session_code, role, created_at) VALUES (?, ?, ?, ?)').bind(await hash(token), code, role, Date.now()).run();
    return json({ token, state: await view(env, { role }, s, locale) }, 201);
  }
  if (!['/api/state', '/api/action'].includes(pathname)) fail(404, 'Nicht gefunden.');
  const { p, s } = await player(request, env);
  if (pathname === '/api/state' && request.method === 'GET') return json(await view(env, p, s, locale));
  if (pathname !== '/api/action' || request.method !== 'POST') fail(405, 'Methode nicht unterstützt.');
  const data = await body(request);
  if (data.type === 'role') {
    if (!['terminal', 'manual'].includes(data.role)) fail(400, 'Unbekannte Rolle.');
    await env.DB.prepare('UPDATE players SET role = ? WHERE token_hash = ?').bind(data.role, p.token_hash).run();
    p.role = data.role;
  } else if (data.type === 'publish') {
    if (!s.finished_at) fail(409, 'Schließt zuerst die Mission ab.');
    await env.DB.prepare('UPDATE sessions SET listed = 1, revision = revision + 1 WHERE code = ?').bind(s.code).run();
  } else {
    if (p.role !== 'terminal') fail(403, 'Nur das Terminal kann MILO Befehle geben. Teilt eure Hinweise im Gespräch.');
    if (data.revision !== s.revision) fail(409, 'Euer Team war schneller. Der Spielstand wird aktualisiert.');
    if (s.finished_at) fail(409, 'Die Mission ist bereits abgeschlossen.');
    let query; let params;
    if (data.type === 'start') {
      if (s.started_at) fail(409, 'Die Mission läuft bereits.');
      query = 'UPDATE sessions SET started_at = ?, revision = revision + 1 WHERE code = ? AND revision = ?';
      params = [Date.now(), s.code, s.revision];
    } else {
      if (!s.started_at) fail(409, 'Startet zuerst die Mission.');
      const stage = room.stages[s.stage];
      if (data.type === 'hint') {
        if (s.hint_level >= stage.hints.length) fail(409, 'Alle Hinweise für diesen Schritt sind bereits sichtbar.');
        query = 'UPDATE sessions SET hints = hints + 1, hint_level = hint_level + 1, revision = revision + 1 WHERE code = ? AND revision = ?';
        params = [s.code, s.revision];
      } else if (data.type === 'answer') {
        const correct = stage.validate(data.answer);
        query = `UPDATE sessions SET stage = ?, hint_level = ?, mistakes = ?, last_message = ?, finished_at = ?, revision = revision + 1 WHERE code = ? AND revision = ?`;
        params = [s.stage + (correct ? 1 : 0), correct ? 0 : s.hint_level, s.mistakes + (correct ? 0 : 1), correct ? stage.success : stage.failure,
          correct && s.stage === room.stages.length - 1 ? Date.now() : null, s.code, s.revision];
      } else fail(400, 'Unbekannte Aktion.');
    }
    const result = await env.DB.prepare(query).bind(...params).run();
    if (result.meta.changes !== 1) fail(409, 'Der Spielstand hat sich geändert. Bitte erneut versuchen.');
  }
  const current = await env.DB.prepare('SELECT * FROM sessions WHERE code = ?').bind(s.code).first();
  return json(await view(env, p, current, locale));
}

export default {
  async fetch(request, env) {
    const { pathname } = new URL(request.url);
    const locale = request.headers.get('X-Game-Language') === 'en' ? 'en' : 'de';
    try {
      if (pathname.startsWith('/api/')) return await api(request, env, pathname);
      if (!['GET', 'HEAD'].includes(request.method)) return json({ error: locale === 'en' ? errorsEnglish['Methode nicht unterstützt.'] : 'Methode nicht unterstützt.' }, 405);
      const asset = assets[pathname === '/' ? '/index.html' : pathname];
      if (!asset) return json({ error: locale === 'en' ? errorsEnglish['Nicht gefunden.'] : 'Nicht gefunden.' }, 404);
      const content = pathname === '/manifest.webmanifest' && new URL(request.url).searchParams.get('lang') === 'en'
        ? JSON.stringify({ ...JSON.parse(asset.body), name: 'AI Escape — MILO’s Prompt Lab', lang: 'en', start_url: '/?lang=en' }) : asset.body;
      return new Response(request.method === 'HEAD' ? null : content, { headers: { ...SECURITY, 'Content-Type': asset.type,
        'Cache-Control': pathname === '/' || pathname === '/sw.js' ? 'no-cache' : 'public, max-age=300' } });
    } catch (error) {
      if (error instanceof HttpError) return json({ error: locale === 'en' ? errorsEnglish[error.message] || 'Please try again.' : error.message }, error.status);
      console.error(JSON.stringify({ event: 'request_failed', path: pathname, name: error.name }));
      return json({ error: locale === 'en' ? errorsEnglish['MILO hat sich verheddert. Bitte gleich erneut versuchen.'] : 'MILO hat sich verheddert. Bitte gleich erneut versuchen.' }, 500);
    }
  }
};
