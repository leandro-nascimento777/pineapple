create extension if not exists pgcrypto;

-- empresas clientes, identificadas pelo domínio do email
create table companies (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email_domain text not null unique
);

-- projetos dentro de cada empresa (ex: Onboarding, Copilot, WhatsApp Helpdesk)
create table projects (
  id uuid primary key default gen_random_uuid(),
  company_id uuid references companies(id) not null,
  name text not null
);

-- bugs, sempre ligados a um projeto
create table bugs (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references projects(id) not null,
  titulo text not null,
  descricao text not null,
  setor text not null,
  status text not null default 'aberto' check (status in ('aberto', 'em_tratamento', 'resolvido')),
  parecer text,
  criado_por uuid references auth.users(id) not null,
  resolvido_por uuid references auth.users(id),
  created_at timestamptz not null default now(),
  resolved_at timestamptz
);

-- anexos de imagem/print
create table bug_anexos (
  id uuid primary key default gen_random_uuid(),
  bug_id uuid references bugs(id) not null,
  storage_path text not null,
  created_at timestamptz not null default now()
);

create index bugs_project_id_idx on bugs(project_id);
create index bug_anexos_bug_id_idx on bug_anexos(bug_id);
create index projects_company_id_idx on projects(company_id);
