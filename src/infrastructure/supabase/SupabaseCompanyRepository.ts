import type { Company } from '../../domain/entities/Company'
import type { CreateCompanyData, ICompanyRepository } from '../../domain/repositories/ICompanyRepository'
import { supabase } from './client'

interface CompanyRow {
  id: string
  name: string
}

function mapCompany(row: CompanyRow): Company {
  return { id: row.id, name: row.name }
}

export class SupabaseCompanyRepository implements ICompanyRepository {
  async findById(id: string): Promise<Company | null> {
    const { data, error } = await supabase.from('companies').select('id, name').eq('id', id).maybeSingle()

    if (error) throw error
    return data ? mapCompany(data as CompanyRow) : null
  }

  async listAll(): Promise<Company[]> {
    const { data, error } = await supabase.from('companies').select('id, name').order('name')

    if (error) throw error
    return (data as CompanyRow[]).map(mapCompany)
  }

  async create(data: CreateCompanyData): Promise<Company> {
    const { data: inserted, error } = await supabase
      .from('companies')
      .insert({ name: data.name })
      .select('id, name')
      .single()

    if (error) throw error
    return mapCompany(inserted as CompanyRow)
  }
}
