-- 'dev' passa a ser um papel de sistema distinto de 'admin': atua em bugs de
-- qualquer empresa, mas não gerencia empresas/projetos/setores/usuários.
alter table profiles drop constraint role_company_consistency;
alter table profiles drop constraint profiles_role_check;

alter table profiles add constraint profiles_role_check
  check (role in ('admin', 'dev', 'user', 'pending'));

alter table profiles add constraint role_company_consistency check (
  (role in ('admin', 'dev') and company_id is null) or
  (role = 'user' and company_id is not null) or
  (role = 'pending' and company_id is null)
);
