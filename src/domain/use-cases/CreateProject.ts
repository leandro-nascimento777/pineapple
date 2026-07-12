import type { Project } from '../entities/Project'
import type { CreateProjectData, IProjectRepository } from '../repositories/IProjectRepository'

export class CreateProject {
  private readonly projectRepository: IProjectRepository

  constructor(projectRepository: IProjectRepository) {
    this.projectRepository = projectRepository
  }

  execute(data: CreateProjectData): Promise<Project> {
    return this.projectRepository.create(data)
  }
}
