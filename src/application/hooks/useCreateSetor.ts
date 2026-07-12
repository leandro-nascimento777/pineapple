import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { CreateSetorData } from '../../domain/repositories/ISetorRepository'
import { createSetor } from '../../infrastructure/factory'

export function useCreateSetor() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateSetorData) => createSetor.execute(data),
    onSuccess: (setor) => {
      queryClient.invalidateQueries({ queryKey: ['setores', setor.companyId] })
    },
  })
}
