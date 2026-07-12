-- registra quem assumiu o bug (setado quando o status vira em_tratamento),
-- pra o usuário que relatou poder ver quem está cuidando.
-- referencia profiles(id) em vez de auth.users(id) pra permitir embed direto
-- via PostgREST (profiles.id = auth.users.id 1:1, então é equivalente).
alter table bugs add column assumido_por uuid references profiles(id);

create index bugs_assumido_por_idx on bugs(assumido_por);
