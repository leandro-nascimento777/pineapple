import type { Profile } from '../entities/Profile'
import type { IProfileRepository } from '../repositories/IProfileRepository'

export class ListProfiles {
  private readonly profileRepository: IProfileRepository

  constructor(profileRepository: IProfileRepository) {
    this.profileRepository = profileRepository
  }

  execute(): Promise<Profile[]> {
    return this.profileRepository.listAll()
  }
}
