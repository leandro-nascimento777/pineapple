import type { Project } from '../entities/Project'
import type { IProjectRepository } from '../repositories/IProjectRepository'

export class ListProjectsByCompany {
  private readonly projectRepository: IProjectRepository

  constructor(projectRepository: IProjectRepository) {
    this.projectRepository = projectRepository
  }

  /** Sem companyId (usuário dev), lista os projetos de todas as empresas. */
  execute(companyId?: string): Promise<Project[]> {
    if (!companyId) {
      return this.projectRepository.listAll()
    }
    return this.projectRepository.listByCompany(companyId)
  }
}
