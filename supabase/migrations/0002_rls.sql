-- domínio do email de quem está logado, extraído do JWT
create or replace function auth_user_domain() returns text as $$
  select split_part(auth.email(), '@', 2);
$$ language sql stable;

-- ajustar domínio dev conforme necessário
create or replace function is_dev_user() returns boolean as $$
  select auth_user_domain() = 'gufly.com';
$$ language sql stable;

alter table companies enable row level security;
alter table projects enable row level security;
alter table bugs enable row level security;
alter table bug_anexos enable row level security;

-- companies: necessário para ResolveAccessByEmailDomain conseguir localizar a
-- empresa do usuário logo após o login, antes de ele ter acesso a qualquer projeto.
create policy "companies_select" on companies
  for select
  using (
    is_dev_user()
    or email_domain = auth_user_domain()
  );

-- projects: dev vê tudo, empresa vê só os próprios
create policy "projects_select" on projects
  for select
  using (
    is_dev_user()
    or company_id in (select id from companies where email_domain = auth_user_domain())
  );

-- bugs: dev vê tudo; usuário de empresa vê os bugs dos projetos da própria empresa
create policy "bugs_select" on bugs
  for select
  using (
    is_dev_user()
    or project_id in (
      select p.id from projects p
      join companies c on c.id = p.company_id
      where c.email_domain = auth_user_domain()
    )
  );

-- bugs: usuário só cria bug em projeto da própria empresa; dev também pode criar
create policy "bugs_insert" on bugs
  for insert
  with check (
    is_dev_user()
    or project_id in (
      select p.id from projects p
      join companies c on c.id = p.company_id
      where c.email_domain = auth_user_domain()
    )
  );

-- bugs: status, parecer, resolvido_por e resolved_at só podem ser alterados pelo dev
create policy "bugs_update" on bugs
  for update
  using (is_dev_user())
  with check (is_dev_user());

-- bug_anexos: segue a mesma regra de visibilidade do bug relacionado
create policy "bug_anexos_select" on bug_anexos
  for select
  using (
    exists (
      select 1 from bugs b
      where b.id = bug_anexos.bug_id
      and (
        is_dev_user()
        or b.project_id in (
          select p.id from projects p
          join companies c on c.id = p.company_id
          where c.email_domain = auth_user_domain()
        )
      )
    )
  );

create policy "bug_anexos_insert" on bug_anexos
  for insert
  with check (
    exists (
      select 1 from bugs b
      where b.id = bug_anexos.bug_id
      and (
        is_dev_user()
        or b.project_id in (
          select p.id from projects p
          join companies c on c.id = p.company_id
          where c.email_domain = auth_user_domain()
        )
      )
    )
  );
