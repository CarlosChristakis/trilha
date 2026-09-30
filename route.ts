import { NextRequest,NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { topics } from '@/lib/content';
import { OpenAIProvider } from '@/lib/ai';
import { questionSchema } from '@/lib/validation';
const limits=new Map<string,{count:number;until:number}>();
export async function POST(req:NextRequest) {
 if(process.env.AI_ENABLED!=='true')return NextResponse.json({error:'IA paga desativada. O treinamento local funciona sem API.'},{status:503});
 if(!process.env.OPENAI_API_KEY)return NextResponse.json({error:'IA não conectada. Configure OPENAI_API_KEY no servidor. As explicações locais continuam disponíveis.'},{status:503});
 if(req.headers.get('origin')&&req.headers.get('origin')!==req.nextUrl.origin)return NextResponse.json({error:'Origem não permitida.'},{status:403});
 let uid='local';
 const local=process.env.NODE_ENV==='development'&&process.env.AI_ALLOW_LOCAL==='true'&&['localhost','127.0.0.1'].includes(req.nextUrl.hostname);
 if(!local){
  const url=process.env.NEXT_PUBLIC_SUPABASE_URL,key=process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if(!url||!key)return NextResponse.json({error:'Configure o Supabase e entre na sua conta para usar a IA.'},{status:401});
  const token=req.headers.get('authorization')?.replace(/^Bearer /,'');
  if(!token)return NextResponse.json({error:'Entre na sua conta para usar a IA.'},{status:401});
  const {data,error}=await createClient(url,key).auth.getUser(token);if(error||!data.user)return NextResponse.json({error:'Sessão inválida.'},{status:401});uid=data.user.id;
 }
 const now=Date.now();for(const [key,value]of limits)if(value.until<now)limits.delete(key);
 const limit=limits.get(uid)||{count:0,until:now+60000};if(limit.count>=6)return NextResponse.json({error:'Limite de 6 pedidos por minuto. Aguarde um pouco.'},{status:429});limit.count++;limits.set(uid,limit);
 try{
  const raw=await req.text();if(raw.length>2000)return NextResponse.json({error:'Pedido muito grande.'},{status:413});
  const body=JSON.parse(raw);const topic=topics.find(t=>t.id===body.topicId);
  if(!topic||!['tutor','generate'].includes(body.action))return NextResponse.json({error:'Assunto ou ação inválida.'},{status:400});
  const output=await new OpenAIProvider().respond(topic,body.action==='generate');
  const question=questionSchema.parse({id:crypto.randomUUID(),topicId:topic.id,unit:topic.unit,prompt:output.prompt,options:output.options,correct:output.correct,explanations:output.explanations,source:`IA baseada em ${topic.title}. Evidência: ${output.quote}`});
  return NextResponse.json({academic:output.academic,simple:output.simple,example:output.example,quote:output.quote,question,provider:'OpenAI'});
 }catch(e){return NextResponse.json({error:e instanceof Error?e.message:'Não foi possível gerar a resposta.'},{status:502});}
}
