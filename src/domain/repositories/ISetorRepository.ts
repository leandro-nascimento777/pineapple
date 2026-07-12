import type { Setor } from '../entities/Setor'

export interface CreateSetorData {
  companyId: string
  name: string
}

export interface ISetorRepository {
  listByCompany(companyId: string): Promise<Setor[]>
  create(data: CreateSetorData): Promise<Setor>
}
