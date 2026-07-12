import type { Profile } from '../entities/Profile'
import type { IProfileRepository, UpdateProfileData } from '../repositories/IProfileRepository'

export class UpdateProfile {
  private readonly profileRepository: IProfileRepository

  constructor(profileRepository: IProfileRepository) {
    this.profileRepository = profileRepository
  }

  execute(data: UpdateProfileData): Promise<Profile> {
    return this.profileRepository.update(data)
  }
}
