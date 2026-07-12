import type { CompanyDomain } from '../entities/CompanyDomain'
import type { ICompanyDomainRepository } from '../repositories/ICompanyDomainRepository'

export class ListCompanyDomains {
  private readonly companyDomainRepository: ICompanyDomainRepository

  constructor(companyDomainRepository: ICompanyDomainRepository) {
    this.companyDomainRepository = companyDomainRepository
  }

  execute(companyId: string): Promise<CompanyDomain[]> {
    return this.companyDomainRepository.listByCompany(companyId)
  }
}
