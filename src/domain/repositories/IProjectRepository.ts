import type { Project } from '../entities/Project'

export interface CreateProjectData {
  companyId: string
  name: string
}

export interface IProjectRepository {
  listByCompany(companyId: string): Promise<Project[]>
  listAll(): Promise<Project[]>
  create(data: CreateProjectData): Promise<Project>
}
