-- bucket privado para anexos de bug; leitura/escrita controladas pelas policies abaixo
insert into storage.buckets (id, name, public)
values ('bug-anexos', 'bug-anexos', false)
on conflict (id) do nothing;

-- convenção de path esperada pelo SupabaseStorageRepository: "<bug_id ou tmp>/<arquivo>"
-- a checagem de acesso real acontece via join com bugs/projects/companies, não via path
create policy "bug_anexos_storage_select" on storage.objects
  for select
  using (
    bucket_id = 'bug-anexos'
    and (
      is_dev_user()
      or exists (
        select 1 from bug_anexos ba
        join bugs b on b.id = ba.bug_id
        join projects p on p.id = b.project_id
        join companies c on c.id = p.company_id
        where ba.storage_path = storage.objects.name
        and c.email_domain = auth_user_domain()
      )
    )
  );

create policy "bug_anexos_storage_insert" on storage.objects
  for insert
  with check (
    bucket_id = 'bug-anexos'
    and auth.role() = 'authenticated'
  );
