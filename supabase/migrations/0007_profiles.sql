-- perfil explícito por usuário: substitui a inferência por domínio de email
-- (is_dev_user/auth_user_domain) por uma tabela de verdade, permitindo múltiplos
-- admins e edição explícita de quem é quem.
-- 'pending' existe pro intervalo entre o signup/convite (trigger cria a linha
-- sem saber ainda role/empresa) e o admin atribuir role+company_id de fato.
create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  company_id uuid references companies(id),
  role text not null default 'pending' check (role in ('admin', 'user', 'pending')),
  name text not null,
  created_at timestamptz not null default now(),
  constraint role_company_consistency check (
    (role = 'admin' and company_id is null) or
    (role = 'user' and company_id is not null) or
    (role = 'pending' and company_id is null)
  )
);

create index profiles_company_id_idx on profiles(company_id);

-- cria a linha em profiles assim que o auth.users é criado (via convite);
-- o Edge Function de convite só faz update de role/company_id/name depois.
create or replace function handle_new_user() returns trigger as $$
begin
  insert into profiles (id, name, role, company_id) values (new.id, new.email, 'pending', null);
  return new;
end;
$$ language plpgsql security definer set search_path = public;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();
