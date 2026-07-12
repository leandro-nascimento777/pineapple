import type { Bug } from '../entities/Bug'
import type { IBugRepository } from '../repositories/IBugRepository'
import type { IStorageRepository } from '../repositories/IStorageRepository'

export interface CreateBugInput {
  projectId: string
  titulo: string
  descricao: string
  setorId: string
  criadoPor: string
  anexo?: File
}

export class CreateBug {
  private readonly bugRepository: IBugRepository
  private readonly storageRepository: IStorageRepository

  constructor(bugRepository: IBugRepository, storageRepository: IStorageRepository) {
    this.bugRepository = bugRepository
    this.storageRepository = storageRepository
  }

  async execute(input: CreateBugInput): Promise<Bug> {
    const anexoStoragePath = input.anexo
      ? await this.storageRepository.uploadBugAnexo(input.anexo)
      : undefined

    return this.bugRepository.create({
      projectId: input.projectId,
      titulo: input.titulo,
      descricao: input.descricao,
      setorId: input.setorId,
      criadoPor: input.criadoPor,
      anexoStoragePath,
    })
  }
}
