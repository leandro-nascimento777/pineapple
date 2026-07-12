import type { Bug } from '../entities/Bug'

export interface CreateBugData {
  projectId: string
  titulo: string
  descricao: string
  setorId: string
  criadoPor: string
  anexoStoragePath?: string
}

export interface ResolveBugData {
  bugId: string
  parecer: string
  resolvidoPor: string
}

export interface SubscribeToChangesParams {
  projectId?: string
}

export interface IBugRepository {
  create(data: CreateBugData): Promise<Bug>
  assume(bugId: string, assumidoPor: string): Promise<Bug>
  resolve(data: ResolveBugData): Promise<Bug>
  listByProject(projectId: string): Promise<Bug[]>
  listByCompany(companyId: string): Promise<Bug[]>
  subscribeToChanges(params: SubscribeToChangesParams, onChange: (bug: Bug) => void): () => void
}
