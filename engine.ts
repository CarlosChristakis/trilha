import { Attempt, Mode, Question, StudyData, StudySession, Unit } from './types';
export function mastery(attempts: Attempt[], topicId: string) {
 const a=attempts.filter(x=>x.topicId===topicId).slice(-5);
 if(!a.length) return 'Não estudado';
 if(!a.at(-1)!.correct || a.filter(x=>x.correct).length/a.length<.6) return 'Precisa revisar';
 if(a.length>=3 && a.slice(-3).every(x=>x.correct)) return 'Dominado';
 return 'Em aprendizado';
}
export function unresolved(attempts: Attempt[]) {
 const latest=new Map<string,Attempt>(); for(const a of attempts)latest.set(a.questionId,a);
 return [...latest.values()].filter(x=>!x.correct);
}
export function selectQuestions(bank: Question[], attempts: Attempt[], mode: Mode, unit=0, count=10, random=Math.random) {
 const errors=new Set(unresolved(attempts).map(x=>x.questionId));
 const pool=bank.filter(q=>(!unit||q.unit===unit)&&(mode!=='Revisar Erros'||errors.has(q.id)));
 // Weighted sampling without replacement: weak topics get 4x probability; unseen topics 2x.
 return pool.map(q=>{ const m=mastery(attempts,q.topicId); const w=mode==='Praticar'||mode==='Aprender'?(m==='Precisa revisar'?4:m==='Não estudado'?2:1):1; return {q,key:-Math.log(Math.max(random(),.000001))/w}; }).sort((a,b)=>a.key-b.key).slice(0,count).map(x=>x.q);
}
export function recordAnswer(data: StudyData, selected: number): StudyData {
 const s=data.current; if(!s||s.finished||s.answers[s.index])return data;
 const q=s.questions[s.index]; if(!q||selected<0||selected>=q.options.length)return data;
 const a:Attempt={id:crypto.randomUUID(),questionId:q.id,topicId:q.topicId,unit:q.unit,selected,correct:selected===q.correct,at:new Date().toISOString(),mode:s.mode,sessionId:s.id,question:q};
 return {...data,attempts:[...data.attempts,a],current:{...s,answers:[...s.answers,a]}};
}
export function advance(data:StudyData):StudyData {
 const s=data.current;if(!s||!s.answers[s.index])return data;
 if(s.index+1<s.questions.length)return {...data,current:{...s,index:s.index+1}};
 const finished:StudySession={...s,finished:true};return {...data,current:finished,sessions:[...data.sessions.filter(x=>x.id!==s.id),finished]};
}
// Reuse an unanswered question from this topic. Never call a generator or discard the queue.
export function practiceSimilar(data:StudyData,bank:Question[]):StudyData{
 const s=data.current;if(!s||s.finished||s.mode==='Simulado'||!s.answers[s.index])return data;
 const topicId=s.questions[s.index].topicId;
 const done=new Set(s.answers.map(a=>a.questionId));
 const candidates=bank.filter(q=>q.topicId===topicId&&!done.has(q.id));
 const attempts=(id:string)=>data.attempts.filter(a=>a.questionId===id).length;
 candidates.sort((a,b)=>attempts(a.id)-attempts(b.id)||a.id.localeCompare(b.id));
 const next=candidates[0];if(!next)return data;
 const pending=s.questions.slice(s.index+1).filter(q=>q.id!==next.id);
 const queue=[...s.questions.slice(0,s.index+1),next,...pending];
 if(queue.length>100)return data;
 return {...data,current:{...s,questions:queue,index:s.index+1}};
}
// Reset progress only; keep the profile and the user's question collection.
// Mixed-session reports are removed as a whole to avoid misleading partial scores.
export function resetProgress(data:StudyData,unit:Unit|0):StudyData{
 if(unit===0)return {...data,attempts:[],sessions:[],current:null};
 const touches=(s:StudySession)=>s.questions.some(q=>q.unit===unit)||s.answers.some(a=>a.unit===unit);
 return {...data,attempts:data.attempts.filter(a=>a.unit!==unit),sessions:data.sessions.filter(s=>!touches(s)),current:data.current&&touches(data.current)?null:data.current};
}
