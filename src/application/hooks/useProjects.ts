import { useQuery } from '@tanstack/react-query'
import { listProjectsByCompany } from '../../infrastructure/factory'

/** Sem companyId (usuário dev), lista os projetos de todas as empresas. */
export function useProjects(companyId?: string) {
  return useQuery({
    queryKey: ['projects', companyId ?? 'all'],
    queryFn: () => listProjectsByCompany.execute(companyId),
  })
}
