-- acesso por projeto: um profile (role='user') só enxerga os projetos aqui
-- listados, em vez de todos os projetos da empresa. Admin decide na hora
-- de cadastrar/editar o usuário.
create table profile_projects (
  profile_id uuid references profiles(id) on delete cascade not null,
  project_id uuid references projects(id) on delete cascade not null,
  primary key (profile_id, project_id)
);

create index profile_projects_project_id_idx on profile_projects(project_id);
