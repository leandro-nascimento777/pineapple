alter table profiles enable row level security;
alter table setores enable row level security;

-- profiles: usuário vê a própria linha; admin vê e edita todas
create policy "profiles_select" on profiles
  for select
  using (is_admin() or id = auth.uid());

create policy "profiles_update" on profiles
  for update
  using (is_admin())
  with check (is_admin());

-- setores: visível para quem é da empresa (ou admin); cadastro só por admin
create policy "setores_select" on setores
  for select
  using (is_admin() or company_id = current_company_id());

create policy "setores_insert" on setores
  for insert
  with check (is_admin());

create policy "setores_update" on setores
  for update
  using (is_admin())
  with check (is_admin());

create policy "setores_delete" on setores
  for delete
  using (is_admin());

-- companies/projects: só existia select; admin agora pode cadastrar/editar/remover
create policy "companies_insert" on companies for insert with check (is_admin());
create policy "companies_update" on companies for update using (is_admin()) with check (is_admin());
create policy "companies_delete" on companies for delete using (is_admin());

create policy "projects_insert" on projects for insert with check (is_admin());
create policy "projects_update" on projects for update using (is_admin()) with check (is_admin());
create policy "projects_delete" on projects for delete using (is_admin());
