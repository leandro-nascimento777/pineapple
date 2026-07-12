import type { CompanyDomain } from '../entities/CompanyDomain'

export interface CreateCompanyDomainData {
  companyId: string
  domain: string
}

export interface ICompanyDomainRepository {
  listByCompany(companyId: string): Promise<CompanyDomain[]>
  create(data: CreateCompanyDomainData): Promise<CompanyDomain>
  remove(id: string): Promise<void>
}
