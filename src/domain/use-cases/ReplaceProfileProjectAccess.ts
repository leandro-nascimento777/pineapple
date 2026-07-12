import type { IProfileProjectRepository } from '../repositories/IProfileProjectRepository'

export class ReplaceProfileProjectAccess {
  private readonly profileProjectRepository: IProfileProjectRepository

  constructor(profileProjectRepository: IProfileProjectRepository) {
    this.profileProjectRepository = profileProjectRepository
  }

  execute(profileId: string, projectIds: string[]): Promise<void> {
    return this.profileProjectRepository.replaceForProfile(profileId, projectIds)
  }
}
