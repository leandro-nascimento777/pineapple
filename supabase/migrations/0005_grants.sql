-- tabelas criadas via SQL Editor não recebem GRANT automático para anon/authenticated
-- (diferente de criar pelo Table Editor); sem isso, o RLS nunca chega a ser avaliado —
-- o Postgres barra antes, com "permission denied for table".
grant usage on schema public to anon, authenticated;

grant select on public.companies to anon, authenticated;
grant select on public.projects to anon, authenticated;
grant select, insert, update on public.bugs to anon, authenticated;
grant select, insert on public.bug_anexos to anon, authenticated;
