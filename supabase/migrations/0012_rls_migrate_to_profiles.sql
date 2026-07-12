-- migra as policies existentes de "match por domínio de email" para
-- "membership explícita via profiles", e remove os helpers antigos.
drop policy "companies_select" on companies;
create policy "companies_select" on companies
  for select
  using (is_admin() or id = current_company_id());

drop policy "projects_select" on projects;
create policy "projects_select" on projects
  for select
  using (is_admin() or company_id = current_company_id());

drop policy "bugs_select" on bugs;
create policy "bugs_select" on bugs
  for select
  using (
    is_admin()
    or project_id in (select id from projects where company_id = current_company_id())
  );

drop policy "bugs_insert" on bugs;
create policy "bugs_insert" on bugs
  for insert
  with check (
    is_admin()
    or project_id in (select id from projects where company_id = current_company_id())
  );

drop policy "bugs_update" on bugs;
create policy "bugs_update" on bugs
  for update
  using (is_admin())
  with check (is_admin());

drop policy "bug_anexos_select" on bug_anexos;
create policy "bug_anexos_select" on bug_anexos
  for select
  using (
    exists (
      select 1 from bugs b
      join projects p on p.id = b.project_id
      where b.id = bug_anexos.bug_id
      and (is_admin() or p.company_id = current_company_id())
    )
  );

drop policy "bug_anexos_insert" on bug_anexos;
create policy "bug_anexos_insert" on bug_anexos
  for insert
  with check (
    exists (
      select 1 from bugs b
      join projects p on p.id = b.project_id
      where b.id = bug_anexos.bug_id
      and (is_admin() or p.company_id = current_company_id())
    )
  );

drop policy "bug_anexos_storage_select" on storage.objects;
create policy "bug_anexos_storage_select" on storage.objects
  for select
  using (
    bucket_id = 'bug-anexos'
    and (
      is_admin()
      or exists (
        select 1 from bug_anexos ba
        join bugs b on b.id = ba.bug_id
        join projects p on p.id = b.project_id
        where ba.storage_path = storage.objects.name
        and p.company_id = current_company_id()
      )
    )
  );

drop function is_dev_user();
drop function auth_user_domain();
