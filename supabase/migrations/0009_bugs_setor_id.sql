-- setor deixa de ser texto livre e passa a referenciar o catálogo da empresa;
-- tabela bugs está vazia (sem dados reais ainda), então a troca é direta.
alter table bugs
  drop column setor,
  add column setor_id uuid not null references setores(id);

create index bugs_setor_id_idx on bugs(setor_id);
