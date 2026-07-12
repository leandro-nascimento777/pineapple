import type { Bug, BugAnexo, BugStatus } from '../../domain/entities/Bug'
import type {
  CreateBugData,
  IBugRepository,
  ResolveBugData,
  SubscribeToChangesParams,
} from '../../domain/repositories/IBugRepository'
import { supabase } from './client'
import { SupabaseRealtimeAdapter } from './SupabaseRealtimeAdapter'

interface BugAnexoRow {
  id: string
  bug_id: string
  storage_path: string
  created_at: string
}

interface BugRow {
  id: string
  project_id: string
  titulo: string
  descricao: string
  setor_id: string
  setores: { name: string } | null
  status: BugStatus
  parecer: string | null
  criado_por: string
  resolvido_por: string | null
  created_at: string
  resolved_at: string | null
  bug_anexos: BugAnexoRow[] | null
}

const BUG_SELECT = '*, setores(name), bug_anexos(*)'

function mapAnexo(row: BugAnexoRow): BugAnexo {
  return { id: row.id, bugId: row.bug_id, storagePath: row.storage_path, createdAt: row.created_at }
}

function mapBug(row: BugRow): Bug {
  return {
    id: row.id,
    projectId: row.project_id,
    titulo: row.titulo,
    descricao: row.descricao,
    setorId: row.setor_id,
    setorNome: row.setores?.name ?? '',
    status: row.status,
    parecer: row.parecer,
    criadoPor: row.criado_por,
    resolvidoPor: row.resolvido_por,
    createdAt: row.created_at,
    resolvedAt: row.resolved_at,
    anexos: (row.bug_anexos ?? []).map(mapAnexo),
  }
}

export class SupabaseBugRepository implements IBugRepository {
  private readonly realtimeAdapter = new SupabaseRealtimeAdapter()

  async create(data: CreateBugData): Promise<Bug> {
    const { data: inserted, error } = await supabase
      .from('bugs')
      .insert({
        project_id: data.projectId,
        titulo: data.titulo,
        descricao: data.descricao,
        setor_id: data.setorId,
        criado_por: data.criadoPor,
      })
      .select(BUG_SELECT)
      .single()

    if (error) throw error

    if (data.anexoStoragePath) {
      const { error: anexoError } = await supabase
        .from('bug_anexos')
        .insert({ bug_id: inserted.id, storage_path: data.anexoStoragePath })

      if (anexoError) throw anexoError

      return this.getById(inserted.id)
    }

    return mapBug(inserted as BugRow)
  }

  async assume(bugId: string): Promise<Bug> {
    const { data: updated, error } = await supabase
      .from('bugs')
      .update({ status: 'em_tratamento' satisfies BugStatus })
      .eq('id', bugId)
      .select(BUG_SELECT)
      .single()

    if (error) throw error
    return mapBug(updated as BugRow)
  }

  async resolve(data: ResolveBugData): Promise<Bug> {
    const { data: updated, error } = await supabase
      .from('bugs')
      .update({
        status: 'resolvido' satisfies BugStatus,
        parecer: data.parecer,
        resolvido_por: data.resolvidoPor,
        resolved_at: new Date().toISOString(),
      })
      .eq('id', data.bugId)
      .select(BUG_SELECT)
      .single()

    if (error) throw error
    return mapBug(updated as BugRow)
  }

  async listByProject(projectId: string): Promise<Bug[]> {
    const { data, error } = await supabase
      .from('bugs')
      .select(BUG_SELECT)
      .eq('project_id', projectId)
      .order('created_at', { ascending: false })

    if (error) throw error
    return (data as BugRow[]).map(mapBug)
  }

  subscribeToChanges(params: SubscribeToChangesParams, onChange: (bug: Bug) => void): () => void {
    return this.realtimeAdapter.subscribeToBugChanges(params, onChange)
  }

  private async getById(bugId: string): Promise<Bug> {
    const { data, error } = await supabase.from('bugs').select(BUG_SELECT).eq('id', bugId).single()
    if (error) throw error
    return mapBug(data as BugRow)
  }
}
