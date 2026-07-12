import type { Bug } from '../entities/Bug'
import type { IBugRepository } from '../repositories/IBugRepository'

/** Staff assume o bug: sai da fila (aberto) e entra em análise (em_tratamento). */
export class AssumeBug {
  private readonly bugRepository: IBugRepository

  constructor(bugRepository: IBugRepository) {
    this.bugRepository = bugRepository
  }

  execute(bugId: string, assumidoPor: string): Promise<Bug> {
    return this.bugRepository.assume(bugId, assumidoPor)
  }
}
