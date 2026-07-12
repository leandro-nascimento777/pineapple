import type { IProfileProjectRepository } from '../../domain/repositories/IProfileProjectRepository'
import { supabase } from './client'

interface ProfileProjectRow {
  project_id: string
}

export class SupabaseProfileProjectRepository implements IProfileProjectRepository {
  async listProjectIdsByProfile(profileId: string): Promise<string[]> {
    const { data, error } = await supabase
      .from('profile_projects')
      .select('project_id')
      .eq('profile_id', profileId)

    if (error) throw error
    return (data as ProfileProjectRow[]).map((row) => row.project_id)
  }

  async replaceForProfile(profileId: string, projectIds: string[]): Promise<void> {
    const { error: deleteError } = await supabase.from('profile_projects').delete().eq('profile_id', profileId)
    if (deleteError) throw deleteError

    if (projectIds.length === 0) return

    const { error: insertError } = await supabase
      .from('profile_projects')
      .insert(projectIds.map((projectId) => ({ profile_id: profileId, project_id: projectId })))

    if (insertError) throw insertError
  }
}
