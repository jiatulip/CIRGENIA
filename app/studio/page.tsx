import {requireChatGPTUser} from '@/app/chatgpt-auth';
import {isOwner} from '@/lib/server-content';
import Studio from '@/components/studio';
export const dynamic='force-dynamic';
export const metadata={title:'CIRGENIA — Espace propriétaire',robots:{index:false,follow:false}};
export default async function OwnerStudio(){
 await requireChatGPTUser('/studio');
 if(!await isOwner())return <main className="container studio-auth"><h1>Compte propriétaire requis</h1><p>Cet espace est réservé à la propriétaire de CIRGENIA.</p><a className="button dark" href="/signout-with-chatgpt?return_to=%2Fstudio">Changer de compte</a><p><a href="/">Retour au site</a></p></main>;
 return <Studio/>;
}
