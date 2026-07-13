-- UPDATE ... WHERE e INSERT ... RETURNING (usado implicitamente pelo
-- supabase-js) exigem SELECT além do privilégio de escrita em si.
grant select on public.profiles to service_role;
grant select on public.profile_projects to service_role;
