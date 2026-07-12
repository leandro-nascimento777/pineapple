import type { Bug } from '../entities/Bug'
import type { IBugRepository, SubscribeToChangesParams } from '../repositories/IBugRepository'

export class SubscribeToBugUpdates {
  private readonly bugRepository: IBugRepository

  constructor(bugRepository: IBugRepository) {
    this.bugRepository = bugRepository
  }

  /** Retorna uma função de unsubscribe. */
  execute(params: SubscribeToChangesParams, onChange: (bug: Bug) => void): () => void {
    return this.bugRepository.subscribeToChanges(params, onChange)
  }
}
