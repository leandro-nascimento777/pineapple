import type { IProfileProjectRepository } from '../repositories/IProfileProjectRepository'

export class ListProjectIdsByProfile {
  private readonly profileProjectRepository: IProfileProjectRepository

  constructor(profileProjectRepository: IProfileProjectRepository) {
    this.profileProjectRepository = profileProjectRepository
  }

  execute(profileId: string): Promise<string[]> {
    return this.profileProjectRepository.listProjectIdsByProfile(profileId)
  }
}
