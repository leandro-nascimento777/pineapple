-- profiles: sem insert (a linha nasce via trigger security definer no convite,
-- não via client direto); select/update ficam abertos a nível de grant e
-- restritos de verdade pelas RLS policies do 0011.
grant select, update on public.profiles to authenticated;

-- setores: leitura pública (mesmo padrão de companies/projects), escrita só
-- para quem tiver sessão autenticada (RLS restringe a admin).
grant select on public.setores to anon, authenticated;
grant insert, update, delete on public.setores to authenticated;

-- companies/projects: só tinham select; admin passa a poder cadastrar/editar/remover.
grant insert, update, delete on public.companies to authenticated;
grant insert, update, delete on public.projects to authenticated;
