// Dependency-free local QA server using Node 24's SQLite implementation.
// Production runs on Cloudflare Workers + D1, not on this server.
import { createServer } from 'node:http';
import { DatabaseSync } from 'node:sqlite';
import { readFileSync } from 'node:fs';
import worker from '../src/index.js';
const sqlite=new DatabaseSync(':memory:');
sqlite.exec(readFileSync(new URL('../migrations/0001_sessions.sql',import.meta.url),'utf8'));
const DB={prepare(sql){const stmt=sqlite.prepare(sql);let values=[];return {bind(...v){values=v;return this;},async first(){return stmt.get(...values)||null;},async all(){return {results:stmt.all(...values)};},async run(){return {meta:{changes:Number(stmt.run(...values).changes)}};}};},async batch(statements){sqlite.exec('BEGIN');try{const result=[];for(const s of statements)result.push(await s.run());sqlite.exec('COMMIT');return result;}catch(error){sqlite.exec('ROLLBACK');throw error;}}};
const server=createServer(async(req,res)=>{
  try {
    const request=new Request('http://127.0.0.1:8787'+req.url,{method:req.method,headers:req.headers,...(['GET','HEAD'].includes(req.method)?{}:{body:req,duplex:'half'})});
    const response=await worker.fetch(request,{DB});
    res.writeHead(response.status,Object.fromEntries(response.headers));res.end(Buffer.from(await response.arrayBuffer()));
  }catch{res.writeHead(500);res.end('Local server error');}
});
server.listen(8787,'0.0.0.0',()=>console.log('AI Escape local QA: http://127.0.0.1:8787'));
