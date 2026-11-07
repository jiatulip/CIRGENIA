import {db,sameOrigin} from '@/lib/server-content';
import {contactSchema} from '@/lib/public-forms';
const answer=(code:string,status:number)=>Response.json({code},{status,headers:{'Cache-Control':'no-store'}});
export async function POST(request:Request){
 if(!sameOrigin(request))return answer('origin',403);
 try{
  const body=await request.text();if(body.length>14000)return answer('invalid',413);
  let raw;try{raw=JSON.parse(body)}catch{return answer('invalid',400)}
  const parsed=contactSchema.safeParse(raw);if(!parsed.success)return answer('invalid',400);
  if(parsed.data.website)return answer('received',200);
  // Keep only a short-lived salted hash for abuse limits, never the IP address.
  const now=Date.now(),hour=Math.floor(now/3600000),saltKey='salt:'+hour;
  await db().prepare('DELETE FROM submission_limits WHERE expires_at < ?').bind(now).run();
  await db().prepare('INSERT OR IGNORE INTO submission_limits (id,value,expires_at) VALUES (?,?,?)').bind(saltKey,crypto.randomUUID(),(hour+2)*3600000).run();
  const salt=await db().prepare('SELECT value FROM submission_limits WHERE id=?').bind(saltKey).first<{value:string}>();
  const digest=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(salt!.value+':'+(request.headers.get('cf-connecting-ip')||'local')));
  const key=hour+':'+Array.from(new Uint8Array(digest),b=>b.toString(16).padStart(2,'0')).join('');
  const rate=await db().prepare(`INSERT INTO submission_limits (id,value,expires_at) VALUES (?,'1',?) ON CONFLICT(id) DO UPDATE SET value=CAST(value AS INTEGER)+1 WHERE CAST(value AS INTEGER)<5 RETURNING value`).bind(key,(hour+2)*3600000).first();
  if(!rate)return answer('limit',429);
  const {name,email,message,locale,privacyVersion}=parsed.data;
  await db().prepare('INSERT INTO inquiries (id,name,email,message,locale,status,created_at,privacy_version) VALUES (?,?,?,?,?,?,?,?)').bind(crypto.randomUUID(),name,email,message,locale,'new',new Date().toISOString(),privacyVersion).run();
  return answer('received',201);
 }catch{return answer('unavailable',503)}
}
