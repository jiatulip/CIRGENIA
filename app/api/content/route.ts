import {readContent} from '@/lib/server-content';
export const dynamic='force-dynamic';
export async function GET(){try{return Response.json(await readContent(),{headers:{'Cache-Control':'no-store'}})}catch(error){console.error('Content read failed',error);return Response.json({error:'Content unavailable'},{status:503})}}
