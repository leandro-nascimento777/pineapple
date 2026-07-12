import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { CreateBugInput } from '../../domain/use-cases/CreateBug'
import { createBug } from '../../infrastructure/factory'

export function useCreateBug() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (input: CreateBugInput) => createBug.execute(input),
    onSuccess: (bug) => {
      queryClient.invalidateQueries({ queryKey: ['bugs', bug.projectId] })
    },
  })
}
