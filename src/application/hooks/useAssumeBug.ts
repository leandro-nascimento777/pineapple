import { useMutation, useQueryClient } from '@tanstack/react-query'
import { assumeBug } from '../../infrastructure/factory'

export function useAssumeBug() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (bugId: string) => assumeBug.execute(bugId),
    onSuccess: (bug) => {
      queryClient.invalidateQueries({ queryKey: ['bugs', bug.projectId] })
    },
  })
}
