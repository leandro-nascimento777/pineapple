-- quem reportou o bug precisa conseguir ler o nome de quem assumiu (join
-- bugs.assumido_por -> profiles.id); a policy antiga só liberava a própria
-- linha ou admin, então esse embed sempre voltava null pro usuário comum.
drop policy "profiles_select" on profiles;

create policy "profiles_select" on profiles
  for select
  using (
    is_admin()
    or id = auth.uid()
    or exists (
      select 1 from bugs b
      where b.assumido_por = profiles.id
      and has_project_access(b.project_id)
    )
  );
