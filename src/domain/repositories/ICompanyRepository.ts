import type { Company } from '../entities/Company'

export interface CreateCompanyData {
  name: string
}

export interface ICompanyRepository {
  findById(id: string): Promise<Company | null>
  listAll(): Promise<Company[]>
  create(data: CreateCompanyData): Promise<Company>
}
