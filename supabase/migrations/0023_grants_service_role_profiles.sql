-- admin-invite-user roda com a service role key e escreve diretamente em
-- profiles/profile_projects (não via trigger security definer) para
-- atribuir role/empresa/projetos logo após criar o usuário. A service role
-- ignora RLS (bypassrls), mas ainda precisa dos grants de tabela — nunca
-- tinha sido concedido, então esse passo falhava com "permission denied".
grant update on public.profiles to service_role;
grant insert on public.profile_projects to service_role;
