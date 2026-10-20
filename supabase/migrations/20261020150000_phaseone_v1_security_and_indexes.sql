begin;
revoke all on table public.phaseone_memories, public.phaseone_tasks, public.phaseone_messages from anon;
revoke truncate, references, trigger on table public.phaseone_memories, public.phaseone_tasks, public.phaseone_messages from authenticated;
grant select, insert, update, delete on table public.phaseone_memories, public.phaseone_tasks, public.phaseone_messages to authenticated;
create index if not exists phaseone_memories_user_created_idx on public.phaseone_memories (user_id, created_at desc);
create index if not exists phaseone_tasks_user_created_idx on public.phaseone_tasks (user_id, created_at desc);
create index if not exists phaseone_messages_user_created_idx on public.phaseone_messages (user_id, created_at desc);
commit;
