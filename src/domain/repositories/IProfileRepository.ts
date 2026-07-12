import type { Profile, ProfileRole } from '../entities/Profile'

export interface UpdateProfileData {
  userId: string
  role: ProfileRole
  companyId: string | null
  name?: string
}

export interface IProfileRepository {
  findById(userId: string): Promise<Profile | null>
  listAll(): Promise<Profile[]>
  update(data: UpdateProfileData): Promise<Profile>
}
