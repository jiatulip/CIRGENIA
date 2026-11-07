const {createRequire}=require('module');
const {readFileSync,realpathSync,readdirSync}=require('fs');
const path=require('path');
const assert=require('node:assert/strict');
const r=createRequire(realpathSync('node_modules/wrangler/package.json'));
const {Miniflare}=r('miniflare');
(async()=>{
 const mf=new Miniflare({modules:[{type:'ESModule',path:path.resolve('dist/server/index.js')},...readdirSync('dist/server',{recursive:true}).filter(f=>f!=='index.js'&&/\.m?js$/.test(f)).map(f=>({type:'ESModule',path:path.resolve('dist/server',f)}))],modulesRoot:path.resolve('dist/server'),compatibilityDate:'2026-05-15',compatibilityFlags:['nodejs_compat'],d1Databases:{DB:'cirgenia-isolated-qa'}});
 try {
  const db=await mf.getD1Database('DB');
  for(const migration of readdirSync('drizzle').filter(f=>f.endsWith('.sql')).sort())for(const sql of readFileSync('drizzle/'+migration,'utf8').split('--> statement-breakpoint'))if(sql.trim())await db.prepare(sql.trim()).run();
  const request=(p,init={})=>mf.dispatchFetch('https://cirgenia.test'+p,init);
  let res=await request('/api/content');assert.equal(res.status,200);let original=await res.json();assert.equal(original.content.fr.hero.title,'Chaque ressource compte.');console.log('PASS content API / multilingual default data');
  res=await request('/api/studio');assert.equal(res.status,403);console.log('PASS anonymous editor blocked');
  const stranger={'oai-authenticated-user-id':'test-visitor','oai-authenticated-user-email':'visitor@example.test'};
  res=await request('/api/studio',{headers:stranger});assert.equal(res.status,403);console.log('PASS other signed-in user blocked');
  const owner={'oai-authenticated-user-id':'test-owner','oai-authenticated-user-email':'cirgjia@gmail.com'};
  res=await request('/api/studio',{headers:owner});assert.equal(res.status,200);console.log('PASS authenticated owner accepted');
  const modified=structuredClone(original.content);modified.en.hero.title='CIRGENIA verification';
  const write=(headers,revision=0,content=modified)=>request('/api/studio',{method:'PUT',headers:{...headers,'Content-Type':'application/json'},body:JSON.stringify({content,revision})});
  res=await write({...owner,origin:'https://other.test'});assert.equal(res.status,403);console.log('PASS cross-origin save blocked');
  res=await write({...owner,origin:'https://cirgenia.test'});assert.equal(res.status,200);assert.equal((await res.json()).revision,1);
  res=await request('/api/content');assert.equal((await res.json()).content.en.hero.title,'CIRGENIA verification');console.log('PASS owner save / durable public readback');
  res=await write({...owner,origin:'https://cirgenia.test'});assert.equal(res.status,409);console.log('PASS stale revision blocked');
  const bad=structuredClone(modified);bad.settings.email='invalid';res=await write({...owner,origin:'https://cirgenia.test'},1,bad);assert.equal(res.status,400);console.log('PASS invalid content rejected');
  for(const route of ['/','/demo','/privacy','/privacy?lang=en','/privacy?lang=ar']){res=await request(route);assert.equal(res.status,200);const html=await res.text();assert(html.includes('CIRGENIA'));assert(!html.includes('Building your site'));console.log('PASS rendered route',route)}
  res=await request('/studio',{redirect:'manual'});const authHtml=await res.text();assert([302,303,307,308].includes(res.status)||authHtml.includes('/signin-with-chatgpt?return_to='));console.log('PASS owner page requires sign-in');res=await request('/studio',{headers:owner});assert.equal(res.status,200);assert((await res.text()).includes('Votre espace CIRGENIA'));console.log('PASS owner studio renders');

  const publicHeaders={origin:'https://cirgenia.test','Content-Type':'application/json','cf-connecting-ip':'203.0.113.12'};
  const contact={name:'QA Visitor',email:'qa@example.test',message:'This is an isolated test inquiry.',locale:'en',website:'',consent:true,privacyVersion:'2026-09-30'};
  const submit=(body=contact,headers=publicHeaders)=>request('/api/contact',{method:'POST',headers,body:JSON.stringify(body)});
  res=await submit(contact,{...publicHeaders,origin:'https://other.test'});assert.equal(res.status,403);
  res=await submit({...contact,email:'not-email'});assert.equal(res.status,400);res=await submit({...contact,consent:false});assert.equal(res.status,400);res=await submit({...contact,privacyVersion:'old'});assert.equal(res.status,400);
  res=await submit({...contact,website:'spam.test'});assert.equal(res.status,200);
  assert.equal((await db.prepare('SELECT COUNT(*) AS count FROM inquiries').first()).count,0);
  res=await submit();assert.equal(res.status,201);assert.equal((await db.prepare('SELECT privacy_version FROM inquiries LIMIT 1').first()).privacy_version,'2026-09-30');console.log('PASS public form persistence, validation, origin and honeypot');
  for(const headers of [{},stranger]){res=await request('/api/inbox',{headers});assert.equal(res.status,403)}
  res=await request('/api/inbox',{headers:owner});assert.equal(res.status,200);let inbox=await res.json();assert.equal(inbox.total,1);assert.equal(inbox.items[0].email,'qa@example.test');assert.equal(inbox.summary.unread,1);const inquiryId=inbox.items[0].id;console.log('PASS private inbox rejects anonymous/other users and receives message');
  for(const headers of [publicHeaders,{...publicHeaders,...stranger},{...publicHeaders,...owner,origin:'https://other.test'}]){res=await request('/api/inbox',{method:'PATCH',headers,body:JSON.stringify({id:inquiryId,status:'read'})});assert.equal(res.status,403)}
  res=await request('/api/inbox',{method:'PATCH',headers:{...publicHeaders,...owner},body:JSON.stringify({id:inquiryId,status:'archived'})});assert.equal(res.status,200);
  res=await request('/api/inbox?status=archived',{headers:owner});inbox=await res.json();assert.equal(inbox.total,1);assert.equal(inbox.items[0].status,'archived');console.log('PASS inbox update authorization and archive filtering');
  res=await request('/api/visits',{method:'POST',headers:publicHeaders,body:JSON.stringify({page:'/',source:'prospectus'})});assert.equal(res.status,204);
  res=await request('/api/inbox',{headers:owner});inbox=await res.json();assert.equal(inbox.views.total,1);assert.equal(inbox.views.prospectus,1);console.log('PASS prospectus page-view counter');
  for(let i=0;i<4;i++){res=await submit();assert.equal(res.status,201)}res=await submit();assert.equal(res.status,429);console.log('PASS contact rate limit');
  res=await request('/api/inbox?id='+inquiryId,{method:'DELETE',headers:publicHeaders});assert.equal(res.status,403);
  res=await request('/api/inbox?id='+inquiryId,{method:'DELETE',headers:{...publicHeaders,...owner}});assert.equal(res.status,200);assert.equal(await db.prepare('SELECT id FROM inquiries WHERE id=?').bind(inquiryId).first(),null);console.log('PASS owner-only permanent deletion');

  res=await request('/studio',{headers:stranger});const denied=await res.text();assert(denied.includes('Compte propriétaire requis'));assert(!denied.includes('Votre espace CIRGENIA'));console.log('PASS non-owner studio shell blocked');
 }finally{await mf.dispose()}
})().catch(e=>{console.error(e);process.exitCode=1});
