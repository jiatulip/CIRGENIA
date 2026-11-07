import {db,isOwner,readContent,sameOrigin} from '@/lib/server-content';
import {siteSchema} from '@/lib/content';
export const dynamic='force-dynamic';
export async function GET(){try{if(!await isOwner())return Response.json({error:'Accès réservé à la propriétaire.'},{status:403});return Response.json(await readContent(),{headers:{'Cache-Control':'no-store'}})}catch(error){console.error('Studio read failed',error);return Response.json({error:'Le contenu est momentanément indisponible.'},{status:503})}}
export async function PUT(request:Request){
 try{
  if(!sameOrigin(request))return Response.json({error:'Origine non autorisée.'},{status:403});
  if(!await isOwner())return Response.json({error:'Accès réservé à la propriétaire.'},{status:403});
  const raw=await request.text();if(raw.length>160000)return Response.json({error:'Contenu trop volumineux.'},{status:413});
  let body;try{body=JSON.parse(raw)}catch{return Response.json({error:'Format invalide.'},{status:400})}
  const parsed=siteSchema.safeParse(body.content);if(!parsed.success)return Response.json({error:parsed.error.issues[0]?.message||'Contenu invalide.'},{status:400});
  if(!Number.isSafeInteger(body.revision)||body.revision<0)return Response.json({error:'Version invalide.'},{status:400});
  const now=new Date().toISOString();const payload=JSON.stringify(parsed.data);
  const result=body.revision===0?await db().prepare('INSERT INTO site_content (id,payload,revision,updated_at) VALUES (?,?,1,?) ON CONFLICT(id) DO NOTHING').bind('main',payload,now).run():await db().prepare('UPDATE site_content SET payload=?, revision=revision+1, updated_at=? WHERE id=? AND revision=?').bind(payload,now,'main',body.revision).run();
  if(!result.meta.changes)return Response.json({error:'Une autre modification a été enregistrée. Exportez votre brouillon puis rechargez la page avant de réessayer.'},{status:409});
  return Response.json({revision:body.revision+1,updatedAt:now});
 }catch(error){console.error('Studio save failed',error);return Response.json({error:'Enregistrement impossible. Votre brouillon reste disponible sur cette page.'},{status:503})}
}
