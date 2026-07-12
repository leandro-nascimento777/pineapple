import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { CreateCompanyData } from '../../domain/repositories/ICompanyRepository'
import { createCompany } from '../../infrastructure/factory'

export function useCreateCompany() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateCompanyData) => createCompany.execute(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['companies'] })
    },
  })
}
