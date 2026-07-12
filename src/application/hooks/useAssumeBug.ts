import { useMutation, useQueryClient } from '@tanstack/react-query'
import { assumeBug } from '../../infrastructure/factory'

export function useAssumeBug() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ bugId, assumidoPor }: { bugId: string; assumidoPor: string }) =>
      assumeBug.execute(bugId, assumidoPor),
    onSuccess: (bug) => {
      queryClient.invalidateQueries({ queryKey: ['bugs', bug.projectId] })
      queryClient.invalidateQueries({ queryKey: ['bugs-by-company'] })
    },
  })
}
