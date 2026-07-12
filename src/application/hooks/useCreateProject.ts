import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { CreateProjectData } from '../../domain/repositories/IProjectRepository'
import { createProject } from '../../infrastructure/factory'

export function useCreateProject() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateProjectData) => createProject.execute(data),
    onSuccess: (project) => {
      queryClient.invalidateQueries({ queryKey: ['projects', project.companyId] })
      queryClient.invalidateQueries({ queryKey: ['projects', 'all'] })
    },
  })
}
