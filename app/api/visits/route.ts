import {db,sameOrigin} from '@/lib/server-content';
import {visitSchema} from '@/lib/public-forms';
export async function POST(request:Request){
 if(!sameOrigin(request))return new Response(null,{status:403});
 try{
  const body=await request.text();if(body.length>300)return new Response(null,{status:413});
  const parsed=visitSchema.safeParse(JSON.parse(body));if(!parsed.success)return new Response(null,{status:400});
  const day=new Date().toISOString().slice(0,10),{page,source}=parsed.data;
  await db().prepare('INSERT INTO page_views (id,day,page,source,views) VALUES (?,?,?,?,1) ON CONFLICT(id) DO UPDATE SET views=views+1').bind(day+':'+page+':'+source,day,page,source).run();
  return new Response(null,{status:204});
 }catch{return new Response(null,{status:503})}
}
