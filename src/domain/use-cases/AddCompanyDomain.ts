import type { CompanyDomain } from '../entities/CompanyDomain'
import type { CreateCompanyDomainData, ICompanyDomainRepository } from '../repositories/ICompanyDomainRepository'

export class AddCompanyDomain {
  private readonly companyDomainRepository: ICompanyDomainRepository

  constructor(companyDomainRepository: ICompanyDomainRepository) {
    this.companyDomainRepository = companyDomainRepository
  }

  execute(data: CreateCompanyDomainData): Promise<CompanyDomain> {
    return this.companyDomainRepository.create(data)
  }
}
