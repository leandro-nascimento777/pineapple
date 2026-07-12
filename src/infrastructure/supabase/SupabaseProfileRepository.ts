import type { Profile } from '../../domain/entities/Profile'
import type { IProfileRepository, UpdateProfileData } from '../../domain/repositories/IProfileRepository'
import { supabase } from './client'

interface ProfileRow {
  id: string
  company_id: string | null
  role: Profile['role']
  name: string
}

function mapProfile(row: ProfileRow): Profile {
  return { id: row.id, companyId: row.company_id, role: row.role, name: row.name }
}

export class SupabaseProfileRepository implements IProfileRepository {
  async findById(userId: string): Promise<Profile | null> {
    const { data, error } = await supabase
      .from('profiles')
      .select('id, company_id, role, name')
      .eq('id', userId)
      .maybeSingle()

    if (error) throw error
    return data ? mapProfile(data as ProfileRow) : null
  }

  async listAll(): Promise<Profile[]> {
    const { data, error } = await supabase.from('profiles').select('id, company_id, role, name').order('name')

    if (error) throw error
    return (data as ProfileRow[]).map(mapProfile)
  }

  async update(data: UpdateProfileData): Promise<Profile> {
    const { data: updated, error } = await supabase
      .from('profiles')
      .update({ role: data.role, company_id: data.companyId, ...(data.name ? { name: data.name } : {}) })
      .eq('id', data.userId)
      .select('id, company_id, role, name')
      .single()

    if (error) throw error
    return mapProfile(updated as ProfileRow)
  }
}
