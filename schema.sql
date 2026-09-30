-- Execute no SQL Editor de um projeto Supabase dedicado a este aplicativo.
-- Snapshot por aluno: inclui histórico, banco pessoal e sessões. Não é banco público de questões.
create table if not exists public.study_state (
 user_id uuid primary key references auth.users(id) on delete cascade,
 data jsonb not null check (jsonb_typeof(data) = 'object'),
 revision integer not null default 1,
 updated_at timestamptz not null default now()
);
alter table public.study_state enable row level security;
revoke all on public.study_state from anon;
grant select, insert, update, delete on public.study_state to authenticated;
create policy "Read own study data" on public.study_state for select to authenticated using ((select auth.uid()) = user_id);
create policy "Insert own study data" on public.study_state for insert to authenticated with check ((select auth.uid()) = user_id);
create policy "Update own study data" on public.study_state for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "Delete own study data" on public.study_state for delete to authenticated using ((select auth.uid()) = user_id);
-- O cliente compara revision antes de gravar e acusa conflito entre dispositivos.
