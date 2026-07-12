import type { CompanyDomain } from '../../domain/entities/CompanyDomain'
import type {
  CreateCompanyDomainData,
  ICompanyDomainRepository,
} from '../../domain/repositories/ICompanyDomainRepository'
import { supabase } from './client'

interface CompanyDomainRow {
  id: string
  company_id: string
  domain: string
}

function mapCompanyDomain(row: CompanyDomainRow): CompanyDomain {
  return { id: row.id, companyId: row.company_id, domain: row.domain }
}

export class SupabaseCompanyDomainRepository implements ICompanyDomainRepository {
  async listByCompany(companyId: string): Promise<CompanyDomain[]> {
    const { data, error } = await supabase
      .from('company_domains')
      .select('id, company_id, domain')
      .eq('company_id', companyId)
      .order('domain')

    if (error) throw error
    return (data as CompanyDomainRow[]).map(mapCompanyDomain)
  }

  async create(data: CreateCompanyDomainData): Promise<CompanyDomain> {
    const { data: inserted, error } = await supabase
      .from('company_domains')
      .insert({ company_id: data.companyId, domain: data.domain })
      .select('id, company_id, domain')
      .single()

    if (error) throw error
    return mapCompanyDomain(inserted as CompanyDomainRow)
  }

  async remove(id: string): Promise<void> {
    const { error } = await supabase.from('company_domains').delete().eq('id', id)
    if (error) throw error
  }
}
