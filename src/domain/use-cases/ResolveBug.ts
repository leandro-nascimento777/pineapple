import type { Bug } from '../entities/Bug'
import type { IBugRepository } from '../repositories/IBugRepository'

export interface ResolveBugInput {
  bugId: string
  parecer: string
  resolvidoPor: string
}

export class ResolveBug {
  private readonly bugRepository: IBugRepository

  constructor(bugRepository: IBugRepository) {
    this.bugRepository = bugRepository
  }

  execute(input: ResolveBugInput): Promise<Bug> {
    return this.bugRepository.resolve(input)
  }
}
