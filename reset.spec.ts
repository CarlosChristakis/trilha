import {test,expect} from '@playwright/test';
import {questions} from '../../src/lib/content';
import {emptyData,Attempt,StudyData,StudySession} from '../../src/lib/types';
const q1=questions.find(q=>q.unit===1)!;const q2=questions.find(q=>q.unit===2)!;
const attempts:Attempt[]=[q1,q2].map((q,i)=>({id:`a${i}`,questionId:q.id,topicId:q.topicId,unit:q.unit,selected:(q.correct+1)%4,correct:false,at:new Date().toISOString(),mode:'Praticar',sessionId:'mixed',question:q}));
const mixed:StudySession={id:'mixed',mode:'Praticar',questions:[q1,q2],index:1,answers:attempts,finished:true,startedAt:new Date().toISOString()};
const fixture:StudyData={...emptyData(),name:'Aluno',custom:[{...q1,id:'personal'}],attempts,sessions:[mixed],current:{...mixed,id:'active',finished:false}};
test.beforeEach(async({page})=>{await page.addInitScript(value=>{if(!localStorage.getItem('trilha:v1:guest'))localStorage.setItem('trilha:v1:guest',JSON.stringify(value))},fixture);await page.goto('/')});
test('Reset requires confirmation, preserves custom questions and survives reload',async({page})=>{
 await page.getByRole('button',{name:'Zerar e recomeçar',exact:true}).click();
 page.once('dialog',d=>d.dismiss());await page.getByRole('button',{name:'Zerar progresso e recomeçar',exact:true}).click();
 expect(await page.evaluate(()=>JSON.parse(localStorage.getItem('trilha:v1:guest')!).attempts.length)).toBe(2);
 page.once('dialog',async d=>{expect(d.message()).toContain('toda a trilha');await d.accept()});await page.getByRole('button',{name:'Zerar progresso e recomeçar',exact:true}).click();
 await expect(page.getByRole('button',{name:'Vamos praticar',exact:true})).toBeVisible();
 await page.reload();const saved=await page.evaluate(()=>JSON.parse(localStorage.getItem('trilha:v1:guest')!));expect(saved.attempts).toHaveLength(0);expect(saved.sessions).toHaveLength(0);expect(saved.name).toBe('Aluno');expect(saved.custom[0].id).toBe('personal');expect(saved.current.answers).toHaveLength(0);expect(saved.current.mode).toBe('Aprender');
});
test('Unit restart clears selected unit and mixed reports only',async({page})=>{
 await page.getByRole('button',{name:'Recomeçar Unidade 1',exact:true}).click();await expect(page.getByLabel('Qual trilha deseja zerar?')).toHaveValue('1');
 page.once('dialog',async d=>{expect(d.message()).toContain('Unidade 1');await d.accept()});await page.getByRole('button',{name:'Zerar progresso e recomeçar',exact:true}).click();
 await expect(page.getByRole('button',{name:'Vamos praticar',exact:true})).toBeVisible();const saved=await page.evaluate(()=>JSON.parse(localStorage.getItem('trilha:v1:guest')!));expect(saved.attempts).toHaveLength(1);expect(saved.attempts[0].unit).toBe(2);expect(saved.sessions).toHaveLength(0);expect(saved.custom).toHaveLength(1);expect(saved.current.questions.every((q:{unit:number})=>q.unit===1)).toBe(true);
});
