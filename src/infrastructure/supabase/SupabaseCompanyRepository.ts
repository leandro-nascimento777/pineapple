import type { Company } from '../../domain/entities/Company'
import type { CreateCompanyData, ICompanyRepository } from '../../domain/repositories/ICompanyRepository'
import { supabase } from './client'

interface CompanyRow {
  id: string
  name: string
  email_domain: string
}

function mapCompany(row: CompanyRow): Company {
  return { id: row.id, name: row.name, emailDomain: row.email_domain }
}

export class SupabaseCompanyRepository implements ICompanyRepository {
  async findById(id: string): Promise<Company | null> {
    const { data, error } = await supabase
      .from('companies')
      .select('id, name, email_domain')
      .eq('id', id)
      .maybeSingle()

    if (error) throw error
    return data ? mapCompany(data as CompanyRow) : null
  }

  async listAll(): Promise<Company[]> {
    const { data, error } = await supabase.from('companies').select('id, name, email_domain').order('name')

    if (error) throw error
    return (data as CompanyRow[]).map(mapCompany)
  }

  async create(data: CreateCompanyData): Promise<Company> {
    const { data: inserted, error } = await supabase
      .from('companies')
      .insert({ name: data.name, email_domain: data.emailDomain })
      .select('id, name, email_domain')
      .single()

    if (error) throw error
    return mapCompany(inserted as CompanyRow)
  }
}
