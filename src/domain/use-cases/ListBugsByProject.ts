import type { Bug } from '../entities/Bug'
import type { IBugRepository } from '../repositories/IBugRepository'

export class ListBugsByProject {
  private readonly bugRepository: IBugRepository

  constructor(bugRepository: IBugRepository) {
    this.bugRepository = bugRepository
  }

  execute(projectId: string): Promise<Bug[]> {
    return this.bugRepository.listByProject(projectId)
  }
}
