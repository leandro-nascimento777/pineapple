-- migra as policies de "empresa inteira" para "projeto a projeto", e troca
-- is_admin() por is_staff() onde dev também deve poder atuar (leitura e
-- trabalho em bugs). CRUD de empresas/projetos/setores continua admin-only.

drop policy "companies_select" on companies;
create policy "companies_select" on companies
  for select
  using (is_staff() or id = current_company_id());

drop policy "projects_select" on projects;
create policy "projects_select" on projects
  for select
  using (has_project_access(id));

drop policy "bugs_select" on bugs;
create policy "bugs_select" on bugs
  for select
  using (has_project_access(project_id));

drop policy "bugs_insert" on bugs;
create policy "bugs_insert" on bugs
  for insert
  with check (has_project_access(project_id));

drop policy "bugs_update" on bugs;
create policy "bugs_update" on bugs
  for update
  using (is_staff())
  with check (is_staff());

drop policy "bug_anexos_select" on bug_anexos;
create policy "bug_anexos_select" on bug_anexos
  for select
  using (
    exists (
      select 1 from bugs b
      where b.id = bug_anexos.bug_id
      and has_project_access(b.project_id)
    )
  );

drop policy "bug_anexos_insert" on bug_anexos;
create policy "bug_anexos_insert" on bug_anexos
  for insert
  with check (
    exists (
      select 1 from bugs b
      where b.id = bug_anexos.bug_id
      and has_project_access(b.project_id)
    )
  );

drop policy "bug_anexos_storage_select" on storage.objects;
create policy "bug_anexos_storage_select" on storage.objects
  for select
  using (
    bucket_id = 'bug-anexos'
    and exists (
      select 1 from bug_anexos ba
      join bugs b on b.id = ba.bug_id
      where ba.storage_path = storage.objects.name
      and has_project_access(b.project_id)
    )
  );

-- setores: dev também precisa enxergar (bugs mostram o nome do setor)
drop policy "setores_select" on setores;
create policy "setores_select" on setores
  for select
  using (is_staff() or company_id = current_company_id());

-- company_domains: mesma visibilidade de companies; escrita só admin
alter table company_domains enable row level security;

create policy "company_domains_select" on company_domains
  for select
  using (is_staff() or company_id = current_company_id());

create policy "company_domains_insert" on company_domains
  for insert
  with check (is_admin());

create policy "company_domains_delete" on company_domains
  for delete
  using (is_admin());

-- profile_projects: só o admin gerencia; ninguém mais precisa ler direto
-- (o filtro de acesso já acontece via has_project_access nas outras tabelas)
alter table profile_projects enable row level security;

create policy "profile_projects_select" on profile_projects
  for select
  using (is_admin());

create policy "profile_projects_insert" on profile_projects
  for insert
  with check (is_admin());

create policy "profile_projects_delete" on profile_projects
  for delete
  using (is_admin());
