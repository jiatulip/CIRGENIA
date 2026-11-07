import {db,isOwner,sameOrigin} from '@/lib/server-content';
import {z} from 'zod';
const answer=(value:unknown,status=200)=>Response.json(value,{status,headers:{'Cache-Control':'no-store'}});
export async function GET(request:Request){
 try{
  if(!await isOwner())return answer({error:'Accès réservé à la propriétaire.'},403);
  const params=new URL(request.url).searchParams,filter=params.get('status')||'all';
  if(!['all','new','read','archived'].includes(filter))return answer({error:'Filtre invalide.'},400);
  const rawPage=Number(params.get('page')||1);const page=Number.isInteger(rawPage)&&rawPage>0?Math.min(rawPage,100000):1;
  const where=filter==='all'?"status != 'archived'":'status = ?';const values=filter==='all'?[]:[filter];
  const items=await db().prepare('SELECT id,name,email,message,locale,status,created_at FROM inquiries WHERE '+where+' ORDER BY created_at DESC,id DESC LIMIT 25 OFFSET ?').bind(...values,(page-1)*25).all();
  const total=await db().prepare('SELECT COUNT(*) AS count FROM inquiries WHERE '+where).bind(...values).first<{count:number}>();
  const summary=await db().prepare("SELECT COUNT(*) AS total,COALESCE(SUM(status='new'),0) AS unread FROM inquiries").first();
  const since=new Date(Date.now()-29*86400000).toISOString().slice(0,10);
  const views=await db().prepare("SELECT COALESCE(SUM(views),0) AS total,COALESCE(SUM(CASE WHEN source='prospectus' THEN views ELSE 0 END),0) AS prospectus FROM page_views WHERE day>=?").bind(since).first();
  return answer({items:items.results,total:total!.count,page,summary,views,since});
 }catch{return answer({error:'La boîte de réception est momentanément indisponible.'},503)}
}
const updateSchema=z.object({id:z.string().uuid(),status:z.enum(['new','read','archived'])});
export async function PATCH(request:Request){
 if(!sameOrigin(request))return answer({error:'Origine non autorisée.'},403);
 try{
  if(!await isOwner())return answer({error:'Accès réservé à la propriétaire.'},403);
  const body=await request.text();if(body.length>500)return answer({error:'Requête invalide.'},400);
  const parsed=updateSchema.safeParse(JSON.parse(body));if(!parsed.success)return answer({error:'Requête invalide.'},400);
  const result=await db().prepare('UPDATE inquiries SET status=? WHERE id=? RETURNING id').bind(parsed.data.status,parsed.data.id).first();
  return result?answer({ok:true}):answer({error:'Message introuvable.'},404);
 }catch{return answer({error:'Modification impossible.'},503)}
}
export async function DELETE(request:Request){
 if(!sameOrigin(request))return answer({error:'Origine non autorisée.'},403);
 try{
  if(!await isOwner())return answer({error:'Accès réservé à la propriétaire.'},403);
  const id=new URL(request.url).searchParams.get('id');if(!z.string().uuid().safeParse(id).success)return answer({error:'Message invalide.'},400);
  await db().prepare('DELETE FROM inquiries WHERE id=?').bind(id).run();return answer({ok:true});
 }catch{return answer({error:'Suppression impossible.'},503)}
}
