'use client';
import {useEffect,useRef} from 'react';
export default function VisitCounter(){
 const counted=useRef(false);
 useEffect(()=>{if(counted.current)return;counted.current=true;const page=location.pathname;if(!['/','/demo'].includes(page))return;
 const source=new URLSearchParams(location.search).get('src')==='prospectus'?'prospectus':'direct';
 void fetch('/api/visits',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({page,source}),keepalive:true}).catch(()=>{});
 },[]);return null;
}
