-- setores (departamentos) de uma empresa, cadastrados pelo admin; substituem
-- o enum de texto livre que existia hardcoded no front (SETORES em bug.schema.ts)
create table setores (
  id uuid primary key default gen_random_uuid(),
  company_id uuid references companies(id) not null,
  name text not null,
  unique (company_id, name)
);

create index setores_company_id_idx on setores(company_id);
