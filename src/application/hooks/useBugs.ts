import { useQuery } from '@tanstack/react-query'
import { listBugsByProject } from '../../infrastructure/factory'

export function useBugs(projectId: string | undefined) {
  return useQuery({
    queryKey: ['bugs', projectId],
    queryFn: () => listBugsByProject.execute(projectId as string),
    enabled: Boolean(projectId),
  })
}
