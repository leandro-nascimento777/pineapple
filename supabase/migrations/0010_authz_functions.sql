-- substituem is_dev_user()/auth_user_domain(): a partir de agora a autorização
-- vem de profiles (dado explícito), não de inferência por domínio de email.
-- security definer é necessário para evitar recursão de RLS ao ler profiles
-- de dentro de uma policy da própria tabela profiles.
create or replace function is_admin() returns boolean as $$
  select exists (select 1 from profiles where id = auth.uid() and role = 'admin');
$$ language sql stable security definer set search_path = public;

create or replace function current_company_id() returns uuid as $$
  select company_id from profiles where id = auth.uid();
$$ language sql stable security definer set search_path = public;
