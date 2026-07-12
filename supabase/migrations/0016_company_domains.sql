-- uma empresa pode ter mais de um domínio de email (ex: matriz + filial,
-- ou domínios legados); substitui companies.email_domain (1:1) por uma
-- tabela 1:N.
create table company_domains (
  id uuid primary key default gen_random_uuid(),
  company_id uuid references companies(id) not null,
  domain text not null unique
);

create index company_domains_company_id_idx on company_domains(company_id);

insert into company_domains (company_id, domain)
select id, email_domain from companies;

alter table companies drop column email_domain;
