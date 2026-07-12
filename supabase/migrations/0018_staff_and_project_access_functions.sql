-- is_staff(): admin OU dev (ambos atuam em bugs de qualquer empresa).
-- has_project_access(): staff sempre; usuário de empresa só se houver grant
-- explícito em profile_projects.
create or replace function is_staff() returns boolean as $$
  select exists (select 1 from profiles where id = auth.uid() and role in ('admin', 'dev'));
$$ language sql stable security definer set search_path = public;

create or replace function has_project_access(target_project_id uuid) returns boolean as $$
  select is_staff() or exists (
    select 1 from profile_projects
    where profile_id = auth.uid() and project_id = target_project_id
  );
$$ language sql stable security definer set search_path = public;
