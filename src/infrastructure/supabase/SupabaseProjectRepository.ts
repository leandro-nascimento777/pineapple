import type { Project } from '../../domain/entities/Project'
import type { CreateProjectData, IProjectRepository } from '../../domain/repositories/IProjectRepository'
import { supabase } from './client'

interface ProjectRow {
  id: string
  company_id: string
  name: string
  companies: { name: string } | null
}

const PROJECT_SELECT = 'id, company_id, name, companies(name)'

function mapProject(row: ProjectRow): Project {
  return {
    id: row.id,
    companyId: row.company_id,
    companyName: row.companies?.name ?? '',
    name: row.name,
  }
}

export class SupabaseProjectRepository implements IProjectRepository {
  async listByCompany(companyId: string): Promise<Project[]> {
    const { data, error } = await supabase
      .from('projects')
      .select(PROJECT_SELECT)
      .eq('company_id', companyId)
      .order('name')

    if (error) throw error
    return (data as unknown as ProjectRow[]).map(mapProject)
  }

  async listAll(): Promise<Project[]> {
    const { data, error } = await supabase.from('projects').select(PROJECT_SELECT).order('name')

    if (error) throw error
    return (data as unknown as ProjectRow[]).map(mapProject)
  }

  async create(data: CreateProjectData): Promise<Project> {
    const { data: inserted, error } = await supabase
      .from('projects')
      .insert({ company_id: data.companyId, name: data.name })
      .select(PROJECT_SELECT)
      .single()

    if (error) throw error
    return mapProject(inserted as unknown as ProjectRow)
  }
}
