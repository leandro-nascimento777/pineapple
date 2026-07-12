import type { Setor } from '../entities/Setor'
import type { ISetorRepository } from '../repositories/ISetorRepository'

export class ListSetoresByCompany {
  private readonly setorRepository: ISetorRepository

  constructor(setorRepository: ISetorRepository) {
    this.setorRepository = setorRepository
  }

  execute(companyId: string): Promise<Setor[]> {
    return this.setorRepository.listByCompany(companyId)
  }
}
