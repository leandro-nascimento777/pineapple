import type { Company } from '../entities/Company'
import type { CreateCompanyData, ICompanyRepository } from '../repositories/ICompanyRepository'

export class CreateCompany {
  private readonly companyRepository: ICompanyRepository

  constructor(companyRepository: ICompanyRepository) {
    this.companyRepository = companyRepository
  }

  execute(data: CreateCompanyData): Promise<Company> {
    return this.companyRepository.create(data)
  }
}
