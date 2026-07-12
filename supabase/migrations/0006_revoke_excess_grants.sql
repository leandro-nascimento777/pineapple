-- os grants em produção estavam mais amplos do que o 0005 previa (provavelmente
-- de um "grant all" rodado no setup inicial). GRANT é aditivo e nunca revogou isso.
-- Aqui zeramos tudo e reconcedemos exatamente o que o 0005_grants.sql pretendia.
revoke all on public.companies from anon, authenticated;
revoke all on public.projects from anon, authenticated;
revoke all on public.bugs from anon, authenticated;
revoke all on public.bug_anexos from anon, authenticated;

grant select on public.companies to anon, authenticated;
grant select on public.projects to anon, authenticated;
grant select, insert, update on public.bugs to anon, authenticated;
grant select, insert on public.bug_anexos to anon, authenticated;
