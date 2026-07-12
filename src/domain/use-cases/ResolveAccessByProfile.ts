import type { Company } from '../entities/Company'
import type { ICompanyRepository } from '../repositories/ICompanyRepository'
import type { IProfileRepository } from '../repositories/IProfileRepository'

export type AccessResolution =
  | { type: 'admin' }
  | { type: 'dev' }
  | { type: 'company'; company: Company }
  | { type: 'pending' }

export class ResolveAccessByProfile {
  private readonly profileRepository: IProfileRepository
  private readonly companyRepository: ICompanyRepository

  constructor(profileRepository: IProfileRepository, companyRepository: ICompanyRepository) {
    this.profileRepository = profileRepository
    this.companyRepository = companyRepository
  }

  async execute(userId: string): Promise<AccessResolution> {
    const profile = await this.profileRepository.findById(userId)

    if (!profile || profile.role === 'pending') {
      return { type: 'pending' }
    }

    if (profile.role === 'admin') {
      return { type: 'admin' }
    }

    if (profile.role === 'dev') {
      return { type: 'dev' }
    }

    const company = profile.companyId ? await this.companyRepository.findById(profile.companyId) : null
    if (!company) {
      return { type: 'pending' }
    }

    return { type: 'company', company }
  }
}
