import type { Company } from '../entities/Company'
import type { ICompanyRepository } from '../repositories/ICompanyRepository'

export class ListCompanies {
  private readonly companyRepository: ICompanyRepository

  constructor(companyRepository: ICompanyRepository) {
    this.companyRepository = companyRepository
  }

  execute(): Promise<Company[]> {
    return this.companyRepository.listAll()
  }
}
