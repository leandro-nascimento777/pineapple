import type { Bug } from '../entities/Bug'
import type { IBugRepository } from '../repositories/IBugRepository'

export class ListBugsByCompany {
  private readonly bugRepository: IBugRepository

  constructor(bugRepository: IBugRepository) {
    this.bugRepository = bugRepository
  }

  execute(companyId: string): Promise<Bug[]> {
    return this.bugRepository.listByCompany(companyId)
  }
}
