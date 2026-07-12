import type { Setor } from '../../domain/entities/Setor'
import type { CreateSetorData, ISetorRepository } from '../../domain/repositories/ISetorRepository'
import { supabase } from './client'

interface SetorRow {
  id: string
  company_id: string
  name: string
}

function mapSetor(row: SetorRow): Setor {
  return { id: row.id, companyId: row.company_id, name: row.name }
}

export class SupabaseSetorRepository implements ISetorRepository {
  async listByCompany(companyId: string): Promise<Setor[]> {
    const { data, error } = await supabase
      .from('setores')
      .select('id, company_id, name')
      .eq('company_id', companyId)
      .order('name')

    if (error) throw error
    return (data as SetorRow[]).map(mapSetor)
  }

  async create(data: CreateSetorData): Promise<Setor> {
    const { data: inserted, error } = await supabase
      .from('setores')
      .insert({ company_id: data.companyId, name: data.name })
      .select('id, company_id, name')
      .single()

    if (error) throw error
    return mapSetor(inserted as SetorRow)
  }
}
