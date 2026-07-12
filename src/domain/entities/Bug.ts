export type BugStatus = 'aberto' | 'em_tratamento' | 'resolvido'

export interface BugAnexo {
  id: string
  bugId: string
  storagePath: string
  createdAt: string
}

export interface Bug {
  id: string
  projectId: string
  titulo: string
  descricao: string
  setorId: string
  setorNome: string
  status: BugStatus
  parecer: string | null
  criadoPor: string
  resolvidoPor: string | null
  createdAt: string
  resolvedAt: string | null
  anexos: BugAnexo[]
}
