import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { ResolveBugInput } from '../../domain/use-cases/ResolveBug'
import { resolveBug } from '../../infrastructure/factory'

export function useResolveBug() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (input: ResolveBugInput) => resolveBug.execute(input),
    onSuccess: (bug) => {
      queryClient.invalidateQueries({ queryKey: ['bugs', bug.projectId] })
    },
  })
}
