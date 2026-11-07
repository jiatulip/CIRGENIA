import PrivacyPolicy from '@/components/privacy-policy';
import {readContent} from '@/lib/server-content';
import {defaultContent,languages,type Lang} from '@/lib/content';
export const dynamic='force-dynamic';
export const metadata={title:'CIRGENIA — Privacy Policy · Politique de confidentialité · سياسة الخصوصية'};
export default async function PrivacyPage({searchParams}:{searchParams:Promise<{lang?:string}>}){
 const params=await searchParams;const lang=languages.includes(params.lang as Lang)?params.lang as Lang:'fr';
 let settings=defaultContent.settings;try{settings=(await readContent()).content.settings}catch{}
 return <PrivacyPolicy initialLang={lang} email={settings.email} founder={settings.founder} location={settings.location}/>;
}
