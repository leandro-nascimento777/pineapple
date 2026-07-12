import type { Setor } from '../entities/Setor'
import type { CreateSetorData, ISetorRepository } from '../repositories/ISetorRepository'

export class CreateSetor {
  private readonly setorRepository: ISetorRepository

  constructor(setorRepository: ISetorRepository) {
    this.setorRepository = setorRepository
  }

  execute(data: CreateSetorData): Promise<Setor> {
    return this.setorRepository.create(data)
  }
}
