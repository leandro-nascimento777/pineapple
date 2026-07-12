import type { IStorageRepository } from '../repositories/IStorageRepository'

export class GetBugAnexoUrl {
  private readonly storageRepository: IStorageRepository

  constructor(storageRepository: IStorageRepository) {
    this.storageRepository = storageRepository
  }

  execute(storagePath: string): Promise<string> {
    return this.storageRepository.getBugAnexoUrl(storagePath)
  }
}
