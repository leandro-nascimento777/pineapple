import type { RealtimePostgresChangesPayload } from '@supabase/supabase-js'
import type { Bug, BugStatus } from '../../domain/entities/Bug'
import type { SubscribeToChangesParams } from '../../domain/repositories/IBugRepository'
import { supabase } from './client'

interface BugRow {
  id: string
  project_id: string
  titulo: string
  descricao: string
  setor_id: string
  status: BugStatus
  parecer: string | null
  criado_por: string
  resolvido_por: string | null
  created_at: string
  resolved_at: string | null
}

/** O payload de realtime não traz bug_anexos nem o nome do setor (sem join); quem consome deve refazer a query se precisar deles. */
function mapBugRow(row: BugRow): Bug {
  return {
    id: row.id,
    projectId: row.project_id,
    titulo: row.titulo,
    descricao: row.descricao,
    setorId: row.setor_id,
    setorNome: '',
    status: row.status,
    parecer: row.parecer,
    criadoPor: row.criado_por,
    resolvidoPor: row.resolvido_por,
    createdAt: row.created_at,
    resolvedAt: row.resolved_at,
    anexos: [],
  }
}

export class SupabaseRealtimeAdapter {
  subscribeToBugChanges(params: SubscribeToChangesParams, onChange: (bug: Bug) => void): () => void {
    const channelName = params.projectId ? `bugs:project:${params.projectId}` : 'bugs:all'

    const channel = supabase
      .channel(channelName)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'bugs',
          ...(params.projectId ? { filter: `project_id=eq.${params.projectId}` } : {}),
        },
        (payload: RealtimePostgresChangesPayload<BugRow>) => {
          const row = (payload.new as BugRow | undefined) ?? (payload.old as BugRow | undefined)
          if (row) onChange(mapBugRow(row))
        },
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }
}
