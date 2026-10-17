import { test } from 'node:test';
import assert from 'node:assert/strict';
import { DatabaseSync } from 'node:sqlite';
import { readFileSync } from 'node:fs';
import worker from '../src/index.js';
import { room, stageView } from '../src/rooms/prompt-lab.js';

// Runs the actual production SQL against SQLite; the adapter only models D1's
// prepare/bind/batch transport, not game rules.
export function database() {
  const sqlite = new DatabaseSync(':memory:');
  sqlite.exec(readFileSync(new URL('../migrations/0001_sessions.sql', import.meta.url), 'utf8'));
  return {
    sqlite,
    prepare(sql) {
      const stmt = sqlite.prepare(sql); let params=[];
      return {
        bind(...values) { params=values;return this; },
        async first() { return stmt.get(...params) || null; },
        async all() { return {results:stmt.all(...params)}; },
        async run() { const r=stmt.run(...params);return {meta:{changes:Number(r.changes)}}; }
      };
    },
    async batch(stmts) {
      sqlite.exec('BEGIN');
      try { const results=[];for(const stmt of stmts) results.push(await stmt.run());sqlite.exec('COMMIT');return results; }
      catch(error){sqlite.exec('ROLLBACK');throw error;}
    }
  };
}
function client(env) {
  return async (path, data, token, headers={}) => {
    const req = new Request('https://aiescape.myapps.fans'+path,{
      method:data===undefined?'GET':'POST',headers:{...(data===undefined?{}:{'content-type':'application/json'}),...(token?{authorization:'Bearer '+token}:{}),...headers},body:data===undefined?undefined:JSON.stringify(data)
    });
    const response=await worker.fetch(req,env);
    return {status:response.status,data:await response.json(),headers:response.headers};
  };
}
test('a team completes all puzzles, shares state, and opts into the leaderboard', async()=>{
  const DB=database(), api=client({DB});
  const created=await api('/api/sessions',{team:'Prompt-Piraten',location:'Berlin'});
  assert.equal(created.status,201);
  const terminal=created.data.token, code=created.data.state.code;
  assert.match(code,/^[A-Z2-9]{8}$/);
  const joined=await api('/api/join',{code:code.toLowerCase(),role:'manual'});
  assert.equal(joined.status,201);const manual=joined.data.token;
  assert.equal(joined.data.state.puzzle.slots,undefined);
  assert.ok(joined.data.state.puzzle.manual.length);
  assert.equal((await api('/api/action',{type:'start',revision:0},manual)).status,403);
  const started=await api('/api/action',{type:'start',revision:0},terminal);
  assert.equal(started.status,200);assert.ok(started.data.startedAt);
  assert.equal((await api('/api/action',{type:'answer',answer:{},revision:0},terminal)).status,409);
  const wrong=await api('/api/action',{type:'answer',answer:{},revision:1},terminal);
  assert.equal(wrong.data.stage,0);assert.equal(wrong.data.mistakes,1);
  const hint=await api('/api/action',{type:'hint',revision:2},terminal);
  assert.equal(hint.data.hints,1);assert.equal(hint.data.puzzle.hints.length,1);
  let state=hint.data;
  for(const answer of [{audience:'team',when:'a',where:'atrium',format:'short'},'B',['data','draft','review','send']]) {
    const response=await api('/api/action',{type:'answer',answer,revision:state.revision},terminal);
    assert.equal(response.status,200);state=response.data;
  }
  assert.equal(state.stage,3);assert.ok(state.finishedAt);assert.equal(state.puzzle,null);
  assert.ok(state.score>=75);
  const shared=await api('/api/state',undefined,manual);
  assert.equal(shared.data.finishedAt,state.finishedAt);
  assert.equal((await api('/api/leaderboard')).data.entries.length,0);
  assert.equal((await api('/api/action',{type:'publish'},terminal)).status,200);
  const board=await api('/api/leaderboard');
  assert.equal(board.data.entries[0].team,'Prompt-Piraten');
  assert.equal(board.data.entries[0].score,state.score);
  assert.equal((await api('/api/action',{type:'answer',answer:'B',revision:state.revision},terminal)).status,409);
  DB.sqlite.close();
});
test('roles, session expiry, validation, and foreign origins are enforced',async()=>{
  const DB=database(),api=client({DB});
  assert.equal((await api('/api/state')).status,401);
  assert.equal((await api('/api/join',{code:'AAAAAAAA'})).status,404);
  assert.equal((await api('/api/sessions',{team:'A'})).status,400);
  assert.equal((await api('/api/sessions',{team:'test'},undefined,{origin:'https://evil.example'})).status,403);
  assert.equal((await api('/api/sessions',{team:'x'.repeat(9000)})).status,413);
  const created=await api('/api/sessions',{team:'Test-Team'}),token=created.data.token;
  assert.equal((await api('/api/action',{type:'answer',revision:0,answer:{}},token)).status,409);
  const role=await api('/api/action',{type:'role',role:'manual'},token);
  assert.equal(role.data.role,'manual');assert.equal(role.data.puzzle.task,undefined);
  assert.equal((await api('/api/action',{type:'role',role:'admin'},token)).status,400);
  assert.equal((await api('/api/action',{type:'publish'},token)).status,409);
  DB.sqlite.prepare('UPDATE sessions SET created_at = 0').run();
  assert.equal((await api('/api/state',undefined,token)).status,410);
  DB.sqlite.close();
});
test('hints are bounded and concurrent submissions cannot advance two stages',async()=>{
  const DB=database(),api=client({DB});
  const created=await api('/api/sessions',{team:'Concurrency'}),token=created.data.token;
  await api('/api/action',{type:'start',revision:0},token);
  await api('/api/action',{type:'hint',revision:1},token);
  await api('/api/action',{type:'hint',revision:2},token);
  assert.equal((await api('/api/action',{type:'hint',revision:3},token)).status,409);
  const answer={audience:'team',when:'a',where:'atrium',format:'short'};
  const responses=await Promise.all([api('/api/action',{type:'answer',answer,revision:3},token),api('/api/action',{type:'answer',answer,revision:3},token)]);
  assert.deepEqual(responses.map(r=>r.status).sort(),[200,409]);
  assert.equal((await api('/api/state',undefined,token)).data.stage,1);
  DB.sqlite.close();
});
test('public assets have security headers and no client bundle contains room solutions',async()=>{
  const response=await worker.fetch(new Request('https://aiescape.myapps.fans/'),{});
  assert.equal(response.status,200);assert.ok(response.headers.get('content-security-policy').includes("script-src 'self'"));
  assert.ok((await response.text()).includes('Euer Ausweg.'));
  assert.equal((await worker.fetch(new Request('https://aiescape.myapps.fans/missing'),{})).status,404);
  assert.equal(stageView(0,'terminal').manual,undefined);
  assert.equal(stageView(0,'manual').slots,undefined);
  assert.equal(stageView(0,'terminal').validate,undefined);
  assert.ok(room.stages.every(s=>typeof s.validate==='function'));
  assert.ok(!readFileSync(new URL('../public/app.js',import.meta.url),'utf8').includes("a?.audience === 'team'"));
});
test('rate limiting prevents database access after the limit is reached',async()=>{
  const api=client({API_LIMITER:{limit:async()=>({success:false})}});
  assert.equal((await api('/api/sessions',{team:'Limited'})).status,429);
});
