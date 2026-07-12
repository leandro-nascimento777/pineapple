-- sem isso, supabase.channel(...).on('postgres_changes', ...) nunca dispara:
-- o Supabase só emite eventos de realtime para tabelas incluídas nesta publication.
alter publication supabase_realtime add table bugs;
