export type Unit = 1 | 2 | 3 | 4;
export type Mode = 'Aprender' | 'Praticar' | 'Revisar Erros' | 'Aleatório' | 'Simulado' | 'Revisão Rápida';
export type Topic = { id: string; unit: Unit; title: string; academic: string; simple: string; example: string; deeper: string; misconception: string; source: string; verified: boolean };
export type Question = { id: string; topicId: string; unit: Unit; prompt: string; options: string[]; correct: number; explanations: string[]; source: string };
export type Attempt = { id: string; questionId: string; topicId: string; unit: Unit; selected: number; correct: boolean; at: string; mode: Mode; sessionId: string; question: Question };
export type StudySession = { id: string; mode: Mode; questions: Question[]; index: number; answers: Attempt[]; finished: boolean; startedAt: string };
export type StudyData = { version: 1; attempts: Attempt[]; custom: Question[]; sessions: StudySession[]; current: StudySession | null; name: string };
export const emptyData = (): StudyData => ({ version: 1, attempts: [], custom: [], sessions: [], current: null, name: '' });
