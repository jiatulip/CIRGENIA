import {env} from 'cloudflare:workers';
import {getChatGPTUser} from '@/app/chatgpt-auth';
import {headers} from 'next/headers';
import {defaultContent,type SiteContent} from './content';
export function db(){if(!env.DB)throw Error('Database unavailable');return env.DB}
export async function readContent(){const row=await db().prepare('SELECT payload, revision, updated_at FROM site_content WHERE id = ?').bind('main').first<{payload:string;revision:number;updated_at:string}>();return row?{content:JSON.parse(row.payload) as SiteContent,revision:row.revision,updatedAt:row.updated_at}:{content:defaultContent,revision:0,updatedAt:null}}
export async function isOwner(){
 const user=await getChatGPTUser();if(!user)return false;
 // On the hosted site, identity headers are authenticated by Sites dispatch.
 // Bind the known owner's authenticated identity once, then use the stable site user ID.
 const owner=await db().prepare('SELECT user_id FROM site_owner WHERE id = ?').bind('owner').first<{user_id:string}>();
 if(owner)return owner.user_id===user.userId;
 const h=await headers();const host=h.get('host')?.split(':')[0];
 const local=import.meta.env.DEV && ['localhost','127.0.0.1'].includes(host||'') && user.userId==='local_seedy' && user.email==='seedy@sites.test';
 if(user.email.toLowerCase()!=='cirgjia@gmail.com'&&!local)return false;
 await db().prepare('INSERT INTO site_owner (id, user_id) VALUES (?, ?) ON CONFLICT(id) DO NOTHING').bind('owner',user.userId).run();
 const saved=await db().prepare('SELECT user_id FROM site_owner WHERE id = ?').bind('owner').first<{user_id:string}>();return saved?.user_id===user.userId;
}
export function sameOrigin(request:Request){const origin=request.headers.get('origin');if(!origin)return false;try{return new URL(origin).host===new URL(request.url).host}catch{return false}}
