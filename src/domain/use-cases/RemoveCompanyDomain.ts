import type { ICompanyDomainRepository } from '../repositories/ICompanyDomainRepository'

export class RemoveCompanyDomain {
  private readonly companyDomainRepository: ICompanyDomainRepository

  constructor(companyDomainRepository: ICompanyDomainRepository) {
    this.companyDomainRepository = companyDomainRepository
  }

  execute(id: string): Promise<void> {
    return this.companyDomainRepository.remove(id)
  }
}
